import motor.motor_asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import PyMongoError, ConnectionFailure, ServerSelectionTimeoutError
import os
import logging
from typing import Optional

# Set up logger
logger = logging.getLogger(__name__)

class Database:
    client: Optional[AsyncIOMotorClient] = None
    database = None
    
    def __init__(self):
        logger.debug("Database class instance created")
    
    def __repr__(self):
        client_status = "connected" if self.client else "not connected"
        database_status = "set" if self.database else "not set"
        return f"Database(client={client_status}, database={database_status})"

db = Database()
logger.debug("Global database instance created")

async def get_database():
    """Get the database instance"""
    logger.debug("Getting database instance")
    
    try:
        if db.database is None:
            logger.warning("Database instance is None - database may not be initialized")
            raise ValueError("Database not initialized. Call init_db() first.")
        
        logger.debug("Database instance retrieved successfully")
        return db.database
        
    except ValueError as e:
        logger.error(f"Database not available: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error getting database: {str(e)}", exc_info=True)
        raise ValueError(f"Failed to get database: {str(e)}")

async def init_db():
    """Initialize database connection"""
    logger.info("Initializing database connection")
    
    try:
        # Step 1: Get MongoDB URL from environment
        logger.debug("Step 1: Getting MongoDB URL from environment")
        mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
        logger.info(f"MongoDB URL: {mongodb_url.replace('://', '://***') if '://' in mongodb_url else '***'}")  # Mask password in URL
        
        # Step 2: Create MongoDB client
        logger.debug("Step 2: Creating MongoDB client")
        try:
            db.client = AsyncIOMotorClient(mongodb_url)
            logger.debug("MongoDB client created successfully")
        except Exception as e:
            logger.error(f"Error creating MongoDB client: {str(e)}", exc_info=True)
            raise ConnectionFailure(f"Failed to create MongoDB client: {str(e)}")
        
        # Step 3: Test connection
        logger.debug("Step 3: Testing MongoDB connection")
        try:
            # Ping the server to verify connection
            await db.client.admin.command('ping')
            logger.info("MongoDB connection test successful")
        except ServerSelectionTimeoutError as e:
            logger.error(f"MongoDB server selection timeout: {str(e)}", exc_info=True)
            raise ConnectionFailure(f"Cannot connect to MongoDB server: {str(e)}")
        except ConnectionFailure as e:
            logger.error(f"MongoDB connection failure: {str(e)}", exc_info=True)
            raise
        except Exception as e:
            logger.error(f"Error testing MongoDB connection: {str(e)}", exc_info=True)
            raise ConnectionFailure(f"Failed to connect to MongoDB: {str(e)}")
        
        # Step 4: Get database instance
        logger.debug("Step 4: Getting database instance")
        try:
            db.database = db.client.consultant_tracker
            logger.info(f"Database instance obtained: consultant_tracker")
        except Exception as e:
            logger.error(f"Error getting database instance: {str(e)}", exc_info=True)
            raise ValueError(f"Failed to get database instance: {str(e)}")
        
        # Step 5: Create indexes
        logger.debug("Step 5: Creating database indexes")
        try:
            await create_indexes()
            logger.info("Database indexes created successfully")
        except Exception as e:
            logger.error(f"Error creating indexes: {str(e)}", exc_info=True)
            # Don't fail initialization if indexes fail - log and continue
            logger.warning("Database initialized but index creation failed - continuing anyway")
        
        logger.info("Database initialization completed successfully")
        
    except ConnectionFailure as e:
        logger.error(f"Database connection failure during initialization: {str(e)}", exc_info=True)
        raise
    except ValueError as e:
        logger.error(f"Database initialization validation error: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error during database initialization: {str(e)}", exc_info=True)
        raise ConnectionFailure(f"Database initialization failed: {str(e)}")

async def create_indexes():
    """Create database indexes for users"""
    logger.info("Creating database indexes")
    
    try:
        # Step 1: Verify database is available
        logger.debug("Step 1: Verifying database is available")
        if db.database is None:
            logger.error("Database is None - cannot create indexes")
            raise ValueError("Database not initialized")
        logger.debug("Database verified")
        
        # Step 2: Create email index (unique)
        logger.debug("Step 2: Creating email index (unique)")
        try:
            result = await db.database.users.create_index("email", unique=True)
            logger.info(f"Email index created successfully: {result}")
        except PyMongoError as e:
            # Index might already exist - check error
            if "already exists" in str(e).lower() or "duplicate" in str(e).lower():
                logger.debug("Email index already exists - skipping")
            else:
                logger.error(f"Error creating email index: {str(e)}", exc_info=True)
                raise
        except Exception as e:
            logger.error(f"Unexpected error creating email index: {str(e)}", exc_info=True)
            raise
        
        # Step 3: Create role index
        logger.debug("Step 3: Creating role index")
        try:
            result = await db.database.users.create_index("role")
            logger.info(f"Role index created successfully: {result}")
        except PyMongoError as e:
            if "already exists" in str(e).lower() or "duplicate" in str(e).lower():
                logger.debug("Role index already exists - skipping")
            else:
                logger.error(f"Error creating role index: {str(e)}", exc_info=True)
                raise
        except Exception as e:
            logger.error(f"Unexpected error creating role index: {str(e)}", exc_info=True)
            raise
        
        # Step 4: Create is_active index
        logger.debug("Step 4: Creating is_active index")
        try:
            result = await db.database.users.create_index("is_active")
            logger.info(f"Is_active index created successfully: {result}")
        except PyMongoError as e:
            if "already exists" in str(e).lower() or "duplicate" in str(e).lower():
                logger.debug("Is_active index already exists - skipping")
            else:
                logger.error(f"Error creating is_active index: {str(e)}", exc_info=True)
                raise
        except Exception as e:
            logger.error(f"Unexpected error creating is_active index: {str(e)}", exc_info=True)
            raise
        
        logger.info("All database indexes created successfully")
        
    except ValueError as e:
        logger.error(f"Index creation validation error: {str(e)}")
        raise
    except PyMongoError as e:
        logger.error(f"MongoDB error during index creation: {str(e)}", exc_info=True)
        raise
    except Exception as e:
        logger.error(f"Unexpected error during index creation: {str(e)}", exc_info=True)
        raise ValueError(f"Index creation failed: {str(e)}")

async def close_db():
    """Close database connection"""
    logger.info("Closing database connection")
    
    try:
        # Step 1: Check if client exists
        logger.debug("Step 1: Checking if database client exists")
        if db.client is None:
            logger.warning("Database client is None - nothing to close")
            return
        
        logger.debug("Database client found")
        
        # Step 2: Close the client connection
        logger.debug("Step 2: Closing database client connection")
        try:
            db.client.close()
            logger.info("Database client closed successfully")
        except Exception as e:
            logger.error(f"Error closing database client: {str(e)}", exc_info=True)
            raise
        
        # Step 3: Reset database instance
        logger.debug("Step 3: Resetting database instance")
        db.client = None
        db.database = None
        logger.debug("Database instance reset")
        
        logger.info("Database connection closed successfully")
        
    except Exception as e:
        logger.error(f"Unexpected error closing database: {str(e)}", exc_info=True)
        # Don't raise - try to clean up anyway
        try:
            db.client = None
            db.database = None
            logger.debug("Database instance reset after error")
        except:
            pass
