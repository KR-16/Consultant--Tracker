from pymongo.errors import PyMongoError
import logging
from app.schemas.base import CollectionSchema

logger = logging.getLogger(__name__)


class JobsSchema(CollectionSchema):
    """
    Schema definition for the job_descriptions collection.
    
    Defines indexes for:
    - recruiter_id: Index for filtering jobs by recruiter
    - status: Index for filtering jobs by status (OPEN, CLOSED)
    - Compound index on (recruiter_id, status) for efficient queries
    """
    
    @staticmethod
    def get_collection_name() -> str:
        """Return the MongoDB collection name for job descriptions"""
        return "job_descriptions"
    
    @staticmethod
    async def create_indexes(db) -> None:
        """
        Create indexes for the job_descriptions collection.
        
        Indexes:
        - recruiter_id: Index for filtering jobs by recruiter
        - status: Index for filtering jobs by status
        - (recruiter_id, status): Compound index for efficient filtered queries
        """
        collection_name = JobsSchema.get_collection_name()
        logger.info(f"Creating indexes for collection: {collection_name}")
        
        try:
            # Create recruiter_id index
            logger.debug(f"Creating recruiter_id index for {collection_name}")
            try:
                result = await db.job_descriptions.create_index("recruiter_id")
                logger.info(f"Recruiter_id index created successfully for {collection_name}: {result}")
            except PyMongoError as e:
                if "already exists" in str(e).lower() or "duplicate" in str(e).lower():
                    logger.debug(f"Recruiter_id index already exists for {collection_name} - skipping")
                else:
                    logger.error(f"Error creating recruiter_id index for {collection_name}: {str(e)}", exc_info=True)
                    raise
            except Exception as e:
                logger.error(f"Unexpected error creating recruiter_id index for {collection_name}: {str(e)}", exc_info=True)
                raise
            
            # Create status index
            logger.debug(f"Creating status index for {collection_name}")
            try:
                result = await db.job_descriptions.create_index("status")
                logger.info(f"Status index created successfully for {collection_name}: {result}")
            except PyMongoError as e:
                if "already exists" in str(e).lower() or "duplicate" in str(e).lower():
                    logger.debug(f"Status index already exists for {collection_name} - skipping")
                else:
                    logger.error(f"Error creating status index for {collection_name}: {str(e)}", exc_info=True)
                    raise
            except Exception as e:
                logger.error(f"Unexpected error creating status index for {collection_name}: {str(e)}", exc_info=True)
                raise
            
            # Create compound index on (recruiter_id, status) for efficient queries
            logger.debug(f"Creating compound index (recruiter_id, status) for {collection_name}")
            try:
                result = await db.job_descriptions.create_index([("recruiter_id", 1), ("status", 1)])
                logger.info(f"Compound index (recruiter_id, status) created successfully for {collection_name}: {result}")
            except PyMongoError as e:
                if "already exists" in str(e).lower() or "duplicate" in str(e).lower():
                    logger.debug(f"Compound index (recruiter_id, status) already exists for {collection_name} - skipping")
                else:
                    logger.error(f"Error creating compound index for {collection_name}: {str(e)}", exc_info=True)
                    raise
            except Exception as e:
                logger.error(f"Unexpected error creating compound index for {collection_name}: {str(e)}", exc_info=True)
                raise
            
            logger.info(f"All indexes created successfully for {collection_name}")
            
        except Exception as e:
            logger.error(f"Error creating indexes for {collection_name}: {str(e)}", exc_info=True)
            raise

