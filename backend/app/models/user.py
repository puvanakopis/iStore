from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import Optional
from bson import ObjectId


class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, handler):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, core_schema, handler):
        return {"type": "string"}


class User(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    email: str
    hashed_password: str
    full_name: Optional[str] = None
    is_active: bool = False
    is_verified: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )
