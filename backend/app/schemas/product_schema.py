from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ProductCreate(BaseModel):
    title: str
    subtitle: Optional[str] = None
    price: str
    imageSrc: str
    imageAlt: Optional[str] = None

    colors: Optional[List[dict]] = None
    storage: Optional[List[dict]] = None
    features: Optional[List[dict]] = None
    specifications: Optional[dict] = None
    reviews: Optional[List[dict]] = None


class ProductUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    price: Optional[str] = None
    imageSrc: Optional[str] = None
    imageAlt: Optional[str] = None

    colors: Optional[List[dict]] = None
    storage: Optional[List[dict]] = None
    features: Optional[List[dict]] = None
    specifications: Optional[dict] = None
    reviews: Optional[List[dict]] = None


class ProductOut(BaseModel):
    id: str
    title: str
    subtitle: Optional[str]
    price: str
    imageSrc: str
    imageAlt: Optional[str]

    colors: List[dict]
    storage: List[dict]
    features: List[dict]
    specifications: dict
    reviews: List[dict]

    created_at: datetime
    updated_at: datetime