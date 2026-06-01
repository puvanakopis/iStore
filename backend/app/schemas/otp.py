from pydantic import BaseModel, EmailStr


class OTPBase(BaseModel):
    email: EmailStr
    code: str


class OTPVerify(OTPBase):
    purpose: str


class OTPCreate(BaseModel):
    email: EmailStr
    purpose: str
