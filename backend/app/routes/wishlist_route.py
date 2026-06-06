from fastapi import APIRouter, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.wishlist_schema import WishlistOut, WishlistItemCreate, WishlistItemRemove
from app.services import wishlist_service

router = APIRouter()


@router.get("/", response_model=WishlistOut)
async def get_wishlist(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user_id = str(current_user["id"])
    return await wishlist_service.get_or_create_wishlist(db, user_id)


@router.post("/add", response_model=WishlistOut)
async def add_to_wishlist(
    item_in: WishlistItemCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user_id = str(current_user["id"])
    return await wishlist_service.add_item_to_wishlist(db, user_id, item_in)


@router.post("/remove", response_model=WishlistOut)
async def remove_from_wishlist(
    item_in: WishlistItemRemove,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user_id = str(current_user["id"])
    return await wishlist_service.remove_item_from_wishlist(db, user_id, item_in.product_id)


@router.delete("/clear", response_model=WishlistOut)
async def clear_wishlist(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user_id = str(current_user["id"])
    return await wishlist_service.clear_user_wishlist(db, user_id)
