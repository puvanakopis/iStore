from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime
from app.schemas.wishlist_schema import WishlistItemCreate


async def get_or_create_wishlist(db: AsyncIOMotorDatabase, user_id: str) -> dict:
    wishlist = await db["wishlists"].find_one({"user_id": user_id})
    if not wishlist:
        wishlist = {
            "user_id": user_id,
            "items": [],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        result = await db["wishlists"].insert_one(wishlist)
        wishlist["_id"] = result.inserted_id
    
    # Format _id to string for JSON serialization
    wishlist["id"] = str(wishlist["_id"])
    return wishlist


async def add_item_to_wishlist(db: AsyncIOMotorDatabase, user_id: str, item_in: WishlistItemCreate) -> dict:
    wishlist = await get_or_create_wishlist(db, user_id)
    items = wishlist.get("items", [])
    
    # Check if product is already in the wishlist
    found = False
    for item in items:
        if item["product_id"] == item_in.product_id:
            found = True
            break
            
    if not found:
        items.append(item_in.model_dump())
        await db["wishlists"].update_one(
            {"user_id": user_id},
            {
                "$set": {
                    "items": items,
                    "updated_at": datetime.utcnow()
                }
            }
        )
    
    return await get_or_create_wishlist(db, user_id)


async def remove_item_from_wishlist(db: AsyncIOMotorDatabase, user_id: str, product_id: str) -> dict:
    wishlist = await get_or_create_wishlist(db, user_id)
    items = wishlist.get("items", [])
    
    new_items = [item for item in items if item["product_id"] != product_id]
    
    await db["wishlists"].update_one(
        {"user_id": user_id},
        {
            "$set": {
                "items": new_items,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return await get_or_create_wishlist(db, user_id)


async def clear_user_wishlist(db: AsyncIOMotorDatabase, user_id: str) -> dict:
    await db["wishlists"].update_one(
        {"user_id": user_id},
        {
            "$set": {
                "items": [],
                "updated_at": datetime.utcnow()
            }
        }
    )
    return await get_or_create_wishlist(db, user_id)
