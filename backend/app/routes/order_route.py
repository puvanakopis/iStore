from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List

from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas.order_schema import OrderCreate, OrderOut, OrderUpdate
from app.services import order_service
from app.middleware.auth_middleware import role_required

router = APIRouter()


@router.post("/", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
async def create_order(
    order_in: OrderCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user_id = order_in.user_id or str(current_user["id"])
    return await order_service.create_order(db, user_id, order_in)


@router.get("/", response_model=List[OrderOut])
async def get_orders(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user_id = str(current_user["id"])
    return await order_service.get_user_orders(db, user_id)


@router.get("/all", response_model=List[OrderOut], dependencies=[Depends(role_required("admin"))])
async def get_all_orders(
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    return await order_service.get_all_orders(db)


@router.put("/{order_id}", response_model=OrderOut, dependencies=[Depends(role_required("admin"))])
async def update_order(
    order_id: str,
    order_in: OrderUpdate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    return await order_service.update_order(db, order_id, order_in)


@router.delete("/{order_id}", dependencies=[Depends(role_required("admin"))])
async def delete_order(
    order_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    return await order_service.delete_order(db, order_id)
