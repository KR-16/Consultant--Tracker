from typing import List, Optional
from bson import ObjectId
from app.db import get_database
from app.models import CandidateProfile, CandidateProfileCreate, CandidateProfileUpdate

class CandidateRepository:
    async def create_profile(self, profile: CandidateProfileCreate, user_id: str) -> CandidateProfile:
        db = await get_database()
        profile_dict = profile.dict()
        profile_dict["user_id"] = user_id
        
        result = await db.candidate_profiles.insert_one(profile_dict)
        
        return await self.get_profile_by_user_id(user_id)

    async def get_profile_by_user_id(self, user_id: str) -> Optional[CandidateProfile]:
        db = await get_database()
        query = {}
        if manager_id:
            query["assigned_manager_id"] = manager_id
            
        cursor = db.candidate_profiles.find(query).skip(skip).limit(limit)
        profiles = []
        
        async for p_data in cursor:
            p_data["id"] = str(p_data["_id"])
            user_data = await db.users.find_one({"_id": ObjectId(p_data["user_id"])})
            if user_data:
                p_data["name"] = user_data.get("name")
                p_data["email"] = user_data.get("email")
                
            profiles.append(CandidateProfile(**p_data))
            
        return profiles