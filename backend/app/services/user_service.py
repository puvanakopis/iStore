from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import HTTPException
from app.schemas.user_schema import UserAdminUpdate
from typing import List

async def get_all_users(db: AsyncIOMotorDatabase) -> List[dict]:
    cursor = db["users"].find()
    users = []
    async for u in cursor:
        users.append(u)
    
    orders_cursor = db["orders"].find()
    user_spent = {}
    async for o in orders_cursor:
        uid = o.get("user_id")
        total = o.get("total", 0.0)
        user_spent[uid] = user_spent.get(uid, 0.0) + total

    formatted_users = []
    for u in users:
        uid = u.get("_id") or u.get("id")
        first_name = u.get("first_name", "")
        last_name = u.get("last_name", "")
        name = f"{first_name} {last_name}".strip() or u.get("email", "")
        
        db_role = u.get("role", "user")
        role = "Admin" if db_role == "admin" else "Customer"
        
        db_status = u.get("member_status", "standard")
        status = "Blocked" if db_status == "blocked" else "Active"
        
        spent = user_spent.get(uid, 0.0)
        
        formatted_users.append({
            "id": uid,
            "name": name,
            "email": u.get("email"),
            "role": role,
            "spent": spent,
            "status": status
        })
        
    return formatted_users

async def update_user(db: AsyncIOMotorDatabase, user_id: str, data: UserAdminUpdate) -> dict:
    user = await db["users"].find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    update_data = {}
    
    if data.name is not None:
        parts = data.name.strip().split(" ", 1)
        update_data["first_name"] = parts[0]
        update_data["last_name"] = parts[1] if len(parts) > 1 else ""
        
    if data.email is not None:
        update_data["email"] = data.email
        
    if data.role is not None:
        update_data["role"] = "admin" if data.role == "Admin" else "user"
        
    if data.status is not None:
        update_data["member_status"] = "blocked" if data.status == "Blocked" else "standard"
        
    if update_data:
        await db["users"].update_one({"_id": user_id}, {"$set": update_data})
        
    updated_user = await db["users"].find_one({"_id": user_id})
    
    orders_cursor = db["orders"].find({"user_id": user_id})
    spent = 0.0
    async for o in orders_cursor:
        spent += o.get("total", 0.0)
        
    first_name = updated_user.get("first_name", "")
    last_name = updated_user.get("last_name", "")
    name = f"{first_name} {last_name}".strip() or updated_user.get("email", "")
    
    db_role = updated_user.get("role", "user")
    role = "Admin" if db_role == "admin" else "Customer"
    
    db_status = updated_user.get("member_status", "standard")
    status = "Blocked" if db_status == "blocked" else "Active"
    
    return {
        "id": user_id,
        "name": name,
        "email": updated_user.get("email"),
        "role": role,
        "spent": spent,
        "status": status
    }

async def delete_user(db: AsyncIOMotorDatabase, user_id: str):
    user = await db["users"].find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    await db["users"].delete_one({"_id": user_id})
    return {"msg": "User deleted successfully"}
