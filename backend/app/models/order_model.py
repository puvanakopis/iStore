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
    cardholder: Optional[str] = None
    cardNumber: Optional[str] = None
    expiry: Optional[str] = None


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
    payment_details: Optional[OrderPaymentDetails] = None
    items: List[OrderItem]
    subtotal: float
    discount: float
    shipping: float
    tax: float
    total: float
    promo_code: Optional[str] = None
    status: str = Field(default="Pending")
    payment: str = Field(default="Paid")
    payment_method: Optional[str] = "stripe"
    stripe_session_id: Optional[str] = None
    stripe_payment_intent_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(
        populate_by_name=True,
        json_encoders={ObjectId: str},
    )
