from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import Optional, List
from bson import ObjectId


class WishlistItem(BaseModel):
    product_id: str
    title: str
    price: str
    imageSrc: str
    imageAlt: Optional[str] = None


class Wishlist(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    user_id: str
    items: List[WishlistItem] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(
        populate_by_name=True,
        json_encoders={ObjectId: str},
    )
