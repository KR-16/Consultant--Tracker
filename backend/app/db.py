import logging
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import PyMongoError, ConnectionFailure, ServerSelectionTimeoutError
from app.config import settings

# Set up logger
logger = logging.getLogger(__name__)

class Database:
    client: AsyncIOMotorClient = None
    database = None
    
    def __init__(self):
        logger.debug("Database class instance created")
    
    def __repr__(self):
        client_status = "connected" if self.client else "not connected"
        database_status = "set" if self.database else "not set"
        return f"Database(client={client_status}, database={database_status})"

# Global Database Instance
db = Database()

async def get_database():
    """
    Dependency to get the database instance.
    Usage in routers: db = Depends(get_database)
    """
    try:
        if db.database is None:
            logger.warning("Database instance is None - database may not be initialized")
            raise ValueError("Database not initialized. Call init_db() first.")
        return db.database
        
    except ValueError as e:
        logger.error(f"Database not available: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error getting database: {str(e)}", exc_info=True)
        raise ValueError(f"Failed to get database: {str(e)}")

async def create_indexes():
    """Create database indexes for users and other collections"""
    logger.info("Creating database indexes")
    
    try:
        if db.database is None:
            raise ValueError("Database not initialized")

        # 1. User Indexes
        await db.database.users.create_index("email", unique=True)
        await db.database.users.create_index("role")
        await db.database.users.create_index("is_active")
        
        # 2. Candidate Profile Indexes
        await db.database.candidate_profiles.create_index("user_id", unique=True)
        
        # 3. Submission Indexes
        await db.database.submissions.create_index("candidate_id")
        await db.database.submissions.create_index("talent_manager_id")
        
        logger.info("All database indexes created successfully")
        
    except Exception as e:
        # Log but don't crash if indexes exist
        if "already exists" in str(e).lower():
            logger.debug("Indexes already exist")
        else:
            logger.error(f"Error creating indexes: {str(e)}", exc_info=True)

async def init_db():
    """Initialize database connection"""
    logger.info("Initializing database connection...")
    
    try:
        # Step 1: Load Config
        mongodb_url = settings.MONGODB_URL
        masked_url = mongodb_url.split('@')[-1] if '@' in mongodb_url else '***'
        logger.info(f"Connecting to MongoDB at: ...@{masked_url}")
        
        # Step 2: Create Client
        db.client = AsyncIOMotorClient(
            mongodb_url,
            serverSelectionTimeoutMS=5000
        )
        
        # Step 3: Test Connection
        await db.client.admin.command('ping')
        logger.info("MongoDB connection test successful")
        
        # Step 4: Set Database
        # We use the 'recruitops' database name now
        db.database = db.client.recruitops
        logger.info("Database instance obtained: recruitops")
        
        # Step 5: Indexes
        await create_indexes()
        
    except Exception as e:
        logger.critical(f"Database initialization failed: {str(e)}", exc_info=True)
        raise

async def close_db():
    """Close database connection"""
    logger.info("Closing database connection")
    if db.client:
        db.client.close()
        db.client = None
        db.database = None
        logger.info("Database connection closed")