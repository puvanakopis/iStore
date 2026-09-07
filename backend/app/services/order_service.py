import re
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import HTTPException, status
from datetime import datetime
from pymongo import ReturnDocument
from app.utils.email_utils import send_order_shipped_email, send_order_cancelled_email


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
        "status": getattr(order_in, "status", "Confirmed") or "Confirmed",
        "payment": getattr(order_in, "payment", "Paid") or "Paid",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    await db["orders"].insert_one(order_data)
    
    # Return formatted with string id alias matching Pydantic expectations
    order_data["id"] = order_data["_id"]
    return order_data


async def get_user_orders(
    db: AsyncIOMotorDatabase,
    user_id: str,
    status: Optional[str] = None,
    search_query: Optional[str] = None,
) -> list:
    query: dict = {"user_id": user_id}

    if status and status.strip():
        st = status.strip()
        query["status"] = {"$regex": f"^{re.escape(st)}$", "$options": "i"}

    if search_query and search_query.strip():
        sq = search_query.strip()
        query["$or"] = [
            {"_id": {"$regex": re.escape(sq), "$options": "i"}},
            {"items.title": {"$regex": re.escape(sq), "$options": "i"}},
            {"items.color": {"$regex": re.escape(sq), "$options": "i"}},
            {"items.storage": {"$regex": re.escape(sq), "$options": "i"}},
            {"promo_code": {"$regex": re.escape(sq), "$options": "i"}},
            {"payment": {"$regex": re.escape(sq), "$options": "i"}},
        ]

    cursor = db["orders"].find(query).sort("created_at", -1)
    orders = []
    async for doc in cursor:
        doc["id"] = doc["_id"]
        orders.append(doc)
    return orders


async def get_all_orders(
    db: AsyncIOMotorDatabase,
    status: Optional[str] = None,
    search_query: Optional[str] = None,
) -> list:
    query: dict = {}

    if status and status.strip():
        st = status.strip()
        query["status"] = {"$regex": f"^{re.escape(st)}$", "$options": "i"}

    if search_query and search_query.strip():
        sq = search_query.strip()
        query["$or"] = [
            {"_id": {"$regex": re.escape(sq), "$options": "i"}},
            {"user_id": {"$regex": re.escape(sq), "$options": "i"}},
            {"customer_details.email": {"$regex": re.escape(sq), "$options": "i"}},
            {"customer_details.firstName": {"$regex": re.escape(sq), "$options": "i"}},
            {"customer_details.lastName": {"$regex": re.escape(sq), "$options": "i"}},
            {"items.title": {"$regex": re.escape(sq), "$options": "i"}},
        ]

    cursor = db["orders"].find(query).sort("created_at", -1)
    orders = []
    async for doc in cursor:
        doc["id"] = doc["_id"]
        orders.append(doc)
    return orders


async def update_order(db: AsyncIOMotorDatabase, order_id: str, data) -> dict:
    existing_order = await db["orders"].find_one({"_id": order_id})
    if not existing_order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    old_status = (existing_order.get("status") or "").lower()

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
    new_status = (result.get("status") or "").lower()

    # Trigger emails on status changes
    email_to = result.get("customer_details", {}).get("email")
    if email_to:
        if new_status in ["shipped", "shipping"] and old_status not in ["shipped", "shipping"]:
            send_order_shipped_email(email_to, result)
        elif new_status == "cancelled" and old_status != "cancelled":
            send_order_cancelled_email(email_to, result)

    return result


async def cancel_user_order(db: AsyncIOMotorDatabase, order_id: str, user_id: str) -> dict:
    existing_order = await db["orders"].find_one({"_id": order_id})
    if not existing_order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    if existing_order.get("user_id") != user_id:
        raise HTTPException(status_code=403, detail="You do not have permission to cancel this order")

    current_status = (existing_order.get("status") or "").lower()
    if current_status != "confirmed":
        raise HTTPException(
            status_code=400, 
            detail=f"Order cannot be cancelled as its current status is '{existing_order.get('status')}'. Only Confirmed orders can be cancelled."
        )

    result = await db["orders"].find_one_and_update(
        {"_id": order_id},
        {"$set": {"status": "Cancelled", "updated_at": datetime.utcnow()}},
        return_document=ReturnDocument.AFTER
    )
    result["id"] = result["_id"]

    email_to = result.get("customer_details", {}).get("email")
    if email_to:
        send_order_cancelled_email(email_to, result)

    return result


async def delete_order(db: AsyncIOMotorDatabase, order_id: str) -> dict:
    result = await db["orders"].delete_one({"_id": order_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"msg": "Order deleted"}

