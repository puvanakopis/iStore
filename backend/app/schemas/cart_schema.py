from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class CartItemBase(BaseModel):
    product_id: str
    title: str
    price: str
    imageSrc: str
    color: str
    storage: str
    quantity: int = Field(default=1, ge=1)


class CartItemCreate(CartItemBase):
    pass


class CartItemUpdate(BaseModel):
    product_id: str
    color: str
    storage: str
    quantity: int = Field(..., ge=1)


class CartItemRemove(BaseModel):
    product_id: str
    color: str
    storage: str


class CartOut(BaseModel):
    id: Optional[str] = None
    user_id: str
    items: List[CartItemBase] = []
    created_at: datetime
    updated_at: datetime
