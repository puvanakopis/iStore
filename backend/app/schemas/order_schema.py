from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class OrderCustomerDetailsSchema(BaseModel):
    firstName: str
    lastName: str
    email: str
    phone: str


class OrderShippingAddressSchema(BaseModel):
    address: str
    city: str
    state: str
    zipCode: str
    country: str


class OrderPaymentDetailsSchema(BaseModel):
    cardholder: str
    cardNumber: str
    expiry: str
    cvv: str  # We can accept CVV but won't save it in Order model/DB for compliance/mock purposes


class OrderItemSchema(BaseModel):
    product_id: str
    title: str
    price: str
    imageSrc: str
    color: str
    storage: str
    quantity: int = Field(..., ge=1)


class OrderCreate(BaseModel):
    customer_details: OrderCustomerDetailsSchema
    shipping_address: OrderShippingAddressSchema
    payment_details: OrderPaymentDetailsSchema
    items: List[OrderItemSchema]
    subtotal: float
    discount: float
    shipping: float
    tax: float
    total: float
    promo_code: Optional[str] = None
    payment: Optional[str] = "Paid"
    status: Optional[str] = "Pending"
    user_id: Optional[str] = None


class OrderOut(BaseModel):
    id: str
    user_id: Optional[str] = None
    customer_details: Optional[OrderCustomerDetailsSchema] = None
    shipping_address: Optional[OrderShippingAddressSchema] = None
    items: List[OrderItemSchema] = []
    subtotal: float = 0.0
    discount: float = 0.0
    shipping: float = 0.0
    tax: float = 0.0
    total: float = 0.0
    promo_code: Optional[str] = None
    status: Optional[str] = "Pending"
    payment: Optional[str] = "Paid"
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class OrderUpdate(BaseModel):
    customer_details: Optional[OrderCustomerDetailsSchema] = None
    shipping_address: Optional[OrderShippingAddressSchema] = None
    payment_details: Optional[OrderPaymentDetailsSchema] = None
    items: Optional[List[OrderItemSchema]] = None
    subtotal: Optional[float] = None
    discount: Optional[float] = None
    shipping: Optional[float] = None
    tax: Optional[float] = None
    total: Optional[float] = None
    promo_code: Optional[str] = None
    status: Optional[str] = None
    payment: Optional[str] = None
