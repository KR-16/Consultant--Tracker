import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Consultant Tracker"
    API_V1_STR: str = "/api"
    
    # Database
   # Default to localhost for local development
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://recruit_user:recruit_password@localhost:5432/recruitops_db")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "CHANGE_THIS_TO_A_SECURE_SECRET_KEY")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # File Uploads
    UPLOAD_DIR: str = os.path.join(os.getcwd(), "uploads")

    class Config:
        case_sensitive = True

settings = Settings()
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)