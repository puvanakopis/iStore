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


async def get_all_products(db: AsyncIOMotorDatabase, skip: int = 0, limit: int = 100):
    cursor = db["products"].find().skip(skip).limit(limit)
    products = await cursor.to_list(length=limit)
    
    for p in products:
        p["id"] = str(p["_id"])
        del p["_id"]
    
    return products


async def search_products(db: AsyncIOMotorDatabase, query: str, limit: int = 10):
    if not query:
        return {"query": query, "results": [], "total": 0}
    
    try:
        await db["products"].create_index([("title", TEXT), ("subtitle", TEXT), ("category", TEXT), ("tags", TEXT)])
    except:
        pass
    
    search_results = await db["products"].find(
        {"$text": {"$search": query}},
        {"score": {"$meta": "textScore"}}
    ).sort([("score", {"$meta": "textScore"})]).limit(limit).to_list(length=limit)
    
    if not search_results:
        regex = re.compile(re.escape(query), re.IGNORECASE)
        search_results = await db["products"].find({
            "$or": [
                {"title": regex},
                {"subtitle": regex},
                {"category": regex},
                {"tags": regex}
            ]
        }).limit(limit).to_list(length=limit)
    
    results = []
    for p in search_results:
        results.append({
            "id": str(p["_id"]),
            "title": p["title"],
            "subtitle": p.get("subtitle"),
            "price": p["price"],
            "imageSrc": p["imageSrc"],
            "category": p.get("category")
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
    
    query_conditions = []
    
    if product.get("category"):
        query_conditions.append({"category": product["category"]})
    
    if product.get("tags"):
        for tag in product["tags"]:
            query_conditions.append({"tags": tag})
    
    if not query_conditions:
        pipeline = [{"$sample": {"size": limit}}]
        recommendations = await db["products"].aggregate(pipeline).to_list(length=limit)
    else:
        recommendations = await db["products"].find({
            "$and": [
                {"_id": {"$ne": product_id}},
                {"$or": query_conditions}
            ]
        }).limit(limit).to_list(length=limit)
    
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