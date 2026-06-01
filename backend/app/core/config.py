from pydantic_settings import BaseSettings
from pydantic import ConfigDict
from typing import Optional


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

    USE_MOCK_EMAIL: bool = True

    model_config = ConfigDict(env_file=".env", extra="ignore")


settings = Settings()
