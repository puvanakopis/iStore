from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Union
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


class BodySpecs(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    dimensions: Optional[str] = None
    weight: Optional[str] = None
    build: Optional[str] = None


class DisplaySpecs(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    type: Optional[str] = None
    size: Optional[str] = None
    resolution: Optional[str] = None


class MainCameraSpecs(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    type: Optional[str] = None
    megapixels: Optional[str] = None
    video: Optional[str] = None


class SelfieCameraSpecs(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    megapixels: Optional[str] = None
    video: Optional[str] = None


class BatterySpecs(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    type: Optional[str] = None
    charging: Optional[str] = None


class PlatformSpecs(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    chip: Optional[str] = None
    os: Optional[str] = None


class ProductSpecifications(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    finish: Optional[str] = None
    capacity: Optional[str] = None
    chip: Optional[str] = None
    camera: Optional[str] = None

    body: Optional[BodySpecs] = None
    display: Optional[Union[DisplaySpecs, str]] = None
    main_camera: Optional[MainCameraSpecs] = Field(default=None, alias="mainCamera")
    selfie_camera: Optional[SelfieCameraSpecs] = Field(default=None, alias="selfieCamera")
    battery: Optional[Union[BatterySpecs, str]] = None
    platform: Optional[PlatformSpecs] = None


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