from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import HTTPException, status
from datetime import datetime
from pymongo import ReturnDocument
from app.core.security import get_password_hash, verify_password, create_access_token
from app.utils.otp_utils import create_otp, verify_otp, get_pending_signup
from app.utils.email_utils import send_otp_email, send_reset_password_email
from app.schemas.auth_schema import ResetPassword


async def get_next_user_id(db: AsyncIOMotorDatabase) -> str:
    counter = await db["counters"].find_one_and_update(
        {"_id": "user_id"},
        {"$inc": {"sequence_value": 1}},
        upsert=True,
        return_document=ReturnDocument.AFTER
    )
    count = counter.get("sequence_value", 1)
    return f"user_{count:02d}"


async def get_user_by_email(db: AsyncIOMotorDatabase, email: str):
    user = await db["users"].find_one({"email": email})
    if user:
        user["id"] = user["_id"]
    return user


async def signup_user(db: AsyncIOMotorDatabase, user_in):
    db_user = await get_user_by_email(db, user_in.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )

    hashed_password = get_password_hash(user_in.password)

    payload = {
        "email": user_in.email,
        "hashed_password": hashed_password,
        "first_name": user_in.first_name,
        "last_name": user_in.last_name,
    }

    otp_code = await create_otp(db, user_in.email, "signup", payload=payload)
    send_otp_email(user_in.email, otp_code)

    return {"email": user_in.email, "msg": "OTP sent successfully. Please verify to complete registration."}


async def authenticate_user(db: AsyncIOMotorDatabase, email: str, password: str):
    user = await get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user["hashed_password"]):
        return None
    return user


async def verify_signup_otp(db: AsyncIOMotorDatabase, email: str, code: str):
    pending = await get_pending_signup(db, email, code)
    if pending and "payload" in pending:
        payload = pending["payload"]
        user_id = await get_next_user_id(db)
        new_user = {
            "_id": user_id,
            "email": payload["email"],
            "hashed_password": payload["hashed_password"],
            "first_name": payload.get("first_name"),
            "last_name": payload.get("last_name"),
            "role": "user",
            "created_at": datetime.utcnow()
        }
        await db["users"].insert_one(new_user)
        await db["otps"].delete_many({"email": email, "purpose": "signup"})
        return True
    return False


async def request_password_reset(db: AsyncIOMotorDatabase, email: str):
    user = await get_user_by_email(db, email)
    if not user:
        return

    otp_code = await create_otp(db, email, "reset_password")
    send_reset_password_email(email, otp_code)


async def reset_password(db: AsyncIOMotorDatabase, reset_data: ResetPassword):
    if await verify_otp(db, reset_data.email, reset_data.otp_code, "reset_password"):
        hashed_password = get_password_hash(reset_data.new_password)
        await db["users"].update_one(
            {"email": reset_data.email},
            {"$set": {"hashed_password": hashed_password}}
        )
        return True
    return False
