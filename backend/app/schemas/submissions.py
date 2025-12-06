from pymongo.errors import PyMongoError
import logging
from app.schemas.base import CollectionSchema

logger = logging.getLogger(__name__)


class SubmissionsSchema(CollectionSchema):
    """
    Schema definition for the submissions collection.
    
    Defines indexes for:
    - consultant_id: Index for filtering submissions by consultant
    - recruiter_id: Index for filtering submissions by recruiter
    - jd_id: Index for filtering submissions by job description
    - status: Index for filtering submissions by status
    - Compound indexes for common query patterns
    """
    
    @staticmethod
    def get_collection_name() -> str:
        """Return the MongoDB collection name for submissions"""
        return "submissions"
    
    @staticmethod
    async def create_indexes(db) -> None:
        """
        Create indexes for the submissions collection.
        
        Indexes:
        - consultant_id: Index for filtering submissions by consultant
        - recruiter_id: Index for filtering submissions by recruiter
        - jd_id: Index for filtering submissions by job description
        - status: Index for filtering submissions by status
        - (consultant_id, jd_id): Compound index to prevent duplicate submissions and fast lookups
        - (recruiter_id, status): Compound index for recruiter dashboard queries
        """
        collection_name = SubmissionsSchema.get_collection_name()
        logger.info(f"Creating indexes for collection: {collection_name}")
        
        try:
            # Create consultant_id index
            logger.debug(f"Creating consultant_id index for {collection_name}")
            try:
                result = await db.submissions.create_index("consultant_id")
                logger.info(f"Consultant_id index created successfully for {collection_name}: {result}")
            except PyMongoError as e:
                if "already exists" in str(e).lower() or "duplicate" in str(e).lower():
                    logger.debug(f"Consultant_id index already exists for {collection_name} - skipping")
                else:
                    logger.error(f"Error creating consultant_id index for {collection_name}: {str(e)}", exc_info=True)
                    raise
            except Exception as e:
                logger.error(f"Unexpected error creating consultant_id index for {collection_name}: {str(e)}", exc_info=True)
                raise
            
            # Create recruiter_id index
            logger.debug(f"Creating recruiter_id index for {collection_name}")
            try:
                result = await db.submissions.create_index("recruiter_id")
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
            
            # Create jd_id index
            logger.debug(f"Creating jd_id index for {collection_name}")
            try:
                result = await db.submissions.create_index("jd_id")
                logger.info(f"Jd_id index created successfully for {collection_name}: {result}")
            except PyMongoError as e:
                if "already exists" in str(e).lower() or "duplicate" in str(e).lower():
                    logger.debug(f"Jd_id index already exists for {collection_name} - skipping")
                else:
                    logger.error(f"Error creating jd_id index for {collection_name}: {str(e)}", exc_info=True)
                    raise
            except Exception as e:
                logger.error(f"Unexpected error creating jd_id index for {collection_name}: {str(e)}", exc_info=True)
                raise
            
            # Create status index
            logger.debug(f"Creating status index for {collection_name}")
            try:
                result = await db.submissions.create_index("status")
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
            
            # Create compound index on (consultant_id, jd_id) for efficient lookups and duplicate prevention
            logger.debug(f"Creating compound index (consultant_id, jd_id) for {collection_name}")
            try:
                result = await db.submissions.create_index([("consultant_id", 1), ("jd_id", 1)])
                logger.info(f"Compound index (consultant_id, jd_id) created successfully for {collection_name}: {result}")
            except PyMongoError as e:
                if "already exists" in str(e).lower() or "duplicate" in str(e).lower():
                    logger.debug(f"Compound index (consultant_id, jd_id) already exists for {collection_name} - skipping")
                else:
                    logger.error(f"Error creating compound index for {collection_name}: {str(e)}", exc_info=True)
                    raise
            except Exception as e:
                logger.error(f"Unexpected error creating compound index for {collection_name}: {str(e)}", exc_info=True)
                raise
            
            # Create compound index on (recruiter_id, status) for recruiter dashboard queries
            logger.debug(f"Creating compound index (recruiter_id, status) for {collection_name}")
            try:
                result = await db.submissions.create_index([("recruiter_id", 1), ("status", 1)])
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

