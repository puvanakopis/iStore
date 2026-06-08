from langchain_core.tools import tool
from app.core.database import get_db
from app.services import product_service
from typing import List, Dict, Any, Optional


def _normalize_price(price: Any) -> str:
    if price is None:
        return "N/A"
    text = str(price).strip()
    if text.lower().startswith("rs"):
        return text
    return f"Rs. {text}"


def _format_product_lines(products: List[Dict[str, Any]], heading: str) -> str:
    if not products:
        return "No products found."

    lines = [heading, ""]
    for i, p in enumerate(products, 1):
        price = _normalize_price(p.get("price"))
        category = p.get("category")
        line = f"{i}. **{p.get('title', 'Unknown')}** (ID: `{p['id']}`) — {price}"
        if category:
            line += f" — {category}"
        lines.append(line)
    lines.append("")
    lines.append(
        "Let me know if you'd like full details on any product — "
        "just name the product (e.g. iPhone 14)."
    )
    return "\n".join(lines)


def _format_product_details(product: Dict[str, Any]) -> str:
    title = product.get("title", "Unknown")
    product_id = product.get("id", "N/A")
    subtitle = product.get("subtitle", "")
    base_price = _normalize_price(product.get("price"))
    category = product.get("category")

    lines = [
        f"## {title}",
        f"**Product ID:** `{product_id}`",
        "",
    ]

    if subtitle:
        lines.append(subtitle)
        lines.append("")

    if category:
        lines.append(f"**Category:** {category}")
        lines.append("")

    lines.append(f"**Starting price:** {base_price}")
    lines.append("")

    colors = product.get("colors", [])
    if colors:
        lines.append("**Available colors:**")
        for color in colors:
            name = color.get("name", "Unknown")
            lines.append(f"- {name}")
        lines.append("")

    storage = product.get("storage", [])
    if storage:
        lines.append("**Storage options & prices:**")
        for option in storage:
            size = option.get("size", "Unknown")
            price = _normalize_price(option.get("price"))
            lines.append(f"- {size} — {price}")
        lines.append("")

    features = product.get("features", [])
    if features:
        lines.append("**Key features:**")
        for feature in features:
            feat_title = feature.get("title", "")
            feat_desc = feature.get("description", "")
            if feat_title and feat_desc:
                lines.append(f"- **{feat_title}** — {feat_desc}")
            elif feat_title:
                lines.append(f"- {feat_title}")
        lines.append("")

    specifications = product.get("specifications", {})
    if specifications:
        lines.append("**Specifications:**")
        for key, value in specifications.items():
            label = key.replace("_", " ").title()
            lines.append(f"- **{label}:** {value}")
        lines.append("")

    reviews = product.get("reviews", [])
    if reviews:
        lines.append("**Customer reviews:**")
        for review in reviews[:3]:
            name = review.get("name", "Anonymous")
            rating = review.get("rating", "N/A")
            comment = review.get("comment", "")
            lines.append(f"- {name} ({rating}/5): \"{comment}\"")
        lines.append("")

    lines.append(
        "Feel free to ask about another product, search for something else, "
        "add items to your wishlist, or place an order whenever you're ready."
    )
    return "\n".join(lines)


async def _fetch_product_by_id(db, product_id: str) -> Optional[Dict[str, Any]]:
    product = await db["products"].find_one({"_id": product_id})
    if not product:
        return None
    product["id"] = str(product["_id"])
    product.pop("_id", None)
    product.pop("imageSrc", None)
    product.pop("images", None)
    for color in product.get("colors", []):
        color.pop("images", None)
        color.pop("hex", None)
    return product


@tool(return_direct=True)
async def list_products(skip: int = 0, limit: int = 50) -> str:
    """List ALL available products in the store.

    Use when the customer asks what products are available, wants to browse
    the catalog, or asks to see everything in the store.
    Returns id, title, price, and category for each product.
    """
    db = get_db()
    if db is None:
        return "Sorry, the database is not available right now. Please try again later."

    products = await product_service.get_all_products(db, skip, limit)
    summaries = [
        {
            "id": p["id"],
            "title": p.get("title"),
            "price": p.get("price"),
            "category": p.get("category"),
        }
        for p in products
    ]
    return _format_product_lines(summaries, "Here are all the available products in iStore:")


@tool(return_direct=True)
async def search_products(query: str, limit: int = 10) -> str:
    """Search for products by title, subtitle, category, or tags.

    Use when the customer searches for a specific type of product
    (e.g. 'iPhone 15 Pro', 'MacBook', 'accessories').
    """
    db = get_db()
    if db is None:
        return "Sorry, the database is not available right now. Please try again later."

    res = await product_service.search_products(db, query, limit)
    results = res.get("results", [])
    summaries = [
        {"id": p["id"], "title": p.get("title"), "price": p.get("price"), "category": p.get("category")}
        for p in results
    ]
    return _format_product_lines(summaries, f'Results for "{query}":')


@tool(return_direct=True)
async def get_product_details(product_id: str) -> str:
    """Get full details for a specific product by its ID.

    Returns colors, storage options with prices, features, specifications,
    and reviews. Use when you already have the product ID.
    """
    db = get_db()
    if db is None:
        return "Sorry, the database is not available right now. Please try again later."

    product = await _fetch_product_by_id(db, product_id)
    if not product:
        return f"Product with ID '{product_id}' was not found. Please check the ID or search by name."

    return _format_product_details(product)


@tool(return_direct=True)
async def get_product_details_by_name(product_query: str) -> str:
    """Get full details for a product by name (e.g. 'iPhone 14', 'iPhone 14 Pro').

    Use when the customer asks to learn more about, explain, or get details on
    a specific product by name. Shows colors, storage, prices, features, specs, and reviews.
    """
    db = get_db()
    if db is None:
        return "Sorry, the database is not available right now. Please try again later."

    res = await product_service.search_products(db, product_query, limit=3)
    results = res.get("results", [])
    if not results:
        return f'No products found matching "{product_query}". Try browsing all products or use a different name.'

    product = await _fetch_product_by_id(db, results[0]["id"])
    if not product:
        return f'Could not load details for "{product_query}". Please try again.'

    return _format_product_details(product)


@tool(return_direct=True)
async def get_recommended_products(product_id: str, limit: int = 5) -> str:
    """Get related or recommended products based on a product ID."""
    db = get_db()
    try:
        products = await product_service.get_recommendations(db, product_id, limit)
        summaries = [{"id": p["id"], "title": p.get("title"), "price": p.get("price")} for p in products]
        return _format_product_lines(summaries, f"Recommended products for `{product_id}`:")
    except Exception:
        return f"Could not get recommendations for product ID '{product_id}'."


@tool(return_direct=True)
async def get_trending_products(limit: int = 5) -> str:
    """Get trending/popular products in the store."""
    db = get_db()
    products = await product_service.get_trending_products(db, limit)
    summaries = [{"id": p["id"], "title": p.get("title"), "price": p.get("price")} for p in products]
    return _format_product_lines(summaries, "Here are the trending products in iStore:")
