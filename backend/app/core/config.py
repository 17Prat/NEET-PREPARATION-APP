import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "PrepWise NEET Preparation Platform"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-neet-prep-key-change-in-prod-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days for dev convenience
    
    # Defaults to local SQLite, or PostgreSQL if DATABASE_URL is set
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./neet_prep.db")

    # Analytics threshold defaults
    WEAK_AREA_ACCURACY_THRESHOLD: float = 60.0
    MIN_ATTEMPTS_FOR_ANALYSIS: int = 3

    class Config:
        case_sensitive = True

settings = Settings()
