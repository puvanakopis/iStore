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
    created_at: Optional[datetime] = None


class ProductSpecifications(BaseModel):
    finish: Optional[str] = None
    capacity: Optional[str] = None
    display: Optional[str] = None
    chip: Optional[str] = None
    camera: Optional[str] = None
    battery: Optional[str] = None
    ram: Optional[str] = None


class ProductCreate(BaseModel):
    title: str
    subtitle: Optional[str] = None
    price: str
    imageSrc: str
    imageAlt: Optional[str] = None
    stock_quantity: Optional[int] = 10

    colors: Optional[List[ProductColor]] = None
    storage: Optional[List[ProductStorage]] = None
    features: Optional[List[ProductFeature]] = None
    specifications: Optional[ProductSpecifications] = None
    reviews: Optional[List[ProductReview]] = None


class ProductUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    price: Optional[str] = None
    imageSrc: Optional[str] = None
    imageAlt: Optional[str] = None
    stock_quantity: Optional[int] = None

    colors: Optional[List[ProductColor]] = None
    storage: Optional[List[ProductStorage]] = None
    features: Optional[List[ProductFeature]] = None
    specifications: Optional[ProductSpecifications] = None
    reviews: Optional[List[ProductReview]] = None


class ProductOut(BaseModel):
    id: str
    title: str
    subtitle: Optional[str] = None
    price: str
    imageSrc: str
    imageAlt: Optional[str] = None
    stock_quantity: Optional[int] = None

    colors: List[ProductColor] = Field(default_factory=list)
    storage: List[ProductStorage] = Field(default_factory=list)
    features: List[ProductFeature] = Field(default_factory=list)
    specifications: Optional[ProductSpecifications] = None
    reviews: List[ProductReview] = Field(default_factory=list)

    created_at: datetime
    updated_at: datetime


class SearchResult(BaseModel):
    id: str
    title: str
    subtitle: Optional[str]
    price: str
    imageSrc: str
    relevance_score: Optional[float] = None


class SearchResponse(BaseModel):
    query: str
    results: List[SearchResult]
    total: int