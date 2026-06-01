import random
import string
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.config import settings


def generate_otp(length: int = 6) -> str:
    return "".join(random.choices(string.digits, k=length))


async def create_otp(db: AsyncIOMotorDatabase, email: str, purpose: str) -> str:
    await db["otps"].delete_many({"email": email, "purpose": purpose})

    code = generate_otp()
    expires_at = datetime.utcnow() + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)

    otp_doc = {
        "email": email,
        "code": code,
        "expires_at": expires_at,
        "purpose": purpose,
        "created_at": datetime.utcnow()
    }
    await db["otps"].insert_one(otp_doc)
    return code


async def verify_otp(db: AsyncIOMotorDatabase, email: str, code: str, purpose: str) -> bool:
    db_otp = await db["otps"].find_one({
        "email": email,
        "code": code,
        "purpose": purpose,
        "expires_at": {"$gt": datetime.utcnow()}
    })

    if db_otp:
        await db["otps"].delete_one({"_id": db_otp["_id"]})
        return True
    return False
