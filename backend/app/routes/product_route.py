from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_db
from app.middleware.auth_middleware import role_required
from app.schemas.product_schema import ProductCreate, ProductUpdate
from app.services import product_service

router = APIRouter()


@router.post("/", dependencies=[Depends(role_required("admin"))])
async def create_product(
    data: ProductCreate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    return await product_service.create_product(db, data)


@router.get("/")
async def get_products(db: AsyncIOMotorDatabase = Depends(get_db)):
    return await product_service.get_all_products(db)


@router.get("/{product_id}")
async def get_product(
    product_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    return await product_service.get_product_by_id(db, product_id)

