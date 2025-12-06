from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    # CHANGE THIS LINE: from 'mongo' to 'localhost'
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017/recruitops")
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-super-secret-key-change-this-in-prod")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"

settings = Settings()