from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
import logging
from app.db import init_db, close_db
from app.routers import auth, consultants, jobs, submissions
from app.config import settings

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
        logger.debug("Step 1: Validating configuration settings")
        try:
            settings.validate_settings()
            logger.info("Configuration validation completed successfully")
        except Exception as e:
            logger.error(f"Configuration validation failed: {str(e)}", exc_info=True)
            # Continue anyway - validation is informational
        
        logger.debug("Step 2: Initializing database connection")
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
        title=settings.API_TITLE,
        description=settings.API_DESCRIPTION,
        version=settings.API_VERSION,
        lifespan=lifespan
    )
    logger.info(f"FastAPI application created: {app.title} v{app.version}")
except Exception as e:
    logger.critical(f"CRITICAL: Failed to create FastAPI application: {str(e)}", exc_info=True)
    raise

# CORS middleware - Configure for development
logger.info("Configuring CORS middleware")
try:
    # Get allowed origins from configuration
    logger.debug("Getting allowed CORS origins from configuration")
    allowed_origins = settings.get_cors_origins()
    
    logger.info(f"Total allowed CORS origins: {len(allowed_origins)}")
    logger.debug(f"Allowed origins: {allowed_origins}")
    
    # Add CORS middleware
    logger.debug("Adding CORS middleware to application")
    try:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=allowed_origins,
            allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
            allow_methods=settings.CORS_ALLOW_METHODS,
            allow_headers=settings.CORS_ALLOW_HEADERS,
            expose_headers=settings.CORS_EXPOSE_HEADERS,
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
    logger.debug("Including application routers")
    try:
        app.include_router(auth.router, prefix=settings.API_PREFIX, tags=["authentication"])
        app.include_router(consultants.router, prefix=settings.API_PREFIX, tags=["consultants"])
        app.include_router(jobs.router, prefix=settings.API_PREFIX, tags=["jobs"])
        app.include_router(submissions.router, prefix=settings.API_PREFIX, tags=["submissions"])
        logger.info(f"All routers registered successfully at {settings.API_PREFIX}")
    except Exception as e:
        logger.error(f"Error including routers: {str(e)}", exc_info=True)
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
        # You could add more health checks here (database, external services, etc.)
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
