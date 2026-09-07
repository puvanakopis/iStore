from typing import Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import HTTPException
from datetime import datetime
from pymongo import ReturnDocument, ASCENDING, TEXT
from bson import Regex
import re


async def get_next_product_id(db: AsyncIOMotorDatabase) -> str:
    counter = await db["counters"].find_one_and_update(
        {"_id": "product_id"},
        {"$inc": {"sequence_value": 1}},
        upsert=True,
        return_document=ReturnDocument.AFTER
    )
    seq = counter.get("sequence_value", 1)
    return f"product_{seq:02d}"


async def create_product(db: AsyncIOMotorDatabase, data):
    product = data.model_dump()
    product["_id"] = await get_next_product_id(db)
    product["created_at"] = datetime.utcnow()
    product["updated_at"] = datetime.utcnow()
    product["like_count"] = 0
    
    if "reviews" not in product or product["reviews"] is None:
        product["reviews"] = []
    
    await db["products"].insert_one(product)
    return product


async def get_all_products(
    db: AsyncIOMotorDatabase,
    search_query: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
):
    query: dict = {}

    if search_query and search_query.strip():
        sq = search_query.strip()
        regex = re.compile(re.escape(sq), re.IGNORECASE)
        query["$or"] = [
            {"title": regex},
            {"subtitle": regex},
            {"colors.name": regex},
            {"storage.size": regex},
        ]

    cursor = db["products"].find(query).skip(skip).limit(limit)
    products = await cursor.to_list(length=limit)

    for p in products:
        p["id"] = str(p["_id"])
        del p["_id"]

    return products


async def search_products(
    db: AsyncIOMotorDatabase,
    query: str,
    limit: int = 10,
):
    if not query or not query.strip():
        return {"query": query, "results": [], "total": 0}

    clean_query = query.strip()
    search_results = []

    regex = re.compile(re.escape(clean_query), re.IGNORECASE)
    filter_cond: dict = {
        "$or": [
            {"title": regex},
            {"subtitle": regex},
            {"colors.name": regex},
            {"storage.size": regex},
        ]
    }

    try:
        search_results = await db["products"].find(filter_cond).limit(limit).to_list(length=limit)
    except Exception:
        search_results = []

    if not search_results:
        text_query: dict = {"$text": {"$search": clean_query}}
        try:
            search_results = await db["products"].find(
                text_query,
                {"score": {"$meta": "textScore"}}
            ).sort([("score", {"$meta": "textScore"})]).limit(limit).to_list(length=limit)
        except Exception:
            pass

    results = []
    for p in search_results:
        results.append({
            "id": str(p["_id"]),
            "title": p["title"],
            "subtitle": p.get("subtitle"),
            "price": p["price"],
            "imageSrc": p.get("imageSrc", ""),
        })

    return {
        "query": query,
        "results": results,
        "total": len(results)
    }


async def get_recommendations(db: AsyncIOMotorDatabase, product_id: str, limit: int = 5):
    product = await db["products"].find_one({"_id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    pipeline = [{"$match": {"_id": {"$ne": product_id}}}, {"$sample": {"size": limit}}]
    recommendations = await db["products"].aggregate(pipeline).to_list(length=limit)
    
    for r in recommendations:
        r["id"] = str(r["_id"])
        del r["_id"]
    
    return recommendations


async def get_trending_products(db: AsyncIOMotorDatabase, limit: int = 6):
    trending = await db["products"].find().sort("like_count", -1).limit(limit).to_list(length=limit)
    
    for p in trending:
        p["id"] = str(p["_id"])
        del p["_id"]
    
    return trending


async def get_product_by_id(db: AsyncIOMotorDatabase, product_id: str):
    product = await db["products"].find_one({"_id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    product["id"] = str(product["_id"])
    del product["_id"]
    
    await db["products"].update_one(
        {"_id": product_id},
        {"$inc": {"view_count": 1}}
    )
    
    return product


async def update_product(db: AsyncIOMotorDatabase, product_id: str, data):
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db["products"].update_one(
        {"_id": product_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    product = await db["products"].find_one({"_id": product_id})
    product["id"] = str(product["_id"])
    del product["_id"]
    
    return product


async def delete_product(db: AsyncIOMotorDatabase, product_id: str):
    result = await db["products"].delete_one({"_id": product_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    await db["likes"].delete_many({"product_id": product_id})
    
    return {"msg": "Product deleted"}