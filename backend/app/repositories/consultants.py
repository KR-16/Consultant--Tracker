from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from bson.errors import InvalidId
import logging
from app.models import ConsultantProfile, ConsultantProfileUpdate
from app.db import get_database

logger = logging.getLogger(__name__)

class ConsultantRepository:
    def __init__(self):
        self.collection_name = "consultants"
        logger.debug(f"ConsultantRepository initialized")

    async def _merge_user_data(self, profile_doc, db):
        """Helper to fetch and merge user details into profile, handling data integrity"""
        try:
            if "tech_stack" not in profile_doc or profile_doc["tech_stack"] is None:
                profile_doc["tech_stack"] = []
            if "experience_years" not in profile_doc or profile_doc["experience_years"] is None:
                profile_doc["experience_years"] = 0.0

            user_id = profile_doc.get("user_id")
            if not user_id:
                logger.warning(f"Profile {profile_doc.get('_id')} has no user_id")
                profile_doc["name"] = "Unknown User"
                profile_doc["email"] = "N/A"
                return profile_doc

            try:
                oid = ObjectId(user_id)
            except (InvalidId, TypeError):
                logger.error(f"Invalid user_id format: {user_id}")
                profile_doc["name"] = "Invalid ID"
                return profile_doc

            user_data = await db.users.find_one({"_id": oid})

            if user_data:
                profile_doc["email"] = user_data.get("email", "")
                profile_doc["name"] = user_data.get("name", "Unknown")
                profile_doc["phone"] = user_data.get("phone", "")
            else:
                logger.warning(f"User not found for profile: {user_id}")
                profile_doc["name"] = "Unknown User"
                profile_doc["email"] = "N/A"

        except Exception as e:
            logger.error(f"Error merging user data: {e}")
            profile_doc["name"] = "Error Loading User"

        return profile_doc

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
                profile_data = await self._merge_user_data(profile_data, db)
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

            update_data.pop("email", None)

            update_data["updated_at"] = datetime.utcnow()

            defaults = {
                "created_at": datetime.utcnow(),
                "user_id": user_id,
                "tech_stack": [],
                "experience_years": 0.0
            }

            if "experience_years" in update_data:
                defaults.pop("experience_years", None)
            
            if "tech_stack" in update_data:
                defaults.pop("tech_stack", None)

            await db.consultants.update_one(
                {"user_id": user_id},
                {
                    "$set": update_data,
                    "$setOnInsert": defaults
                },
                upsert=True
            )

            return await self.get_by_user_id(user_id)
        except Exception as e:
            logger.error(f"Error updating consultant profile: {str(e)}", exc_info=True)
            raise

    async def get_all(self, skip: int = 0, limit: int = 100, user_ids: Optional[List[str]] = None) -> List[ConsultantProfile]:
        """Get all consultants (optionally filtered by specific user_ids)"""
        logger.debug(f"Getting consultants. Filter by IDs: {user_ids is not None}")
        try:
            db = await get_database()
            if db is None:
                raise ValueError("Database connection not available")
            
            query = {}
            if user_ids is not None:
                query["user_id"] = {"$in": user_ids}
            
            cursor = db.consultants.find(query).skip(skip).limit(limit)
            profiles = []
            
            async for doc in cursor:
                doc["id"] = str(doc["_id"])
                doc = await self._merge_user_data(doc, db)
                profiles.append(ConsultantProfile(**doc))
                
            return profiles
        except Exception as e:
            logger.error(f"Error getting consultants: {str(e)}", exc_info=True)
            raise