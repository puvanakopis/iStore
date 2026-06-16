from typing import Optional

from pydantic_settings import BaseSettings
from pydantic import AliasChoices, ConfigDict, Field


class Settings(BaseSettings):
    PROJECT_NAME: str = "iStore API"
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Database
    MONGODB_URL: str
    DATABASE_NAME: str

    # OTP
    OTP_EXPIRE_MINUTES: int = 10

    # Email
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: Optional[int] = None
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    EMAILS_FROM_EMAIL: str = "noreply@istore.com"
    EMAILS_FROM_NAME: str = "iStore"

    # Groq only
    GROQ_API_KEY: Optional[str] = None

    # Model settings (locked to Groq)
    # Prefer llama-3.1-8b-instant — higher rate limits than 70b models on free tier.
    MODEL_PROVIDER: str = "groq"
    MODEL_NAME: str = Field(
        default="llama-3.1-8b-instant",
        validation_alias=AliasChoices("MODEL_NAME", "LLM_MODEL_NAME"),
    )

    API_BASE_URL: str = "http://localhost:8000"

    USE_MOCK_EMAIL: bool = True

    model_config = ConfigDict(
        env_file=".env",
        extra="ignore",
        populate_by_name=True,
    )


settings = Settings()

_llm_cache: dict[float, object] = {}


def get_llm(temperature: float = 0.0):
    """Return a cached Groq Chat LLM instance (one client per temperature and key)."""
    from langchain_groq import ChatGroq
    from app.agent.tools.auth import groq_api_key_var

    api_key = groq_api_key_var.get()
    if not api_key:
        raise ValueError("GROQ_API_KEY is required but not set in the chatbot context")

    cache_key = (temperature, api_key)
    if cache_key in _llm_cache:
        return _llm_cache[cache_key]

    llm = ChatGroq(
        model=settings.MODEL_NAME,
        temperature=temperature,
        groq_api_key=api_key,
        max_retries=2,
    )
    _llm_cache[cache_key] = llm
    return llm