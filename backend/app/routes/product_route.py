from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
import uuid
import os
import shutil
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_db
from app.middleware.auth_middleware import role_required
from app.schemas.product_schema import ProductCreate, ProductUpdate
from app.services import product_service

router = APIRouter()


@router.post("/upload", dependencies=[Depends(role_required("admin"))])
async def upload_image(file: UploadFile = File(...)):
    # Validate file type is an image
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Generate unique filename to avoid collision
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    
    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)
    filepath = os.path.join(upload_dir, unique_filename)
    
    try:
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")
        
    return {"url": f"http://localhost:8000/uploads/{unique_filename}"}



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


@router.put("/{product_id}", dependencies=[Depends(role_required("admin"))])
async def update_product(
    product_id: str,
    data: ProductUpdate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    return await product_service.update_product(db, product_id, data)


@router.delete("/{product_id}", dependencies=[Depends(role_required("admin"))])
async def delete_product(
    product_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    return await product_service.delete_product(db, product_id)