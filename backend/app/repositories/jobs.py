from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from bson.errors import InvalidId
from pymongo.errors import PyMongoError
import logging
from app.models import JobDescription, JobDescriptionCreate, JobDescriptionUpdate
from app.db import get_database

logger = logging.getLogger(__name__)

class JobRepository:
    def __init__(self):
        self.collection_name = "job_descriptions"
        logger.debug(f"JobRepository initialized")

    async def _merge_recruiter_data(self, jd_doc, db):
        """Helper to fetch and merge recruiter details into job description"""
        try:
            recruiter_id = jd_doc.get("recruiter_id")
            if not recruiter_id:
                logger.warning(f"Job {jd_doc.get('_id')} has no recruiter_id")
                jd_doc["recruiter_name"] = "Unknown Recruiter"
                jd_doc["recruiter_email"] = "N/A"
                return jd_doc

            try:
                oid = ObjectId(recruiter_id)
            except (InvalidId, TypeError):
                logger.error(f"Invalid recruiter_id format: {recruiter_id}")
                jd_doc["recruiter_name"] = "Invalid ID"
                jd_doc["recruiter_email"] = "N/A"
                return jd_doc

            # Look up recruiter in recruiters collection (not users)
            user_data = await db.recruiters.find_one({"_id": oid})

            if user_data:
                jd_doc["recruiter_name"] = user_data.get("name", "Unknown")
                jd_doc["recruiter_email"] = user_data.get("email", "")
            else:
                logger.warning(f"Recruiter not found for recruiter_id: {recruiter_id}")
                jd_doc["recruiter_name"] = "Unknown Recruiter"
                jd_doc["recruiter_email"] = "N/A"

        except Exception as e:
            logger.error(f"Error merging recruiter data: {e}")
            jd_doc["recruiter_name"] = "Error Loading Recruiter"
            jd_doc["recruiter_email"] = "N/A"

        return jd_doc

    async def create(self, jd_data: JobDescriptionCreate, recruiter_id: str) -> JobDescription:
        """Create a new job description"""
        logger.info(f"Creating new JD: {jd_data.title}")
        try:
            db = await get_database()
            if db is None:
                raise ValueError("Database connection not available")
            
            jd_doc = jd_data.dict()
            jd_doc["recruiter_id"] = recruiter_id
            jd_doc["created_at"] = datetime.utcnow()
            jd_doc["updated_at"] = datetime.utcnow()
            
            result = await db.job_descriptions.insert_one(jd_doc)
            jd_doc["id"] = str(result.inserted_id)
            
            return JobDescription(**jd_doc)
        except Exception as e:
            logger.error(f"Error creating JD: {str(e)}", exc_info=True)
            raise

    async def get_all(self, skip: int = 0, limit: int = 100, status: Optional[str] = None) -> List[JobDescription]:
        """Get all JDs with recruiter information"""
        logger.debug(f"Getting all JDs")
        try:
            db = await get_database()
            if db is None:
                raise ValueError("Database connection not available")
            
            query = {}
            if status:
                query["status"] = status
                
            cursor = db.job_descriptions.find(query).skip(skip).limit(limit)
            jds = []
            
            async for doc in cursor:
                doc["id"] = str(doc["_id"])
                doc = await self._merge_recruiter_data(doc, db)
                jds.append(JobDescription(**doc))
                
            return jds
        except Exception as e:
            logger.error(f"Error getting all JDs: {str(e)}", exc_info=True)
            raise

    async def get_by_id(self, jd_id: str) -> Optional[JobDescription]:
        """Get JD by ID"""
        logger.debug(f"Getting JD by ID: {jd_id}")
        try:
            db = await get_database()
            if db is None:
                raise ValueError("Database connection not available")
            
            doc = await db.job_descriptions.find_one({"_id": ObjectId(jd_id)})
            if doc:
                doc["id"] = str(doc["_id"])
                return JobDescription(**doc)
            return None
        except InvalidId:
            return None
        except Exception as e:
            logger.error(f"Error getting JD by ID: {str(e)}", exc_info=True)
            raise

    async def update(self, jd_id: str, jd_data: JobDescriptionUpdate, recruiter_id: str) -> Optional[JobDescription]:
        """Update JD"""
        logger.info(f"Updating JD: {jd_id}")
        try:
            db = await get_database()
            if db is None:
                raise ValueError("Database connection not available")
            
            # Verify ownership
            existing = await db.job_descriptions.find_one({"_id": ObjectId(jd_id)})
            if not existing:
                return None
            if existing["recruiter_id"] != recruiter_id:
                raise ValueError("Unauthorized: You can only edit your own JDs")
            
            update_data = {k: v for k, v in jd_data.dict().items() if v is not None}
            if not update_data:
                return await self.get_by_id(jd_id)
                
            update_data["updated_at"] = datetime.utcnow()
            
            await db.job_descriptions.update_one(
                {"_id": ObjectId(jd_id)},
                {"$set": update_data}
            )
            
            return await self.get_by_id(jd_id)
        except Exception as e:
            logger.error(f"Error updating JD: {str(e)}", exc_info=True)
            raise
