from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import HTTPException
from datetime import datetime
from pymongo import ReturnDocument


async def get_next_order_id(db: AsyncIOMotorDatabase) -> str:
    counter = await db["counters"].find_one_and_update(
        {"_id": "order_id"},
        {"$inc": {"sequence_value": 1}},
        upsert=True,
        return_document=ReturnDocument.AFTER
    )
    seq = counter.get("sequence_value", 1)
    return f"order_{seq:02d}"


async def create_order(db: AsyncIOMotorDatabase, user_id: str, order_in) -> dict:
    order_id = await get_next_order_id(db)
    
    order_data = {
        "_id": order_id,
        "user_id": user_id,
        "customer_details": order_in.customer_details.model_dump(),
        "shipping_address": order_in.shipping_address.model_dump(),
        "payment_details": {
            "cardholder": order_in.payment_details.cardholder,
            "cardNumber": f"**** **** **** {order_in.payment_details.cardNumber[-4:]}" if len(order_in.payment_details.cardNumber) >= 4 else "****",
            "expiry": order_in.payment_details.expiry
        },
        "items": [item.model_dump() for item in order_in.items],
        "subtotal": order_in.subtotal,
        "discount": order_in.discount,
        "shipping": order_in.shipping,
        "tax": order_in.tax,
        "total": order_in.total,
        "promo_code": order_in.promo_code,
        "status": getattr(order_in, "status", "Pending") or "Pending",
        "payment": getattr(order_in, "payment", "Paid") or "Paid",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    await db["orders"].insert_one(order_data)
    
    # Clear user's cart in the DB upon successful order creation
    await db["carts"].update_one(
        {"user_id": user_id},
        {
            "$set": {
                "items": [],
                "updated_at": datetime.utcnow()
            }
        }
    )
    
    # Return formatted with string id alias matching Pydantic expectations
    order_data["id"] = order_data["_id"]
    return order_data


async def get_user_orders(db: AsyncIOMotorDatabase, user_id: str) -> list:
    cursor = db["orders"].find({"user_id": user_id}).sort("created_at", -1)
    orders = []
    async for doc in cursor:
        doc["id"] = doc["_id"]
        orders.append(doc)
    return orders


async def get_all_orders(db: AsyncIOMotorDatabase) -> list:
    cursor = db["orders"].find().sort("created_at", -1)
    orders = []
    async for doc in cursor:
        doc["id"] = doc["_id"]
        orders.append(doc)
    return orders


async def update_order(db: AsyncIOMotorDatabase, order_id: str, data) -> dict:
    update_dict = {}
    
    for field, val in data.model_dump(exclude_unset=True).items():
        if val is not None:
            update_dict[field] = val

    update_dict["updated_at"] = datetime.utcnow()
    
    result = await db["orders"].find_one_and_update(
        {"_id": order_id},
        {"$set": update_dict},
        return_document=ReturnDocument.AFTER
    )
    if not result:
        raise HTTPException(status_code=404, detail="Order not found")
        
    result["id"] = result["_id"]
    return result


async def delete_order(db: AsyncIOMotorDatabase, order_id: str) -> dict:
    result = await db["orders"].delete_one({"_id": order_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"msg": "Order deleted"}
