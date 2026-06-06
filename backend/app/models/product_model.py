from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class ProductColor(BaseModel):
    name: str
    hex: str
    images: List[str]


class ProductStorage(BaseModel):
    size: str
    price: str


class ProductFeature(BaseModel):
    title: str
    description: str
    icon: str


class ProductReview(BaseModel):
    name: str
    rating: int
    comment: str


class ProductSpecifications(BaseModel):
    finish: Optional[str] = None
    capacity: Optional[str] = None
    display: Optional[str] = None
    chip: Optional[str] = None



class Product(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")

    title: str
    subtitle: Optional[str] = None
    price: str

    imageSrc: str
    imageAlt: Optional[str] = None

    colors: List[ProductColor] = Field(default_factory=list)
    storage: List[ProductStorage] = Field(default_factory=list)
    features: List[ProductFeature] = Field(default_factory=list)

    specifications: Optional[ProductSpecifications] = None
    reviews: List[ProductReview] = Field(default_factory=list)

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)