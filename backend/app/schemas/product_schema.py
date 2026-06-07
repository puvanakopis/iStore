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


class ProductCreate(BaseModel):
    title: str
    subtitle: Optional[str] = None
    price: str
    imageSrc: str
    imageAlt: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None

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
    category: Optional[str] = None
    tags: Optional[List[str]] = None

    colors: Optional[List[ProductColor]] = None
    storage: Optional[List[ProductStorage]] = None
    features: Optional[List[ProductFeature]] = None
    specifications: Optional[ProductSpecifications] = None
    reviews: Optional[List[ProductReview]] = None


class ProductOut(BaseModel):
    id: str
    title: str
    subtitle: Optional[str]
    price: str
    imageSrc: str
    imageAlt: Optional[str]
    category: Optional[str]
    tags: Optional[List[str]]

    colors: List[ProductColor]
    storage: List[ProductStorage]
    features: List[ProductFeature]
    specifications: Optional[ProductSpecifications]
    reviews: List[ProductReview]

    created_at: datetime
    updated_at: datetime


class SearchResult(BaseModel):
    id: str
    title: str
    subtitle: Optional[str]
    price: str
    imageSrc: str
    category: Optional[str]
    relevance_score: Optional[float] = None


class SearchResponse(BaseModel):
    query: str
    results: List[SearchResult]
    total: int