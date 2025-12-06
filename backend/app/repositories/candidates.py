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
        profile_data = await db.candidate_profiles.find_one({"user_id": user_id})
        
        if profile_data:
            profile_data["id"] = str(profile_data["_id"])
            # Fetch user details to merge (name, email)
            user_data = await db.users.find_one({"_id": ObjectId(user_id)})
            if user_data:
                profile_data["name"] = user_data.get("name")
                profile_data["email"] = user_data.get("email")
            return CandidateProfile(**profile_data)
        return None

    async def get_all_profiles(self, skip: int = 0, limit: int = 100) -> List[CandidateProfile]:
        db = await get_database()
        cursor = db.candidate_profiles.find().skip(skip).limit(limit)
        profiles = []
        
        async for p_data in cursor:
            p_data["id"] = str(p_data["_id"])
            # Fetch user details
            user_data = await db.users.find_one({"_id": ObjectId(p_data["user_id"])})
            if user_data:
                p_data["name"] = user_data.get("name")
                p_data["email"] = user_data.get("email")
            profiles.append(CandidateProfile(**p_data))
            
        return profiles