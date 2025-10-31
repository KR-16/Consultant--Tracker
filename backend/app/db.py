import motor.motor_asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from typing import Optional

class Database:
    client: Optional[AsyncIOMotorClient] = None
    database = None

db = Database()

async def get_database():
    return db.database

async def init_db():
    """Initialize database connection"""
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    db.client = AsyncIOMotorClient(mongodb_url)
    db.database = db.client.consultant_tracker
    
    # Create indexes for better performance
    await create_indexes()

async def create_indexes():
    """Create database indexes"""
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

async def close_db():
    """Close database connection"""
    if db.client:
        db.client.close()
