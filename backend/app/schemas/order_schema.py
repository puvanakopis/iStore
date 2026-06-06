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


class OrderOut(BaseModel):
    id: str
    user_id: str
    customer_details: OrderCustomerDetailsSchema
    shipping_address: OrderShippingAddressSchema
    items: List[OrderItemSchema]
    subtotal: float
    discount: float
    shipping: float
    tax: float
    total: float
    promo_code: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime
