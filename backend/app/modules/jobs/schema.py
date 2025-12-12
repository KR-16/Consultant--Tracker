"""
Jobs Module Schema
"""

from pymongo.errors import PyMongoError
import logging
from app.core.schemas import CollectionSchema

logger = logging.getLogger(__name__)

class JobsSchema(CollectionSchema):
    @staticmethod
    def get_collection_name() -> str:
        return "job_descriptions"
    
    @staticmethod
    async def create_indexes(db) -> None:
        collection_name = JobsSchema.get_collection_name()
        logger.info(f"Creating indexes for collection: {collection_name}")
        
        try:
            await db.job_descriptions.create_index("recruiter_id")
            await db.job_descriptions.create_index("status")
            logger.info(f"All indexes created successfully for {collection_name}")
        except Exception as e:
            logger.error(f"Error creating indexes for {collection_name}: {str(e)}", exc_info=True)
            raise

