from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime
from typing import List

from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.cart_schema import (
    CartItemCreate,
    CartItemUpdate,
    CartItemRemove,
    CartOut,
    CartItemBase
)

router = APIRouter()


async def get_or_create_cart(db: AsyncIOMotorDatabase, user_id: str) -> dict:
    cart = await db["carts"].find_one({"user_id": user_id})
    if not cart:
        cart = {
            "user_id": user_id,
            "items": [],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        result = await db["carts"].insert_one(cart)
        cart["_id"] = result.inserted_id
    
    # Format _id to string for JSON serialization
    cart["id"] = str(cart["_id"])
    return cart


@router.get("/", response_model=CartOut)
async def get_cart(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user_id = str(current_user["id"])
    return await get_or_create_cart(db, user_id)


@router.post("/add", response_model=CartOut)
async def add_to_cart(
    item_in: CartItemCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user_id = str(current_user["id"])
    cart = await get_or_create_cart(db, user_id)
    
    items = cart.get("items", [])
    found = False
    
    for item in items:
        if (
            item["product_id"] == item_in.product_id
            and item["color"] == item_in.color
            and item["storage"] == item_in.storage
        ):
            item["quantity"] += item_in.quantity
            found = True
            break
            
    if not found:
        items.append(item_in.model_dump())
        
    await db["carts"].update_one(
        {"user_id": user_id},
        {
            "$set": {
                "items": items,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return await get_or_create_cart(db, user_id)


@router.put("/update", response_model=CartOut)
async def update_cart_item(
    item_in: CartItemUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user_id = str(current_user["id"])
    cart = await get_or_create_cart(db, user_id)
    
    items = cart.get("items", [])
    found = False
    
    for item in items:
        if (
            item["product_id"] == item_in.product_id
            and item["color"] == item_in.color
            and item["storage"] == item_in.storage
        ):
            item["quantity"] = item_in.quantity
            found = True
            break
            
    if not found:
        raise HTTPException(status_code=404, detail="Item not found in cart")
        
    await db["carts"].update_one(
        {"user_id": user_id},
        {
            "$set": {
                "items": items,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return await get_or_create_cart(db, user_id)


@router.post("/remove", response_model=CartOut)
async def remove_from_cart(
    item_in: CartItemRemove,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user_id = str(current_user["id"])
    cart = await get_or_create_cart(db, user_id)
    
    items = cart.get("items", [])
    new_items = [
        item for item in items
        if not (
            item["product_id"] == item_in.product_id
            and item["color"] == item_in.color
            and item["storage"] == item_in.storage
        )
    ]
    
    await db["carts"].update_one(
        {"user_id": user_id},
        {
            "$set": {
                "items": new_items,
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    return await get_or_create_cart(db, user_id)


@router.delete("/clear", response_model=CartOut)
async def clear_cart(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user_id = str(current_user["id"])
    await db["carts"].update_one(
        {"user_id": user_id},
        {
            "$set": {
                "items": [],
                "updated_at": datetime.utcnow()
            }
        }
    )
    return await get_or_create_cart(db, user_id)
