import motor.motor_asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from typing import Optional

logger = logging.getLogger(__name__)

class Database:
    client: Optional[AsyncIOMotorClient] = None
    database = None

db = Database()

async def get_database():
    if db.database is None:
        raise RuntimeError("Database not initialized. Call init_db() first.")
    return db.database

async def init_db():
    """Initialize database connection"""
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    
    # Log connection attempt (redact credentials if present)
    display_url = mongodb_url
    if '@' in mongodb_url:
        # Hide password in logs
        parts = mongodb_url.split('@')
        display_url = parts[0].split('//')[0] + '//***@' + parts[1] if len(parts) > 1 else mongodb_url
    logger.info(f"Attempting to connect to MongoDB at: {display_url}")
    
    try:
        # Set connection timeout and server selection timeout
        db.client = AsyncIOMotorClient(
            mongodb_url,
            serverSelectionTimeoutMS=5000,  # 5 second timeout
            connectTimeoutMS=5000
        )
        
        # Test the connection
        await db.client.admin.command('ping')
        logger.info("Successfully connected to MongoDB")
        
        db.database = db.client.consultant_tracker
        
        # Create indexes for better performance
        await create_indexes()
        
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {str(e)}")
        logger.error(f"MongoDB URL: {mongodb_url}")
        raise RuntimeError(f"Database connection failed: {str(e)}. Please check your MONGODB_URL environment variable.") from e

async def create_indexes():
    """Create database indexes"""
    try:
        # Consultants collection indexes
        await db.database.consultants.create_index("email", unique=True)
        await db.database.consultants.create_index("tech_stack")
        await db.database.consultants.create_index("available")
        await db.database.consultants.create_index("location")
        await db.database.consultants.create_index("visa_status")
        await db.database.consultants.create_index("rating")
        
        # Submissions collection indexes
        await db.database.submissions.create_index("consultant_id")
        await db.database.submissions.create_index("status")
        await db.database.submissions.create_index("recruiter")
        await db.database.submissions.create_index("submitted_on")
        await db.database.submissions.create_index("client_or_job")
        
        # Status history collection indexes
        await db.database.status_history.create_index("submission_id")
        await db.database.status_history.create_index("changed_at")
        
        logger.info("Database indexes created successfully")
    except Exception as e:
        logger.warning(f"Error creating indexes (this may be okay if they already exist): {str(e)}")

async def test_connection() -> bool:
    """Test MongoDB connection"""
    try:
        if db.client is None:
            return False
        await db.client.admin.command('ping')
        return True
    except Exception as e:
        logger.error(f"Connection test failed: {str(e)}")
        return False

async def close_db():
    """Close database connection"""
    if db.client:
        db.client.close()
        logger.info("Database connection closed")
