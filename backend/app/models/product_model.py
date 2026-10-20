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