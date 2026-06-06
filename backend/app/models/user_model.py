from pydantic import BaseModel, ConfigDict, Field, EmailStr
from datetime import datetime
from typing import Optional, Literal
from bson import ObjectId



class User(BaseModel):

    id: Optional[str] = Field(default=None, alias="_id")
    email: EmailStr
    hashed_password: str
    role: Literal["user", "admin"] = Field(default="user")
    first_name: str
    last_name: str
    phone: Optional[str] = None
    address: Optional[str] = None
    avatar_initials: Optional[str] = None
    member_status: Optional[str] = "standard"
    member_since: Optional[datetime] = None
    email_notifications: bool = True
    push_notifications: bool = False
    sms_updates: bool = False

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(
        populate_by_name=True,
        json_encoders={ObjectId: str},
    )