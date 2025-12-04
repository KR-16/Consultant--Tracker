from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
import logging
from app.db import init_db, close_db
from app.routers import auth, consultants, jobs, submissions

# Set up logger
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager - handles startup and shutdown"""
    logger.info("=" * 60)
    logger.info("Application startup initiated")
    logger.info("=" * 60)
    
    # Startup
    try:
        logger.debug("Step 1: Initializing database connection")
        try:
            await init_db()
            logger.info("Database initialization completed successfully")
        except Exception as e:
            logger.critical(f"CRITICAL: Database initialization failed: {str(e)}", exc_info=True)
            # Re-raise to prevent app from starting without database
            raise
    
    except Exception as e:
        logger.critical(f"CRITICAL: Application startup failed: {str(e)}", exc_info=True)
        raise
    
    logger.info("Application startup completed successfully")
    logger.info("=" * 60)
    
    yield
    
    # Shutdown
    logger.info("=" * 60)
    logger.info("Application shutdown initiated")
    logger.info("=" * 60)
    
    try:
        logger.debug("Step 1: Closing database connection")
        try:
            await close_db()
            logger.info("Database connection closed successfully")
        except Exception as e:
            logger.error(f"Error closing database connection: {str(e)}", exc_info=True)
            # Don't raise - try to continue shutdown
    
    except Exception as e:
        logger.error(f"Error during application shutdown: {str(e)}", exc_info=True)
    
    logger.info("Application shutdown completed")
    logger.info("=" * 60)

# Create FastAPI application
logger.info("Creating FastAPI application instance")
try:
    app = FastAPI(
        title="Consultant Tracker API - Authentication",
        description="API for user authentication and management",
        version="1.0.0",
        lifespan=lifespan
    )
    logger.info(f"FastAPI application created: {app.title} v{app.version}")
except Exception as e:
    logger.critical(f"CRITICAL: Failed to create FastAPI application: {str(e)}", exc_info=True)
    raise

# CORS middleware - Configure for development
logger.info("Configuring CORS middleware")
try:
    # Step 1: Set default allowed origins
    logger.debug("Step 1: Setting default allowed origins")
    allowed_origins = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://frontend:3000",
    ]
    logger.debug(f"Default allowed origins: {allowed_origins}")
    
    # Step 2: Get additional origins from environment variable
    logger.debug("Step 2: Checking for additional CORS origins from environment")
    cors_origins_env = os.getenv("CORS_ORIGINS", "")
    if cors_origins_env:
        logger.debug(f"Found CORS_ORIGINS environment variable: {cors_origins_env}")
        try:
            additional_origins = [origin.strip() for origin in cors_origins_env.split(",") if origin.strip()]
            allowed_origins.extend(additional_origins)
            logger.info(f"Added {len(additional_origins)} additional CORS origins from environment")
        except Exception as e:
            logger.error(f"Error parsing CORS_ORIGINS environment variable: {str(e)}", exc_info=True)
            logger.warning("Continuing with default CORS origins only")
    else:
        logger.debug("No CORS_ORIGINS environment variable found - using defaults only")
    
    logger.info(f"Total allowed CORS origins: {len(allowed_origins)}")
    logger.debug(f"Allowed origins: {allowed_origins}")
    
    # Step 3: Add CORS middleware
    logger.debug("Step 3: Adding CORS middleware to application")
    try:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=allowed_origins,
            allow_credentials=True,
            allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
            allow_headers=["*"],
            expose_headers=["*"],
        )
        logger.info("CORS middleware configured successfully")
    except Exception as e:
        logger.error(f"Error adding CORS middleware: {str(e)}", exc_info=True)
        raise

except Exception as e:
    logger.error(f"Error configuring CORS: {str(e)}", exc_info=True)
    raise

# Include routers
logger.info("Registering application routers")
try:
    logger.debug("Step 1: Including authentication router")
    try:
        app.include_router(auth.router, prefix="/api", tags=["authentication"])
        app.include_router(consultants.router, prefix="/api", tags=["consultants"])
        app.include_router(jobs.router, prefix="/api", tags=["jobs"])
        app.include_router(submissions.router, prefix="/api", tags=["submissions"])
        logger.info("Authentication router registered successfully at /api")
        logger.debug(f"Router prefix: /api, tags: ['authentication']")
    except Exception as e:
        logger.error(f"Error including authentication router: {str(e)}", exc_info=True)
        raise
except Exception as e:
    logger.error(f"Error registering routers: {str(e)}", exc_info=True)
    raise

@app.get("/")
async def root():
    """Root endpoint - API information"""
    logger.debug("Root endpoint accessed")
    
    try:
        response = {
            "message": "Consultant Tracker API - Authentication Service",
            "version": "1.0.0"
        }
        logger.debug(f"Root endpoint response: {response}")
        return response
    except Exception as e:
        logger.error(f"Error in root endpoint: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving API information"
        )

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    logger.debug("Health check endpoint accessed")
    
    try:
        logger.debug("Performing health check")
        
        response = {"status": "healthy"}
        logger.debug(f"Health check response: {response}")
        return response
    except Exception as e:
        logger.error(f"Error in health check endpoint: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Health check failed"
        )