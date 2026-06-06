from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import HTTPException
from datetime import datetime
from pymongo import ReturnDocument


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

    await db["products"].insert_one(product)
    return product


    result = await db["products"].delete_one({"_id": product_id})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")

    return {"msg": "Product deleted"}