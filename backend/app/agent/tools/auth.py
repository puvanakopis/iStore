from contextvars import ContextVar
from typing import Optional, Dict, List, Any

current_user_var: ContextVar[Optional[Dict]] = ContextVar("current_user", default=None)
chat_history_var: ContextVar[List[Any]] = ContextVar("chat_history", default=[])

def get_current_user_id() -> Optional[str]:
    user = current_user_var.get()
    if user:
        return str(user.get("id") or user.get("_id"))
    return None

def get_current_user_email() -> Optional[str]:
    user = current_user_var.get()
    if user:
        return user.get("email")
    return None

def get_current_user_details() -> Optional[Dict]:
    return current_user_var.get()
