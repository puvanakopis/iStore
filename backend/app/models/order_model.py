from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from typing import Optional, List
from bson import ObjectId


class OrderCustomerDetails(BaseModel):
    firstName: str
    lastName: str
    email: str
    phone: str


class OrderShippingAddress(BaseModel):
    address: str
    city: str
    state: str
    zipCode: str
    country: str


class OrderPaymentDetails(BaseModel):
    cardholder: str
    cardNumber: str  
    expiry: str


class OrderItem(BaseModel):
    product_id: str
    title: str
    price: str
    imageSrc: str
    color: str
    storage: str
    quantity: int


class Order(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    user_id: str
    customer_details: OrderCustomerDetails
    shipping_address: OrderShippingAddress
    payment_details: OrderPaymentDetails
    items: List[OrderItem]
    subtotal: float
    discount: float
    shipping: float
    tax: float
    total: float
    promo_code: Optional[str] = None
    status: str = Field(default="Pending")
    payment: str = Field(default="Paid")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(
        populate_by_name=True,
        json_encoders={ObjectId: str},
    )
