from typing import List
from datetime import datetime
from bson import ObjectId
from app.db import get_database
from app.models import Submission, SubmissionCreate, SubmissionUpdate

class SubmissionRepository:
    async def create(self, submission: SubmissionCreate, candidate_id: str, manager_id: str) -> Submission:
        db = await get_database()
        sub_dict = submission.dict()
        sub_dict["candidate_id"] = candidate_id
        sub_dict["talent_manager_id"] = manager_id
        sub_dict["status"] = "SUBMITTED"
        sub_dict["created_at"] = datetime.utcnow()
        sub_dict["updated_at"] = datetime.utcnow()
        
        result = await db.submissions.insert_one(sub_dict)
        
        return await self.get_by_id(str(result.inserted_id))

    async def get_by_id(self, id: str):
        db = await get_database()
        data = await db.submissions.find_one({"_id": ObjectId(id)})
        if data:
            data["id"] = str(data["_id"])
            return Submission(**data)
        return None

    async def get_all(self) -> List[Submission]:
        db = await get_database()
        cursor = db.submissions.find()
        subs = []
        async for sub in cursor:
            sub["id"] = str(sub["_id"])
            
            # Enrich with Candidate Name
            cand = await db.users.find_one({"_id": ObjectId(sub["candidate_id"])})
            if cand:
                sub["candidate_name"] = cand.get("name")
                
            # Enrich with Job Title
            if "job_id" in sub:
                job = await db.jobs.find_one({"_id": ObjectId(sub["job_id"])})
                if job:
                    sub["jd_title"] = job.get("title")
            
            subs.append(Submission(**sub))
        return subs