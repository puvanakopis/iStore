from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: Optional[str] = "user"
    phone: Optional[str] = None
    address: Optional[str] = None
    avatar_initials: Optional[str] = None
    member_status: Optional[str] = "standard"
    member_since: Optional[datetime] = None
    email_notifications: Optional[bool] = True
    push_notifications: Optional[bool] = False
    sms_updates: Optional[bool] = False


class UserCreate(UserBase):
    password: str


class UserUpdate(UserBase):
    password: Optional[str] = None


class UserInDBBase(UserBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class User(UserInDBBase):
    pass


class UserAdminResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: str  # "Admin" or "Customer"
    spent: float = 0.0
    status: str  # "Active" or "Blocked"


class UserAdminUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None  # "Admin" or "Customer"
    status: Optional[str] = None  # "Active" or "Blocked"


class UserProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    email_notifications: Optional[bool] = None
    push_notifications: Optional[bool] = None
    sms_updates: Optional[bool] = None


