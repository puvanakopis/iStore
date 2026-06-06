from pydantic import BaseModel, EmailStr
from typing import Optional
from app.schemas.user_schema import User


class Token(BaseModel):
    access_token: str
    token_type: str
    user: User


class TokenPayload(BaseModel):
    sub: Optional[str] = None


class Login(BaseModel):
    email: EmailStr
    password: str


class Msg(BaseModel):
    msg: str


class ResetPassword(BaseModel):
    email: EmailStr
    otp_code: str
    new_password: str


class ForgotPassword(BaseModel):
    email: EmailStr
