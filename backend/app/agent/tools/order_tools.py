from langchain_core.tools import tool
from app.core.database import get_db
from app.services import order_service, product_service
from app.agent.tools.auth import get_current_user_id, get_current_user_details
from app.schemas.order_schema import (
    OrderCreate,
    OrderCustomerDetailsSchema,
    OrderShippingAddressSchema,
    OrderPaymentDetailsSchema,
    OrderItemSchema
)
from typing import List, Dict, Any, Optional, Tuple

from app.agent.utils import sanitize_doc


def _parse_price(price_str: str) -> float:
    try:
        return float(price_str.replace("$", "").replace(",", "").replace("Rs.", "").replace("Rs", "").strip())
    except ValueError:
        return 0.0


def _default_shipping(user_details: Optional[Dict[str, Any]] = None) -> Dict[str, str]:
    """Build shipping address from user profile or sensible store defaults."""
    user_address = (user_details or {}).get("address")
    return {
        "address": user_address or "123 Galle Road",
        "city": "Colombo",
        "state": "Western Province",
        "zip_code": "00300",
        "country": "Sri Lanka",
    }


def _pick_color(available_colors: list, color_name: str):
    if not available_colors:
        return {"name": color_name or "Standard", "images": []}
    if color_name:
        match = next(
            (c for c in available_colors if c["name"].lower() == color_name.lower()),
            None,
        )
        if match:
            return match
    return available_colors[0]


def _pick_storage(available_storage: list, storage_size: str):
    if not available_storage:
        return None, storage_size or "Standard"
    if storage_size:
        match = next(
            (s for s in available_storage if s["size"].lower() == storage_size.lower()),
            None,
        )
        if match:
            return match, match["size"]
    first = available_storage[0]
    return first, first["size"]


async def _resolve_product_line_item(
    db,
    product_id: str,
    color_name: str = "",
    storage_size: str = "",
    quantity: int = 1,
) -> Tuple[Optional[OrderItemSchema], Optional[Dict[str, Any]]]:
    try:
        product = await product_service.get_product_by_id(db, product_id)
    except Exception:
        return None, {"error": f"Product with ID '{product_id}' not found."}

    available_colors = product.get("colors", [])
    selected_color = _pick_color(available_colors, color_name)
    if available_colors and color_name and selected_color["name"].lower() != color_name.lower():
        return None, {
            "error": f"Color '{color_name}' is not available for '{product['title']}'.",
            "available_colors": [c["name"] for c in available_colors],
        }
    if not selected_color.get("images"):
        selected_color["images"] = [product.get("imageSrc")]

    available_storage = product.get("storage", [])
    selected_storage, storage_size = _pick_storage(available_storage, storage_size)
    item_price = product["price"]

    if selected_storage:
        item_price = selected_storage["price"]

    image_src = product.get("imageSrc")
    if selected_color and selected_color.get("images"):
        image_src = selected_color["images"][0]

    final_color = selected_color["name"] if selected_color else color_name
    final_storage = selected_storage["size"] if selected_storage else storage_size

    return (
        OrderItemSchema(
            product_id=product_id,
            title=product["title"],
            price=item_price,
            imageSrc=image_src,
            color=final_color,
            storage=final_storage,
            quantity=quantity,
        ),
        None,
    )


def _format_price(amount: float) -> str:
    return f"Rs. {amount:,.0f}"


def _format_order_options(product: Dict[str, Any]) -> str:
    title = product.get("title", "Unknown")
    product_id = product.get("id", "N/A")
    base_price = _normalize_price_display(product.get("price"))

    lines = [
        f"Here are the available options for **{title}** (ID: `{product_id}`):",
        "",
        f"**Base price:** {base_price}",
        "",
    ]

    colors = product.get("colors", [])
    if colors:
        lines.append("**Available colors:**")
        for color in colors:
            lines.append(f"- {color.get('name', 'Unknown')}")
        lines.append("")

    storage = product.get("storage", [])
    if storage:
        lines.append("**Available storage:**")
        for option in storage:
            size = option.get("size", "Unknown")
            price = _normalize_price_display(option.get("price"))
            lines.append(f"- {size} — {price}")
        lines.append("")

    if not colors and not storage:
        lines.append("This product has no color or storage variants.")
        lines.append("")

    lines.append(
        "Please tell me your preferred **color** and **storage** option "
        "(e.g. Midnight and 256GB)."
    )
    return "\n".join(lines)


def _normalize_price_display(price: Any) -> str:
    if price is None:
        return "N/A"
    text = str(price).strip()
    if text.lower().startswith("rs"):
        return text
    return f"Rs. {text}"


def _format_order_success(result: Dict[str, Any]) -> str:
    order = result.get("order", {})
    items = order.get("items", [])
    item = items[0] if items else {}
    return (
        f"Order placed successfully!\n\n"
        f"- **Order ID:** `{order.get('id', 'N/A')}`\n"
        f"- **Status:** {order.get('status', 'Pending')}\n"
        f"- **Product:** {item.get('title', 'N/A')}\n"
        f"- **Color:** {item.get('color', 'N/A')}\n"
        f"- **Storage:** {item.get('storage', 'N/A')}\n"
        f"- **Quantity:** {item.get('quantity', 1)}\n"
        f"- **Subtotal:** {_format_price(order.get('subtotal', 0))}\n"
        f"- **Discount:** {_format_price(order.get('discount', 0))}\n"
        f"- **Shipping:** {_format_price(order.get('shipping', 0))}\n"
        f"- **Tax:** {_format_price(order.get('tax', 0))}\n"
        f"- **Total:** {_format_price(order.get('total', 0))}"
    )


async def _place_product_order_impl(
    product_id: str,
    color_name: str = "",
    storage_size: str = "",
    quantity: int = 1,
    address: Optional[str] = None,
    city: Optional[str] = None,
    state: Optional[str] = None,
    zip_code: Optional[str] = None,
    country: Optional[str] = None,
    cardholder_name: Optional[str] = None,
    card_number: Optional[str] = "4111111111114242",
    card_expiry: Optional[str] = "12/28",
    card_cvv: Optional[str] = "123",
    promo_code: Optional[str] = None,
) -> Dict[str, Any]:
    user_id = get_current_user_id()
    user_details = get_current_user_details()
    if not user_id or not user_details:
        return {"error": "User not authenticated. Please log in first."}

    db = get_db()
    if db is None:
        return {"error": "Database connection is not available."}

    line_item, error = await _resolve_product_line_item(
        db, product_id, color_name, storage_size, quantity
    )
    if error:
        return error

    subtotal = _parse_price(line_item.price) * line_item.quantity

    first_name = user_details.get("first_name") or user_details.get("firstName") or "iStore"
    last_name = user_details.get("last_name") or user_details.get("lastName") or "User"

    customer = OrderCustomerDetailsSchema(
        firstName=first_name,
        lastName=last_name,
        email=user_details.get("email") or "",
        phone=user_details.get("phone") or "555-0199",
    )

    if not cardholder_name:
        cardholder_name = f"{customer.firstName} {customer.lastName}"

    defaults = _default_shipping(user_details)
    shipping_addr = OrderShippingAddressSchema(
        address=address or defaults["address"],
        city=city or defaults["city"],
        state=state or defaults["state"],
        zipCode=zip_code or defaults["zip_code"],
        country=country or defaults["country"],
    )

    payment = OrderPaymentDetailsSchema(
        cardholder=cardholder_name,
        cardNumber=card_number,
        expiry=card_expiry,
        cvv=card_cvv,
    )

    shipping_fee = 0.0 if subtotal > 500.0 else 15.0

    discount_val = 0.0
    if promo_code and promo_code.upper() == "SAVE10":
        discount_val = round(subtotal * 0.10, 2)

    tax_val = round((subtotal - discount_val) * 0.0825, 2)
    total_val = round(subtotal - discount_val + shipping_fee + tax_val, 2)

    order_in = OrderCreate(
        customer_details=customer,
        shipping_address=shipping_addr,
        payment_details=payment,
        items=[line_item],
        subtotal=subtotal,
        discount=discount_val,
        shipping=shipping_fee,
        tax=tax_val,
        total=total_val,
        promo_code=promo_code,
        payment="Paid",
        status="Pending",
        user_id=user_id,
    )

    try:
        new_order = await order_service.create_order(db, user_id, order_in)
        new_order["id"] = str(new_order["_id"])
        new_order.pop("_id", None)
        return {
            "success": True,
            "message": "Order created successfully!",
            "order": sanitize_doc(new_order),
        }
    except Exception as e:
        return {"error": f"Failed to place order: {str(e)}"}


@tool(return_direct=True)
async def get_product_order_options(product_query: str) -> str:
    """Look up a product by name and return available color and storage options.

    Use this as the FIRST step when a customer wants to order a product.
    Does NOT place an order — only shows variants so the customer can choose.
    """
    db = get_db()
    if db is None:
        return "Sorry, the database is not available right now. Please try again later."

    res = await product_service.search_products(db, product_query, limit=3)
    results = res.get("results", [])
    if not results:
        return f'No products found matching "{product_query}". Please try a different name.'

    product = results[0]
    try:
        full_product = await product_service.get_product_by_id(db, product["id"])
    except Exception:
        full_product = product

    return _format_order_options(full_product)


@tool(return_direct=True)
async def order_product_by_name(
    product_query: str,
    quantity: int = 1,
    color_name: str = "",
    storage_size: str = "",
    promo_code: Optional[str] = None,
) -> str:
    """Search for a product by name and place an order.

    Use ONLY after the customer has chosen color, storage, and quantity AND
    explicitly confirmed they want to place the order (e.g. "yes", "confirm").
    """
    db = get_db()
    if db is None:
        return "Sorry, the database is not available right now. Please try again later."

    res = await product_service.search_products(db, product_query, limit=3)
    results = res.get("results", [])
    if not results:
        return f'No products found matching "{product_query}". Please try a different name.'

    product = results[0]
    result = await _place_product_order_impl(
        product_id=product["id"],
        color_name=color_name,
        storage_size=storage_size,
        quantity=quantity,
        promo_code=promo_code,
    )

    if result.get("error"):
        return f"Could not place order: {result['error']}"

    return _format_order_success(result)


@tool
async def get_my_orders() -> List[Dict[str, Any]]:
    """Retrieve the order history for the current logged-in user."""
    user_id = get_current_user_id()
    if not user_id:
        return [{"error": "User not authenticated."}]

    db = get_db()
    if db is None:
        return [{"error": "Database connection is not available."}]
    orders = await order_service.get_user_orders(db, user_id)
    return sanitize_doc(orders)


@tool
async def place_product_order(
    product_id: str,
    color_name: str = "",
    storage_size: str = "",
    quantity: int = 1,
    address: Optional[str] = None,
    city: Optional[str] = None,
    state: Optional[str] = None,
    zip_code: Optional[str] = None,
    country: Optional[str] = None,
    cardholder_name: Optional[str] = None,
    card_number: Optional[str] = "4111111111114242",
    card_expiry: Optional[str] = "12/28",
    card_cvv: Optional[str] = "123",
    promo_code: Optional[str] = None,
) -> Dict[str, Any]:
    """Place an order for a single product — no cart required.

    Use ONLY after the customer has chosen color, storage, and quantity AND
    explicitly confirmed they want to place the order. Do NOT call on the first
    purchase request.

    Parameters:
    - product_id: The ID of the product (e.g. 'product_01') — required
    - color_name: Color option; omit to use the first available color
    - storage_size: Storage option; omit to use the first available size
    - quantity: Quantity to order (default 1)
    - address, city, state, zip_code, country: Optional shipping overrides
    - promo_code: Optional promotional code (e.g. 'SAVE10')
    """
    return await _place_product_order_impl(
        product_id=product_id,
        color_name=color_name,
        storage_size=storage_size,
        quantity=quantity,
        address=address,
        city=city,
        state=state,
        zip_code=zip_code,
        country=country,
        cardholder_name=cardholder_name,
        card_number=card_number,
        card_expiry=card_expiry,
        card_cvv=card_cvv,
        promo_code=promo_code,
    )


@tool
async def cancel_order(order_id: str) -> Dict[str, Any]:
    """Cancel a pending order by updating its status to 'Cancelled'.
    Only orders that are currently 'Pending' can be cancelled.
    """
    user_id = get_current_user_id()
    if not user_id:
        return {"error": "User not authenticated."}

    db = get_db()
    order = await db["orders"].find_one({"_id": order_id})
    if not order:
        return {"error": f"Order '{order_id}' not found."}

    if order.get("user_id") != user_id:
        return {"error": "You do not have permission to cancel this order."}

    current_status = order.get("status", "Pending")
    if current_status.lower() != "pending":
        return {"error": f"Order cannot be cancelled because its current status is '{current_status}'."}

    from datetime import datetime

    result = await db["orders"].update_one(
        {"_id": order_id},
        {"$set": {"status": "Cancelled", "updated_at": datetime.utcnow()}},
    )

    if result.modified_count == 0:
        return {"error": "Failed to update order status."}

    return {
        "success": True,
        "message": f"Order '{order_id}' has been successfully cancelled.",
        "order_id": order_id,
        "status": "Cancelled",
    }
