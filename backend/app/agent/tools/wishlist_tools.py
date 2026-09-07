from langchain_core.tools import tool
from app.core.database import get_db
from app.services import wishlist_service, product_service
from app.agent.tools.auth import get_current_user_id
from app.agent.utils import sanitize_doc
from app.schemas.wishlist_schema import WishlistItemCreate
from typing import Dict, Any, Optional


def _format_price(price: Any) -> str:
    if price is None:
        return "N/A"
    text = str(price).strip()
    clean = text
    if clean.lower().startswith("rs"):
        clean = clean[2:].strip()
    try:
        val = float(clean.replace("$", "").replace(",", ""))
        return f"Rs. {val:,.0f}"
    except ValueError:
        return f"Rs. {text}"


def _get_db_or_error() -> tuple[Any, str | None]:
    db = get_db()
    if db is None:
        return None, "Database connection is not available right now."
    return db, None


@tool(return_direct=True)
async def get_my_wishlist(search_query: Optional[str] = None) -> str:
    """Retrieve the current logged-in user's wishlist, with an optional search query filter.

    Parameters:
    - search_query: Optional search keyword to filter wishlist items by product name or ID.
    """
    user_id = get_current_user_id()
    if not user_id:
        return "User not authenticated. Please sign in to view your wishlist."

    db, db_error = _get_db_or_error()
    if db_error:
        return db_error

    wishlist = await wishlist_service.get_or_create_wishlist(db, user_id, search_query=search_query)
    items = wishlist.get("items", [])

    query_str = f" (Search: `{search_query.strip()}`)" if search_query and search_query.strip() else ""

    if not items:
        if search_query and search_query.strip():
            return f"No items found in your wishlist matching `{search_query.strip()}`."
        return "Your wishlist is currently empty. You can ask me to add products to your wishlist anytime!"

    lines = [f"## Your Wishlist{query_str}", ""]
    for i, item in enumerate(items, 1):
        pid = item.get("product_id") or item.get("id")
        title = item.get("title", "Unknown Product")
        price = item.get("price")
        lines.append(f"{i}. **{title}** (ID: `{pid}`) — {_format_price(price)}")

    lines.append("")
    lines.append("Let me know if you'd like to order any of these items or remove an item!")
    return "\n".join(lines)


@tool(return_direct=True)
async def add_item_to_wishlist(product_id: str) -> str:
    """Add a product to the user's wishlist by product ID."""
    user_id = get_current_user_id()
    if not user_id:
        return "User not authenticated. Please log in first."

    db, db_error = _get_db_or_error()
    if db_error:
        return db_error

    try:
        product = await product_service.get_product_by_id(db, product_id)
    except Exception:
        return f"Product with ID '{product_id}' was not found."

    item_in = WishlistItemCreate(
        product_id=product_id,
        title=product["title"],
        price=product["price"],
        imageSrc=product.get("imageSrc", ""),
        imageAlt=product.get("imageAlt"),
    )

    try:
        await wishlist_service.add_item_to_wishlist(db, user_id, item_in)
        return f"**'{product['title']}'** (ID: `{product_id}`) has been added to your wishlist!"
    except Exception as e:
        return f"Failed to add item to wishlist: {str(e)}"


@tool(return_direct=True)
async def remove_item_from_wishlist(product_id: str) -> str:
    """Remove a product from the user's wishlist by product ID."""
    user_id = get_current_user_id()
    if not user_id:
        return "User not authenticated. Please log in first."

    db, db_error = _get_db_or_error()
    if db_error:
        return db_error

    try:
        await wishlist_service.remove_item_from_wishlist(db, user_id, product_id)
        return f"Product `{product_id}` has been removed from your wishlist."
    except Exception as e:
        return f"Failed to remove item from wishlist: {str(e)}"


@tool(return_direct=True)
async def clear_my_wishlist() -> str:
    """Clear all items from the user's wishlist."""
    user_id = get_current_user_id()
    if not user_id:
        return "User not authenticated. Please log in first."

    db, db_error = _get_db_or_error()
    if db_error:
        return db_error

    try:
        await wishlist_service.clear_user_wishlist(db, user_id)
        return "Your wishlist has been cleared."
    except Exception as e:
        return f"Failed to clear wishlist: {str(e)}"
