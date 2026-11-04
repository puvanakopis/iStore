from fastapi import APIRouter, Depends, Request, status, Header
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Optional

from app.core.database import get_db
from app.core.security import get_optional_current_user
from app.schemas.order_schema import OrderCreate
from app.services import payment_service

router = APIRouter()


@router.post("/create-checkout-session", status_code=status.HTTP_200_OK)
async def create_checkout_session(
    order_in: OrderCreate,
    current_user: Optional[dict] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user_id = str(current_user["id"]) if current_user else (order_in.user_id or order_in.customer_details.email or "guest")
    return await payment_service.create_checkout_session(db, user_id, order_in)


@router.get("/session/{session_id}", status_code=status.HTTP_200_OK)
async def get_session_status(
    session_id: str,
    current_user: Optional[dict] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user_id = str(current_user["id"]) if current_user else None
    return await payment_service.confirm_payment_session(db, session_id, user_id)


@router.post("/webhook", status_code=status.HTTP_200_OK)
async def stripe_webhook(
    request: Request,
    stripe_signature: Optional[str] = Header(None, alias="stripe-signature"),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    payload = await request.body()
    result = await payment_service.process_webhook(db, payload, stripe_signature)
    return {"received": True, **result}
