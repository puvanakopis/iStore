import stripe
from datetime import datetime
from typing import Dict, Any, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import HTTPException, status
import logging
from app.core.config import settings
from app.schemas.order_schema import OrderCreate
from app.services import order_service

logger = logging.getLogger(__name__)


def get_stripe_client():
    api_key = settings.STRIPE_API_KEY
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="STRIPE_API_KEY is not configured on the server."
        )
    stripe.api_key = api_key
    return stripe


async def create_checkout_session(
    db: AsyncIOMotorDatabase,
    user_id: str,
    order_in: OrderCreate
) -> Dict[str, Any]:
    stripe_client = get_stripe_client()

    # 1. Create the pending order first in the database
    order_in_dict = order_in.model_copy(update={
        "status": "Pending",
        "payment": "Pending",
        "payment_method": "stripe",
        "user_id": user_id
    })
    created_order = await order_service.create_order(db, user_id, order_in_dict)
    order_id = created_order["_id"]

    # 2. Build items description
    items_summary = []
    for item in order_in.items:
        items_summary.append(f"{item.title} ({item.color}, {item.storage}) x{item.quantity}")
    description = ", ".join(items_summary)[:250]

    currency = (settings.STRIPE_CURRENCY or "usd").lower()
    unit_amount = max(50, int(round(order_in.total * 100)))

    # Use first valid image if available
    images = []
    if order_in.items and order_in.items[0].imageSrc:
        src = order_in.items[0].imageSrc
        if src.startswith("http://") or src.startswith("https://"):
            images.append(src)

    product_data: Dict[str, Any] = {
        "name": f"iStore Order #{order_id}",
        "description": description or "iStore Electronics Purchase",
    }
    if images:
        product_data["images"] = images

    line_items = [
        {
            "price_data": {
                "currency": currency,
                "product_data": product_data,
                "unit_amount": unit_amount,
            },
            "quantity": 1,
        }
    ]

    success_url = f"{settings.FRONTEND_URL}/checkout/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{settings.FRONTEND_URL}/checkout?canceled=true&order_id={order_id}"

    metadata = {
        "order_id": order_id,
        "user_id": user_id,
        "customer_email": order_in.customer_details.email,
        "promo_code": order_in.promo_code or "",
    }

    try:
        session = stripe_client.checkout.Session.create(
            mode="payment",
            customer_email=order_in.customer_details.email or None,
            line_items=line_items,
            success_url=success_url,
            cancel_url=cancel_url,
            metadata=metadata,
        )

        logger.info(f"Stripe Checkout Session created: {session.id} -> {session.url}")

        # 3. Update order with real stripe session id
        await db["orders"].update_one(
            {"_id": order_id},
            {"$set": {"stripe_session_id": session.id, "updated_at": datetime.utcnow()}}
        )

        return {
            "checkout_url": session.url,
            "session_id": session.id,
            "order_id": order_id,
            "total": order_in.total,
            "currency": currency,
        }

    except stripe.error.StripeError as e:
        error_msg = str(e)
        logger.error(f"Stripe Checkout Session creation failed: {error_msg}")

        # Clean up order
        await db["orders"].update_one(
            {"_id": order_id},
            {"$set": {"status": "Failed", "payment": "Failed", "updated_at": datetime.utcnow()}}
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Stripe error: {error_msg}"
        )


async def confirm_payment_session(
    db: AsyncIOMotorDatabase,
    session_id: str,
    user_id: Optional[str] = None
) -> Dict[str, Any]:
    stripe_client = get_stripe_client()

    # Find order by stripe_session_id
    order = await db["orders"].find_one({"stripe_session_id": session_id})
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found for this session.")

    if order.get("payment") == "Paid":
        order["id"] = order["_id"]
        return {"status": "paid", "order": order}

    try:
        session = stripe_client.checkout.Session.retrieve(session_id)
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Failed to retrieve Stripe session: {str(e)}")

    session_data = session.to_dict() if hasattr(session, "to_dict") else session
    payment_status = session_data.get("payment_status") if isinstance(session_data, dict) else getattr(session, "payment_status", None)
    payment_intent = session_data.get("payment_intent") if isinstance(session_data, dict) else getattr(session, "payment_intent", None)

    payment_intent_id = None
    if isinstance(payment_intent, str):
        payment_intent_id = payment_intent
    elif hasattr(payment_intent, "id"):
        payment_intent_id = payment_intent.id
    elif isinstance(payment_intent, dict):
        payment_intent_id = payment_intent.get("id")

    if payment_status == "paid":
        update_data = {
            "payment": "Paid",
            "status": "Processing",
            "updated_at": datetime.utcnow(),
        }
        if payment_intent_id:
            update_data["stripe_payment_intent_id"] = str(payment_intent_id)

        await db["orders"].update_one(
            {"_id": order["_id"]},
            {"$set": update_data}
        )
        order.update(update_data)
        order["id"] = order["_id"]
        return {"status": "paid", "order": order}
    else:
        order["id"] = order["_id"]
        return {"status": payment_status or "unpaid", "order": order}


async def process_webhook(
    db: AsyncIOMotorDatabase,
    payload: bytes,
    sig_header: Optional[str]
) -> Dict[str, Any]:
    stripe_client = get_stripe_client()
    webhook_secret = settings.STRIPE_WEBHOOK_SECRET

    try:
        if webhook_secret and sig_header:
            event = stripe_client.Webhook.construct_event(
                payload, sig_header, webhook_secret
            )
        else:
            import json
            event = json.loads(payload.decode("utf-8"))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid webhook payload: {str(e)}")

    event_data = event.to_dict() if hasattr(event, "to_dict") else event
    event_type = event_data.get("type") if isinstance(event_data, dict) else getattr(event, "type", None)
    data_object = event_data.get("data", {}).get("object", {}) if isinstance(event_data, dict) else getattr(getattr(event, "data", None), "object", {})
    if hasattr(data_object, "to_dict"):
        data_object = data_object.to_dict()

    if event_type == "checkout.session.completed":
        session_id = data_object.get("id")
        order_id = data_object.get("metadata", {}).get("order_id")
        payment_intent_id = data_object.get("payment_intent")

        query = {"_id": order_id} if order_id else {"stripe_session_id": session_id}
        await db["orders"].update_one(
            query,
            {
                "$set": {
                    "payment": "Paid",
                    "status": "Processing",
                    "stripe_payment_intent_id": payment_intent_id,
                    "updated_at": datetime.utcnow(),
                }
            }
        )
        return {"handled": True, "event": event_type, "order_id": order_id}

    elif event_type == "payment_intent.payment_failed":
        payment_intent_id = data_object.get("id")
        await db["orders"].update_one(
            {"stripe_payment_intent_id": payment_intent_id},
            {
                "$set": {
                    "payment": "Failed",
                    "updated_at": datetime.utcnow(),
                }
            }
        )
        return {"handled": True, "event": event_type}

    return {"handled": False, "event": event_type}
