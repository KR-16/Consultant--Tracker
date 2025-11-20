from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from bson.errors import InvalidId
from pymongo.errors import PyMongoError
import logging
from app.models import ConsultantProfile, ConsultantProfileCreate, ConsultantProfileUpdate, User
from app.db import get_database

logger = logging.getLogger(__name__)

class ConsultantRepository:
    def __init__(self):
        self.collection_name = "consultants"
        logger.debug(f"ConsultantRepository initialized")

    async def get_by_user_id(self, user_id: str) -> Optional[ConsultantProfile]:
        """Get consultant profile by user ID"""
        logger.debug(f"Getting consultant profile for user ID: {user_id}")
        try:
            db = await get_database()
            if db is None:
                raise ValueError("Database connection not available")
                
            profile_data = await db.consultants.find_one({"user_id": user_id})
            if profile_data:
                profile_data["id"] = str(profile_data["_id"])
                # Fetch user details to merge
                user_data = await db.users.find_one({"_id": ObjectId(user_id)})
                if user_data:
                    profile_data["email"] = user_data.get("email")
                    profile_data["name"] = user_data.get("name")
                    profile_data["phone"] = user_data.get("phone")
                
                return ConsultantProfile(**profile_data)
            return None
        except Exception as e:
            logger.error(f"Error getting consultant profile: {str(e)}", exc_info=True)
            raise

    async def create_or_update(self, user_id: str, profile_data: ConsultantProfileUpdate) -> ConsultantProfile:
        """Create or update consultant profile"""
        logger.info(f"Updating consultant profile for user ID: {user_id}")
        try:
            db = await get_database()
            if db is None:
                raise ValueError("Database connection not available")
            
            update_data = {k: v for k, v in profile_data.dict().items() if v is not None}
            update_data["updated_at"] = datetime.utcnow()
            
            # Upsert profile
            result = await db.consultants.update_one(
                {"user_id": user_id},
                {"$set": update_data, "$setOnInsert": {"created_at": datetime.utcnow(), "user_id": user_id}},
                upsert=True
            )
            
            return await self.get_by_user_id(user_id)
        except Exception as e:
            logger.error(f"Error updating consultant profile: {str(e)}", exc_info=True)
            raise

    async def get_all(self, skip: int = 0, limit: int = 100) -> List[ConsultantProfile]:
        """Get all consultants (for recruiters)"""
        logger.debug(f"Getting all consultants")
        try:
            db = await get_database()
            if db is None:
                raise ValueError("Database connection not available")
            
            cursor = db.consultants.find().skip(skip).limit(limit)
            profiles = []
            
            async for doc in cursor:
                doc["id"] = str(doc["_id"])
                # Fetch user details
                if "user_id" in doc:
                    user_data = await db.users.find_one({"_id": ObjectId(doc["user_id"])})
                    if user_data:
                        doc["email"] = user_data.get("email")
                        doc["name"] = user_data.get("name")
                        doc["phone"] = user_data.get("phone")
                    profiles.append(ConsultantProfile(**doc))
                else:
                    logger.warning(f"Consultant profile missing user_id: {doc.get('_id')}")
                
            return profiles
        except Exception as e:
            logger.error(f"Error getting all consultants: {str(e)}", exc_info=True)
            raise
