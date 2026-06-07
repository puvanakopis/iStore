from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Query
import uuid
import os
import shutil
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_db
from app.middleware.auth_middleware import role_required
from app.schemas.product_schema import ProductCreate, ProductUpdate, SearchResponse
from app.services import product_service
from app.core.security import get_current_user
from datetime import datetime
from typing import Optional, List

router = APIRouter()


@router.post("/upload", dependencies=[Depends(role_required("admin"))])
async def upload_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
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
async def get_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    return await product_service.get_all_products(db, skip, limit)


@router.get("/search")
async def search_products(
    q: str = Query("", min_length=1),
    limit: int = Query(10, ge=1, le=50),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Search products by title, subtitle, or category"""
    return await product_service.search_products(db, q, limit)


@router.get("/recommendations/{product_id}")
async def get_recommendations(
    product_id: str,
    limit: int = Query(5, ge=1, le=10),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get related/recommended products based on the current product"""
    return await product_service.get_recommendations(db, product_id, limit)


@router.get("/trending")
async def get_trending_products(
    limit: int = Query(6, ge=1, le=20),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get trending products (most liked/purchased)"""
    return await product_service.get_trending_products(db, limit)


@router.get("/{product_id}/like")
async def check_like_status(
    product_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user_id = str(current_user["_id"])
    like = await db["likes"].find_one({"user_id": user_id, "product_id": product_id})
    return {"liked": bool(like)}


@router.post("/{product_id}/like")
async def toggle_like_product(
    product_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user_id = str(current_user["_id"])
    like = await db["likes"].find_one({"user_id": user_id, "product_id": product_id})
    if like:
        await db["likes"].delete_one({"user_id": user_id, "product_id": product_id})
        liked = False
    else:
        await db["likes"].insert_one({
            "user_id": user_id,
            "product_id": product_id,
            "created_at": datetime.utcnow()
        })
        liked = True
    return {"liked": liked}


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