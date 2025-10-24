from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from app.models import JobDescription, JobDescriptionCreate, JobDescriptionUpdate, JobStatus
from app.db import get_database

class JobDescriptionRepository:
    def __init__(self):
        self.collection_name = "job_descriptions"

    async def create(self, job_data: JobDescriptionCreate) -> JobDescription:
        """Create a new job description"""
        db = await get_database()
        
        job_doc = {
            **job_data.dict(),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = await db.job_descriptions.insert_one(job_doc)
        job_doc["id"] = str(result.inserted_id)
        
        return JobDescription(**job_doc)

    async def get_by_id(self, job_id: str) -> Optional[JobDescription]:
        """Get job description by ID"""
        db = await get_database()
        job_data = await db.job_descriptions.find_one({"_id": ObjectId(job_id)})
        if job_data:
            job_data["id"] = str(job_data["_id"])
            return JobDescription(**job_data)
        return None

    async def get_all(self, skip: int = 0, limit: int = 100, recruiter_id: Optional[str] = None, status: Optional[JobStatus] = None) -> List[JobDescription]:
        """Get all job descriptions with optional filters"""
        db = await get_database()
        
        query = {}
        if recruiter_id:
            query["recruiter_id"] = recruiter_id
        if status:
            query["status"] = status
        
        cursor = db.job_descriptions.find(query).sort("created_at", -1).skip(skip).limit(limit)
        jobs = []
        
        async for job_data in cursor:
            job_data["id"] = str(job_data["_id"])
            jobs.append(JobDescription(**job_data))
        
        return jobs

    async def get_open_jobs(self, skip: int = 0, limit: int = 100) -> List[JobDescription]:
        """Get all open job descriptions"""
        return await self.get_all(skip=skip, limit=limit, status=JobStatus.OPEN)

    async def update(self, job_id: str, job_data: JobDescriptionUpdate) -> Optional[JobDescription]:
        """Update job description"""
        db = await get_database()
        
        update_data = {k: v for k, v in job_data.dict().items() if v is not None}
        if update_data:
            update_data["updated_at"] = datetime.utcnow()
            
            result = await db.job_descriptions.update_one(
                {"_id": ObjectId(job_id)},
                {"$set": update_data}
            )
            
            if result.modified_count:
                return await self.get_by_id(job_id)
        
        return None

    async def delete(self, job_id: str) -> bool:
        """Delete job description"""
        db = await get_database()
        result = await db.job_descriptions.delete_one({"_id": ObjectId(job_id)})
        return result.deleted_count > 0

    async def close_job(self, job_id: str) -> bool:
        """Close a job (set status to CLOSED)"""
        db = await get_database()
        result = await db.job_descriptions.update_one(
            {"_id": ObjectId(job_id)},
            {"$set": {"status": JobStatus.CLOSED, "updated_at": datetime.utcnow()}}
        )
        return result.modified_count > 0

    async def fill_job(self, job_id: str) -> bool:
        """Mark job as filled"""
        db = await get_database()
        result = await db.job_descriptions.update_one(
            {"_id": ObjectId(job_id)},
            {"$set": {"status": JobStatus.FILLED, "updated_at": datetime.utcnow()}}
        )
        return result.modified_count > 0

    async def search_jobs(self, query: str, skip: int = 0, limit: int = 100) -> List[JobDescription]:
        """Search jobs by title, company, or description"""
        db = await get_database()
        
        search_query = {
            "$or": [
                {"title": {"$regex": query, "$options": "i"}},
                {"company": {"$regex": query, "$options": "i"}},
                {"description": {"$regex": query, "$options": "i"}},
                {"tech_stack": {"$in": [query]}}
            ],
            "status": JobStatus.OPEN
        }
        
        cursor = db.job_descriptions.find(search_query).sort("created_at", -1).skip(skip).limit(limit)
        jobs = []
        
        async for job_data in cursor:
            job_data["id"] = str(job_data["_id"])
            jobs.append(JobDescription(**job_data))
        
        return jobs

    async def get_jobs_by_tech_stack(self, tech_stack: List[str], skip: int = 0, limit: int = 100) -> List[JobDescription]:
        """Get jobs matching specific tech stack"""
        db = await get_database()
        
        query = {
            "tech_stack": {"$in": tech_stack},
            "status": JobStatus.OPEN
        }
        
        cursor = db.job_descriptions.find(query).sort("created_at", -1).skip(skip).limit(limit)
        jobs = []
        
        async for job_data in cursor:
            job_data["id"] = str(job_data["_id"])
            jobs.append(JobDescription(**job_data))
        
        return jobs

    async def count(self, recruiter_id: Optional[str] = None, status: Optional[JobStatus] = None) -> int:
        """Count job descriptions"""
        db = await get_database()
        
        query = {}
        if recruiter_id:
            query["recruiter_id"] = recruiter_id
        if status:
            query["status"] = status
            
        return await db.job_descriptions.count_documents(query)
