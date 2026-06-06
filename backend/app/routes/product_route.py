from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_db
from app.middleware.auth_middleware import role_required
from app.schemas.product_schema import ProductCreate
from app.services import product_service

router = APIRouter()


@router.post("/", dependencies=[Depends(role_required("admin"))])
async def create_product(
    data: ProductCreate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    return await product_service.create_product(db, data)

