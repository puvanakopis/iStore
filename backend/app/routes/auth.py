from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.database import get_db
from app.schemas.auth import Token, Login, Msg, ResetPassword, ForgotPassword
from app.schemas.user import UserCreate, User as UserSchema
from app.services import auth_service
from app.core.security import create_access_token
from app.schemas.otp import OTPVerify

router = APIRouter()


@router.post("/signup", response_model=UserSchema)
async def signup(user_in: UserCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    return await auth_service.signup_user(db, user_in)


@router.post("/verify-otp", response_model=Msg)
async def verify_otp(otp_data: OTPVerify, db: AsyncIOMotorDatabase = Depends(get_db)):

    if otp_data.purpose == "signup":
        success = await auth_service.verify_signup_otp(
            db, otp_data.email, otp_data.code)
    else:
        raise HTTPException(
            status_code=400, detail="Invalid verification purpose")

    if not success:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    return {"msg": "OTP verified successfully"}


@router.post("/login", response_model=Token)
async def login(login_data: Login, db: AsyncIOMotorDatabase = Depends(get_db)):
    user = await auth_service.authenticate_user(
        db, login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    access_token = create_access_token(subject=user["id"])
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/forgot-password", response_model=Msg)
async def forgot_password(data: ForgotPassword, db: AsyncIOMotorDatabase = Depends(get_db)):
    await auth_service.request_password_reset(db, data.email)
    return {"msg": "If the email exists, a reset code has been sent."}


@router.post("/reset-password", response_model=Msg)
async def reset_password(data: ResetPassword, db: AsyncIOMotorDatabase = Depends(get_db)):
    success = await auth_service.reset_password(db, data)
    if not success:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
    return {"msg": "Password updated successfully"}
