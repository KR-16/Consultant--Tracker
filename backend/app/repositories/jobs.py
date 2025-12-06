from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from app.db import get_database
from app.models import JobDescription, JobDescriptionCreate, JobDescriptionUpdate

class JobRepository:
    async def create(self, job: JobDescriptionCreate, manager_id: str) -> JobDescription:
        db = await get_database()
        job_dict = job.dict()
        job_dict["talent_manager_id"] = manager_id
        job_dict["created_at"] = datetime.utcnow()
        job_dict["updated_at"] = datetime.utcnow()
        
        result = await db.jobs.insert_one(job_dict)
        created_job = await db.jobs.find_one({"_id": result.inserted_id})
        created_job["id"] = str(created_job["_id"])
        return JobDescription(**created_job)

    async def get_all(self, skip: int = 0, limit: int = 100) -> List[JobDescription]:
        db = await get_database()
        cursor = db.jobs.find().sort("created_at", -1).skip(skip).limit(limit)
        jobs = []
        async for job in cursor:
            job["id"] = str(job["_id"])
            jobs.append(JobDescription(**job))
        return jobs