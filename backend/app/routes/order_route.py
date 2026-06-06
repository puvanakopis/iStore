from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List

from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.order_schema import OrderCreate, OrderOut
from app.services import order_service

router = APIRouter()


@router.post("/", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
async def create_order(
    order_in: OrderCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user_id = str(current_user["id"])
    return await order_service.create_order(db, user_id, order_in)


@router.get("/", response_model=List[OrderOut])
async def get_orders(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user_id = str(current_user["id"])
    return await order_service.get_user_orders(db, user_id)
