from fastapi import APIRouter, Depends, Request, HTTPException, Header
from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from langchain_core.messages import HumanMessage, AIMessage
from jose import jwt
from app.core.database import get_db
from app.core.config import settings
from app.agent.tools.auth import current_user_var, chat_history_var, groq_api_key_var
from app.agent.main_agent import run_agent

router = APIRouter()

class ChatMessage(BaseModel):
    role: str # 'user' or 'assistant'
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []

class ChatResponse(BaseModel):
    response: str

async def get_optional_current_user(request: Request, db: AsyncIOMotorDatabase = Depends(get_db)) -> Optional[Dict[str, Any]]:
    """Helper to optionally authenticate user from Bearer token"""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None
        
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub")
        user = await db["users"].find_one({"_id": user_id})
        if user:
            user["id"] = str(user["_id"])
            return user
    except Exception:
        pass
    return None

@router.post("/chat", response_model=ChatResponse)
async def chat_with_agent(
    payload: ChatRequest,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
    x_groq_api_key: Optional[str] = Header(None)
):
    if not x_groq_api_key or not x_groq_api_key.strip():
        raise HTTPException(
            status_code=400,
            detail="GROQ_API_KEY is not set. Please set a valid Groq API key in the Chatbot settings."
        )

    # Set the ContextVar for the current request context
    token_token = current_user_var.set(current_user)
    groq_key_token = groq_api_key_var.set(x_groq_api_key.strip())

    # Convert chat history to LangChain format
    langchain_history = []
    for msg in payload.history:
        if msg.role == "user":
            langchain_history.append(HumanMessage(content=msg.content))
        elif msg.role == "assistant":
            langchain_history.append(AIMessage(content=msg.content))

    history_token = chat_history_var.set(langchain_history)

    try:
        # Run agent
        response_text = await run_agent(payload.message, langchain_history)
        return ChatResponse(response=response_text)
    except Exception as e:
        error_text = str(e)
        if "429" in error_text or "rate_limit" in error_text.lower():
            raise HTTPException(
                status_code=429,
                detail=(
                    "The AI service is temporarily rate-limited. "
                    "Please wait a few minutes and try again."
                ),
            )
        raise HTTPException(status_code=500, detail=f"Agent Error: {error_text}")
    finally:
        # Reset the ContextVars
        chat_history_var.reset(history_token)
        current_user_var.reset(token_token)
        groq_api_key_var.reset(groq_key_token)
