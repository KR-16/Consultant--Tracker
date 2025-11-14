from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import motor.motor_asyncio
import os
import logging
from app.db import init_db, close_db, test_connection
from app.routers import consultants, submissions, reports

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    try:
        await init_db()
        logger.info("Application started successfully")
    except Exception as e:
        logger.error(f"Failed to start application: {str(e)}")
        raise
    yield
    # Shutdown
    await close_db()
    logger.info("Application shutdown complete")

app = FastAPI(
    title="Consultant Tracker API",
    description="API for managing consultants and job submissions",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware - configure allowed origins from environment variable
# For production, set CORS_ORIGINS environment variable (comma-separated)
# Example: CORS_ORIGINS="https://yourdomain.com,https://www.yourdomain.com"
cors_origins_env = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://frontend:3000")
cors_origins = [origin.strip() for origin in cors_origins_env.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(consultants.router, prefix="/api/consultants", tags=["consultants"])
app.include_router(submissions.router, prefix="/api/submissions", tags=["submissions"])
app.include_router(reports.router, prefix="/api/reports", tags=["reports"])

@app.get("/")
async def root():
    return {"message": "Consultant Tracker API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    """Health check endpoint with MongoDB connectivity test"""
    db_status = await test_connection()
    if db_status:
        return {
            "status": "healthy",
            "database": "connected"
        }
    else:
        return {
            "status": "unhealthy",
            "database": "disconnected"
        }
