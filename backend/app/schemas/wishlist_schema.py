from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class WishlistItemBase(BaseModel):
    product_id: str
    title: str
    price: str
    imageSrc: str
    imageAlt: Optional[str] = None


class WishlistItemCreate(WishlistItemBase):
    pass


class WishlistItemRemove(BaseModel):
    product_id: str


class WishlistOut(BaseModel):
    id: Optional[str] = None
    user_id: str
    items: List[WishlistItemBase] = []
    created_at: datetime
    updated_at: datetime
