from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import HTTPException, status
from app.core.security import get_password_hash, verify_password, create_access_token
from app.services.otp_service import create_otp, verify_otp
from app.services.email_service import send_otp_email, send_reset_password_email
from app.schemas.auth import ResetPassword
from datetime import datetime


async def get_user_by_email(db: AsyncIOMotorDatabase, email: str):
    user = await db["users"].find_one({"email": email})
    if user:
        user["id"] = str(user["_id"])
    return user


async def signup_user(db: AsyncIOMotorDatabase, user_in):
    db_user = await get_user_by_email(db, user_in.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )

    hashed_password = get_password_hash(user_in.password)
    new_user = {
        "email": user_in.email,
        "hashed_password": hashed_password,
        "full_name": user_in.full_name,
        "is_active": True,
        "is_verified": False,
        "created_at": datetime.utcnow()
    }
    result = await db["users"].insert_one(new_user)
    new_user["id"] = str(result.inserted_id)

    otp_code = await create_otp(db, user_in.email, "signup")
    send_otp_email(user_in.email, otp_code)

    return new_user


async def authenticate_user(db: AsyncIOMotorDatabase, email: str, password: str):
    user = await get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user["hashed_password"]):
        return None
    if not user["is_verified"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account not verified. Please verify your email."
        )
    return user


async def verify_signup_otp(db: AsyncIOMotorDatabase, email: str, code: str):
    if await verify_otp(db, email, code, "signup"):
        await db["users"].update_one(
            {"email": email},
            {"$set": {"is_verified": True}}
        )
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
