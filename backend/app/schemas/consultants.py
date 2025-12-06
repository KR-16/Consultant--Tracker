from pymongo.errors import PyMongoError
import logging
from app.schemas.base import CollectionSchema

logger = logging.getLogger(__name__)


class ConsultantsSchema(CollectionSchema):
    """
    Schema definition for the consultants collection.
    
    Defines indexes for:
    - user_id: Unique index for fast lookups by user ID (one-to-one relationship with users)
    """
    
    @staticmethod
    def get_collection_name() -> str:
        """Return the MongoDB collection name for consultants"""
        return "consultants"
    
    @staticmethod
    async def create_indexes(db) -> None:
        """
        Create indexes for the consultants collection.
        
        Indexes:
        - user_id: Unique index for fast lookups by user ID
        """
        collection_name = ConsultantsSchema.get_collection_name()
        logger.info(f"Creating indexes for collection: {collection_name}")
        
        try:
            # Create user_id index (unique) - one consultant profile per user
            logger.debug(f"Creating user_id index (unique) for {collection_name}")
            try:
                result = await db.consultants.create_index("user_id", unique=True)
                logger.info(f"User_id index created successfully for {collection_name}: {result}")
            except PyMongoError as e:
                # Index might already exist - check error
                if "already exists" in str(e).lower() or "duplicate" in str(e).lower():
                    logger.debug(f"User_id index already exists for {collection_name} - skipping")
                else:
                    logger.error(f"Error creating user_id index for {collection_name}: {str(e)}", exc_info=True)
                    raise
            except Exception as e:
                logger.error(f"Unexpected error creating user_id index for {collection_name}: {str(e)}", exc_info=True)
                raise
            
            logger.info(f"All indexes created successfully for {collection_name}")
            
        except Exception as e:
            logger.error(f"Error creating indexes for {collection_name}: {str(e)}", exc_info=True)
            raise

