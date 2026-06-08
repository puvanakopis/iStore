from langchain_core.tools import tool
from app.core.database import get_db
from app.services import wishlist_service, product_service
from app.agent.tools.auth import get_current_user_id
from app.agent.utils import sanitize_doc
from app.schemas.wishlist_schema import WishlistItemCreate
from typing import Dict, Any


def _get_db_or_error() -> tuple[Any, Dict[str, Any] | None]:
    db = get_db()
    if db is None:
        return None, {"error": "Database connection is not available."}
    return db, None


@tool
async def get_my_wishlist() -> Dict[str, Any]:
    """Retrieve the current logged-in user's wishlist."""
    user_id = get_current_user_id()
    if not user_id:
        return {"error": "User not authenticated. Please sign in to view your wishlist."}

    db, db_error = _get_db_or_error()
    if db_error:
        return db_error
    wishlist = await wishlist_service.get_or_create_wishlist(db, user_id)
    return sanitize_doc(wishlist)

@tool
async def add_item_to_wishlist(product_id: str) -> Dict[str, Any]:
    """Add a product to the user's wishlist by product ID."""
    user_id = get_current_user_id()
    if not user_id:
        return {"error": "User not authenticated. Please log in first."}
        
    db, db_error = _get_db_or_error()
    if db_error:
        return db_error

    # 1. Fetch product details
    try:
        product = await product_service.get_product_by_id(db, product_id)
    except Exception:
        return {"error": f"Product with ID '{product_id}' not found."}
        
    # 2. Create wishlist item input
    item_in = WishlistItemCreate(
        product_id=product_id,
        title=product["title"],
        price=product["price"],
        imageSrc=product["imageSrc"],
        imageAlt=product.get("imageAlt")
    )
    
    # 3. Add to wishlist
    try:
        wishlist = await wishlist_service.add_item_to_wishlist(db, user_id, item_in)
        return {
            "success": True,
            "message": f"Added '{product['title']}' to your wishlist.",
            "wishlist": sanitize_doc(wishlist),
        }
    except Exception as e:
        return {"error": f"Failed to add to wishlist: {str(e)}"}

@tool
async def remove_item_from_wishlist(product_id: str) -> Dict[str, Any]:
    """Remove a product from the user's wishlist by product ID."""
    user_id = get_current_user_id()
    if not user_id:
        return {"error": "User not authenticated."}
        
    db, db_error = _get_db_or_error()
    if db_error:
        return db_error
    try:
        wishlist = await wishlist_service.remove_item_from_wishlist(db, user_id, product_id)
        return {
            "success": True,
            "message": f"Removed product '{product_id}' from your wishlist.",
            "wishlist": sanitize_doc(wishlist),
        }
    except Exception as e:
        return {"error": f"Failed to remove from wishlist: {str(e)}"}

@tool
async def clear_my_wishlist() -> Dict[str, Any]:
    """Clear all items from the user's wishlist."""
    user_id = get_current_user_id()
    if not user_id:
        return {"error": "User not authenticated."}
        
    db, db_error = _get_db_or_error()
    if db_error:
        return db_error
    try:
        wishlist = await wishlist_service.clear_user_wishlist(db, user_id)
        return {
            "success": True,
            "message": "Wishlist cleared.",
            "wishlist": sanitize_doc(wishlist),
        }
    except Exception as e:
        return {"error": f"Failed to clear wishlist: {str(e)}"}
