from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List
from app.core.database import get_db
from app.middleware.auth_middleware import role_required
from app.schemas.user_schema import UserAdminResponse, UserAdminUpdate
from app.services import user_service

router = APIRouter()

@router.get("/", response_model=List[UserAdminResponse], dependencies=[Depends(role_required("admin"))])
async def get_users(db: AsyncIOMotorDatabase = Depends(get_db)):
    return await user_service.get_all_users(db)

@router.put("/{user_id}", response_model=UserAdminResponse, dependencies=[Depends(role_required("admin"))])
async def update_user(
    user_id: str,
    data: UserAdminUpdate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    return await user_service.update_user(db, user_id, data)

@router.delete("/{user_id}", dependencies=[Depends(role_required("admin"))])
async def delete_user(
    user_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    return await user_service.delete_user(db, user_id)
