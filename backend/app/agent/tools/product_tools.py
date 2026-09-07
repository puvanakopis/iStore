import re
from typing import List, Dict, Any, Optional
from langchain_core.tools import tool
from app.core.database import get_db


def _parse_price(price: Any) -> Optional[float]:
    """Parse numeric price from int, float, or string like '$999', 'Rs. 329,900', '1199'."""
    if price is None:
        return None
    if isinstance(price, (int, float)):
        return float(price)
    text = str(price).strip()
    clean = re.sub(r"[^\d.]", "", text)
    if not clean:
        return None
    try:
        return float(clean)
    except ValueError:
        return None


def _format_price(price: Any) -> str:
    """Format price nicely with currency representation."""
    val = _parse_price(price)
    if val is not None:
        return f"Rs. {val:,.0f}"
    return str(price) if price else "N/A"


async def _fetch_product_by_id_or_query(db, product_id: Optional[str] = None, product_query: Optional[str] = None) -> Optional[Dict[str, Any]]:
    """Helper to fetch a single product by ID or name/title search."""
    if product_id:
        p = await db["products"].find_one({"_id": product_id})
        if p:
            p["id"] = str(p["_id"])
            return p

    if product_query and product_query.strip():
        clean_q = product_query.strip()
        regex = re.compile(re.escape(clean_q), re.IGNORECASE)
        # Try exact title regex first, then general search
        p = await db["products"].find_one({"title": regex})
        if not p:
            p = await db["products"].find_one({
                "$or": [
                    {"title": regex},
                    {"subtitle": regex},
                    {"category": regex},
                    {"tags": regex},
                ]
            })
        if not p:
            # Fallback to match first word (e.g. 'iPhone')
            first_word = clean_q.split()[0]
            p = await db["products"].find_one({"title": re.compile(re.escape(first_word), re.IGNORECASE)})
        if p:
            p["id"] = str(p["_id"])
            return p

    return None


async def _fetch_all_matching_products(db) -> List[Dict[str, Any]]:
    """Fetch all products from database and normalize id."""
    cursor = db["products"].find({})
    products = await cursor.to_list(length=200)
    for p in products:
        p["id"] = str(p["_id"])
    return products


@tool(return_direct=True)
async def search_products(
    query: Optional[str] = None,
    category: Optional[str] = None,
    max_price: Optional[float] = None,
    min_price: Optional[float] = None,
    color: Optional[str] = None,
    storage: Optional[str] = None,
    tags: Optional[List[str]] = None,
) -> str:
    """Search products using title, category, price range (min_price, max_price), colors, storage, or tags.

    Parameters:
    - query: Search keyword for title, features, or specs (e.g. 'iPhone 16', 'titanium', 'camera').
    - category: Category filter (e.g. 'iPhone', 'Mac', 'iPad', 'Watch', 'AirPods').
    - max_price: Maximum budget price limit.
    - min_price: Minimum price filter.
    - color: Preferred color (e.g. 'Black', 'Natural Titanium').
    - storage: Storage size (e.g. '256GB', '512GB', '1TB').
    - tags: Filter tags (e.g. ['photography', 'premium']).
    """
    db = get_db()
    if db is None:
        return "Sorry, the database is not available right now."

    all_products = await _fetch_all_matching_products(db)
    filtered = []

    for p in all_products:
        p_cat = (p.get("category") or "").lower()
        p_title = (p.get("title") or "").lower()

        # Category filter with fallback to title/tags
        if category and category.strip():
            c_target = category.strip().lower()
            if p_cat:
                if c_target not in p_cat and p_cat not in c_target:
                    continue
            else:
                p_tags_str = " ".join(p.get("tags") or []).lower()
                if c_target not in p_title and c_target not in p_tags_str:
                    continue

        # Query filter across title, subtitle, category, tags, colors, specs, features
        if query and query.strip():
            q = query.strip().lower()
            st = (p.get("subtitle") or "").lower()
            tg = " ".join(p.get("tags") or []).lower()
            colors_str = " ".join([c.get("name", "") for c in (p.get("colors") or [])]).lower()
            specs_str = str(p.get("specifications") or {}).lower()
            feats_str = str(p.get("features") or []).lower()

            if not any(q in item for item in [p_title, st, p_cat, tg, colors_str, specs_str, feats_str]):
                continue

        # Color filter
        if color and color.strip():
            c_name = color.strip().lower()
            colors = [(c.get("name") or "").lower() for c in (p.get("colors") or [])]
            if not any(c_name in col for col in colors):
                continue

        # Storage filter
        if storage and storage.strip():
            s_val = storage.strip().lower()
            storages = [(s.get("size") or "").lower() for s in (p.get("storage") or [])]
            if not any(s_val in st for st in storages):
                continue

        # Tags filter
        if tags:
            p_tags = [t.lower() for t in (p.get("tags") or [])]
            if not any(t.lower() in p_tags for t in tags):
                continue

        # Price range filter
        p_num = _parse_price(p.get("price"))
        storage_prices = [_parse_price(s.get("price")) for s in (p.get("storage") or [])]
        storage_prices = [sp for sp in storage_prices if sp is not None]

        effective_prices = ([p_num] if p_num is not None else []) + storage_prices
        if not effective_prices:
            effective_prices = [0.0]

        min_effective = min(effective_prices)
        max_effective = max(effective_prices)

        if max_price is not None and min_effective > max_price and p_num and p_num > max_price:
            continue
        if min_price is not None and max_effective < min_price:
            continue

        filtered.append(p)

    if not filtered:
        filters_desc = []
        if query:
            filters_desc.append(f'query="{query}"')
        if category:
            filters_desc.append(f'category="{category}"')
        if max_price:
            filters_desc.append(f'max_price={max_price}')
        if min_price:
            filters_desc.append(f'min_price={min_price}')
        if color:
            filters_desc.append(f'color="{color}"')
        if storage:
            filters_desc.append(f'storage="{storage}"')
        desc_str = f" with criteria ({', '.join(filters_desc)})" if filters_desc else ""
        return f"No products found matching your search{desc_str}."

    lines = [f"Found {len(filtered)} product(s) matching your criteria:", ""]
    for i, p in enumerate(filtered, 1):
        price_str = _format_price(p.get("price"))
        cat_str = f" | Category: {p.get('category')}" if p.get("category") else ""
        lines.append(f"{i}. **{p.get('title')}** (ID: `{p.get('id')}`) — {price_str}{cat_str}")
        if p.get("colors"):
            color_names = [c.get("name") for c in p["colors"] if c.get("name")]
            if color_names:
                lines.append(f"   - Colors: {', '.join(color_names)}")
        if p.get("storage"):
            storage_sizes = [s.get("size") for s in p["storage"] if s.get("size")]
            if storage_sizes:
                lines.append(f"   - Storage: {', '.join(storage_sizes)}")

    lines.append("")
    lines.append("Let me know if you would like full details, variant info, or to compare any of these products!")
    return "\n".join(lines)


@tool(return_direct=True)
async def get_product(
    product_id: Optional[str] = None,
    product_query: Optional[str] = None,
) -> str:
    """Get full details for a product by ID or title including Specs, Colors, Storage, Features, and Reviews.

    Parameters:
    - product_id: Product ID (e.g. 'product_01').
    - product_query: Product title/name query (e.g. 'iPhone 16 Pro').
    """
    db = get_db()
    if db is None:
        return "Sorry, the database is not available right now."

    product = await _fetch_product_by_id_or_query(db, product_id, product_query)
    if not product:
        identifier = f"ID '{product_id}'" if product_id else f"query '{product_query}'"
        return f"Product with {identifier} was not found in iStore."

    title = product.get("title", "Unknown Product")
    p_id = product.get("id")
    subtitle = product.get("subtitle", "")
    price = _format_price(product.get("price"))
    category = product.get("category")

    lines = [
        f"## {title}",
        f"**Product ID:** `{p_id}`",
        f"**Starting Price:** {price}",
    ]
    if subtitle:
        lines.append(f"**Subtitle:** {subtitle}")
    if category:
        lines.append(f"**Category:** {category}")

    lines.append("")

    # Colors
    colors = product.get("colors") or []
    if colors:
        c_list = [c.get("name", "") for c in colors if c.get("name")]
        if c_list:
            lines.append(f"**Available Colors:** {', '.join(c_list)}")

    # Storage
    storage = product.get("storage") or []
    if storage:
        lines.append("**Storage Tiers:**")
        for s in storage:
            lines.append(f"- {s.get('size')}: {_format_price(s.get('price'))}")

    # Specs
    specs = product.get("specifications")
    if specs:
        lines.append("")
        lines.append("**Key Specifications:**")
        if isinstance(specs, dict):
            for k, v in specs.items():
                if v:
                    lines.append(f"- **{k.replace('_', ' ').title()}:** {v}")

    # Features
    features = product.get("features") or []
    if features:
        lines.append("")
        lines.append("**Highlight Features:**")
        for f in features:
            lines.append(f"- **{f.get('title')}:** {f.get('description')}")

    # Reviews
    reviews = product.get("reviews") or []
    if reviews:
        ratings = [r.get("rating", 0) for r in reviews if isinstance(r.get("rating"), (int, float))]
        avg_rating = sum(ratings) / len(ratings) if ratings else 0
        lines.append("")
        lines.append(f"**Customer Reviews (Average: {avg_rating:.1f}/5 stars from {len(reviews)} reviews):**")
        for r in reviews[:3]:
            lines.append(f"- {r.get('name')} ({r.get('rating')}/5): \"{r.get('comment')}\"")

    lines.append("")
    lines.append("Feel free to ask about color images, storage pricing, comparisons, or to place an order!")
    return "\n".join(lines)


@tool(return_direct=True)
async def compare_products(
    product_ids: Optional[List[str]] = None,
    product_names: Optional[List[str]] = None,
) -> str:
    """Compare 2 or more products side-by-side in a comparison table.

    Parameters:
    - product_ids: List of product IDs (e.g. ['product_01', 'product_02']).
    - product_names: List of product titles if IDs are unknown (e.g. ['iPhone 16 Pro', 'iPhone 16 Pro Max']).
    """
    db = get_db()
    if db is None:
        return "Sorry, the database is not available right now."

    products = []
    if product_ids:
        for pid in product_ids:
            p = await _fetch_product_by_id_or_query(db, product_id=pid)
            if p and p not in products:
                products.append(p)

    if product_names:
        for pname in product_names:
            p = await _fetch_product_by_id_or_query(db, product_query=pname)
            if p and p not in products:
                products.append(p)

    if len(products) < 2:
        return "Please provide at least 2 valid product IDs or names to compare."

    titles = [p.get("title", "Product") for p in products]
    headers = ["Specification / Feature"] + titles
    table_lines = [
        "| " + " | ".join(headers) + " |",
        "| " + " | ".join(["---"] * len(headers)) + " |",
    ]

    # Price
    prices = [_format_price(p.get("price")) for p in products]
    table_lines.append("| **Price** | " + " | ".join(prices) + " |")

    # Display
    displays = [(p.get("specifications") or {}).get("display", "N/A") for p in products]
    table_lines.append("| **Display** | " + " | ".join(displays) + " |")

    # Chip
    chips = [(p.get("specifications") or {}).get("chip", "N/A") for p in products]
    table_lines.append("| **Chip / Processor** | " + " | ".join(chips) + " |")

    # Camera
    cameras = [(p.get("specifications") or {}).get("camera", "N/A") for p in products]
    table_lines.append("| **Camera** | " + " | ".join(cameras) + " |")

    # Battery
    batteries = [(p.get("specifications") or {}).get("battery", "N/A") for p in products]
    table_lines.append("| **Battery** | " + " | ".join(batteries) + " |")

    # Finish / Colors
    colors = [", ".join([c.get("name") for c in (p.get("colors") or []) if c.get("name")]) or "N/A" for p in products]
    table_lines.append("| **Available Colors** | " + " | ".join(colors) + " |")

    # Storage
    storages = [", ".join([s.get("size") for s in (p.get("storage") or []) if s.get("size")]) or "N/A" for p in products]
    table_lines.append("| **Storage Options** | " + " | ".join(storages) + " |")

    # Reviews
    ratings = []
    for p in products:
        revs = p.get("reviews") or []
        r_vals = [r.get("rating", 0) for r in revs if isinstance(r.get("rating"), (int, float))]
        avg = f"{sum(r_vals)/len(r_vals):.1f}/5" if r_vals else "N/A"
        ratings.append(avg)
    table_lines.append("| **Customer Rating** | " + " | ".join(ratings) + " |")

    result = ["## Product Comparison", ""] + table_lines + [
        "",
        "Let me know if you would like more details on a specific phone or want to select color/storage!",
    ]
    return "\n".join(result)


@tool(return_direct=True)
async def get_product_variants(
    product_id: Optional[str] = None,
    product_query: Optional[str] = None,
) -> str:
    """Get color options (name, hex, images count) and storage variants with prices for a product.

    Parameters:
    - product_id: Product ID (e.g. 'product_01').
    - product_query: Product title (e.g. 'iPhone 16 Pro').
    """
    db = get_db()
    if db is None:
        return "Sorry, the database is not available right now."

    product = await _fetch_product_by_id_or_query(db, product_id, product_query)
    if not product:
        return "Could not find product for variants lookup."

    lines = [f"## Variants for {product.get('title')}", ""]

    colors = product.get("colors") or []
    if colors:
        lines.append("### Colors:")
        for c in colors:
            img_cnt = len(c.get("images") or [])
            lines.append(f"- **{c.get('name')}** (Hex: `{c.get('hex')}`, {img_cnt} gallery image(s))")
        lines.append("")

    storage = product.get("storage") or []
    if storage:
        lines.append("### Storage Options & Prices:")
        parsed_storage = []
        for s in storage:
            num = _parse_price(s.get("price"))
            parsed_storage.append((s.get("size"), _format_price(s.get("price")), num))

        for size, formatted_p, _ in parsed_storage:
            lines.append(f"- **{size}**: {formatted_p}")

        valid_nums = [item for item in parsed_storage if item[2] is not None]
        if valid_nums:
            cheapest = min(valid_nums, key=lambda x: x[2])
            lines.append("")
            lines.append(f"**Cheapest Option:** {cheapest[0]} at {cheapest[1]}")

    return "\n".join(lines)


@tool(return_direct=True)
async def get_product_reviews(
    product_id: Optional[str] = None,
    product_query: Optional[str] = None,
) -> str:
    """Analyze and summarize customer reviews for a product including average rating, positive points, and complaints.

    Parameters:
    - product_id: Product ID.
    - product_query: Product name query.
    """
    db = get_db()
    if db is None:
        return "Sorry, the database is not available right now."

    product = await _fetch_product_by_id_or_query(db, product_id, product_query)
    if not product:
        return "Product not found for reviews analysis."

    reviews = product.get("reviews") or []
    if not reviews:
        return f"No customer reviews are available yet for **{product.get('title')}**."

    ratings = [r.get("rating", 0) for r in reviews if isinstance(r.get("rating"), (int, float))]
    avg_rating = sum(ratings) / len(ratings) if ratings else 0.0

    positives = [r for r in reviews if r.get("rating", 0) >= 4]
    negatives = [r for r in reviews if r.get("rating", 0) <= 3]

    lines = [
        f"## Customer Review Analysis for {product.get('title')}",
        f"**Average Rating:** {avg_rating:.1f} / 5 stars ({len(reviews)} review(s))",
        "",
    ]

    if positives:
        lines.append("**Positive Highlights:**")
        for r in positives:
            lines.append(f"- {r.get('name')} ({r.get('rating')}/5): \"{r.get('comment')}\"")
        lines.append("")

    if negatives:
        lines.append("**Areas for Improvement / Complaints:**")
        for r in negatives:
            lines.append(f"- {r.get('name')} ({r.get('rating')}/5): \"{r.get('comment')}\"")
        lines.append("")
    else:
        lines.append("No major negative complaints reported for this product.")

    return "\n".join(lines)


