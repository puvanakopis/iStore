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
    id: str = Field(alias="_id")
    email: str
    hashed_password: str

    model_config = ConfigDict(
        populate_by_name=True,
    )
