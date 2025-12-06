from pymongo.errors import PyMongoError
import logging
from app.schemas.base import CollectionSchema

logger = logging.getLogger(__name__)


class UsersSchema(CollectionSchema):
    """
    Schema definition for the users collection.
    
    Defines indexes for:
    - email (unique) - for fast lookups and uniqueness constraint
    - role - for filtering users by role
    - is_active - for filtering active/inactive users
    """
    
    @staticmethod
    def get_collection_name() -> str:
        """Return the MongoDB collection name for users"""
        return "users"
    
    @staticmethod
    async def create_indexes(db) -> None:
        """
        Create indexes for the users collection.
        
        Indexes:
        - email: Unique index for email lookups and uniqueness constraint
        - role: Index for filtering by user role
        - is_active: Index for filtering active/inactive users
        """
        collection_name = UsersSchema.get_collection_name()
        logger.info(f"Creating indexes for collection: {collection_name}")
        
        try:
            # Create email index (unique)
            logger.debug(f"Creating email index (unique) for {collection_name}")
            try:
                result = await db.users.create_index("email", unique=True)
                logger.info(f"Email index created successfully for {collection_name}: {result}")
            except PyMongoError as e:
                # Index might already exist - check error
                if "already exists" in str(e).lower() or "duplicate" in str(e).lower():
                    logger.debug(f"Email index already exists for {collection_name} - skipping")
                else:
                    logger.error(f"Error creating email index for {collection_name}: {str(e)}", exc_info=True)
                    raise
            except Exception as e:
                logger.error(f"Unexpected error creating email index for {collection_name}: {str(e)}", exc_info=True)
                raise
            
            # Create role index
            logger.debug(f"Creating role index for {collection_name}")
            try:
                result = await db.users.create_index("role")
                logger.info(f"Role index created successfully for {collection_name}: {result}")
            except PyMongoError as e:
                if "already exists" in str(e).lower() or "duplicate" in str(e).lower():
                    logger.debug(f"Role index already exists for {collection_name} - skipping")
                else:
                    logger.error(f"Error creating role index for {collection_name}: {str(e)}", exc_info=True)
                    raise
            except Exception as e:
                logger.error(f"Unexpected error creating role index for {collection_name}: {str(e)}", exc_info=True)
                raise
            
            # Create is_active index
            logger.debug(f"Creating is_active index for {collection_name}")
            try:
                result = await db.users.create_index("is_active")
                logger.info(f"Is_active index created successfully for {collection_name}: {result}")
            except PyMongoError as e:
                if "already exists" in str(e).lower() or "duplicate" in str(e).lower():
                    logger.debug(f"Is_active index already exists for {collection_name} - skipping")
                else:
                    logger.error(f"Error creating is_active index for {collection_name}: {str(e)}", exc_info=True)
                    raise
            except Exception as e:
                logger.error(f"Unexpected error creating is_active index for {collection_name}: {str(e)}", exc_info=True)
                raise
            
            logger.info(f"All indexes created successfully for {collection_name}")
            
        except Exception as e:
            logger.error(f"Error creating indexes for {collection_name}: {str(e)}", exc_info=True)
            raise

