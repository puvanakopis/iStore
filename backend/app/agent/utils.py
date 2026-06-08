from datetime import datetime
from typing import Any

from bson import ObjectId


def sanitize_doc(value: Any) -> Any:
    """Convert MongoDB values into JSON-safe primitives for agent tool output."""
    if isinstance(value, dict):
        return {key: sanitize_doc(item) for key, item in value.items()}
    if isinstance(value, list):
        return [sanitize_doc(item) for item in value]
    if isinstance(value, ObjectId):
        return str(value)
    if isinstance(value, datetime):
        return value.isoformat()
    return value
