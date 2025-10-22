from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from app.models import Application, ApplicationCreate, ApplicationUpdate, ApplicationStatus
from app.db import get_database

class ApplicationRepository:
    def __init__(self):
        self.collection_name = "applications"

    async def create(self, application_data: ApplicationCreate) -> Application:
        """Create a new application"""
        db = await get_database()
        
        # Check if consultant already applied for this job
        existing_application = await db.applications.find_one({
            "job_id": application_data.job_id,
            "consultant_id": application_data.consultant_id
        })
        if existing_application:
            raise ValueError("Consultant has already applied for this job")
        
        application_doc = {
            **application_data.dict(),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = await db.applications.insert_one(application_doc)
        application_doc["id"] = str(result.inserted_id)
        
        return Application(**application_doc)

    async def get_by_id(self, application_id: str) -> Optional[Application]:
        """Get application by ID"""
        db = await get_database()
        application_data = await db.applications.find_one({"_id": ObjectId(application_id)})
        if application_data:
            application_data["id"] = str(application_data["_id"])
            return Application(**application_data)
        return None

    async def get_all(self, skip: int = 0, limit: int = 100, job_id: Optional[str] = None, consultant_id: Optional[str] = None, status: Optional[ApplicationStatus] = None) -> List[Application]:
        """Get all applications with optional filters"""
        db = await get_database()
        
        query = {}
        if job_id:
            query["job_id"] = job_id
        if consultant_id:
            query["consultant_id"] = consultant_id
        if status:
            query["status"] = status
        
        cursor = db.applications.find(query).sort("applied_at", -1).skip(skip).limit(limit)
        applications = []
        
        async for application_data in cursor:
            application_data["id"] = str(application_data["_id"])
            applications.append(Application(**application_data))
        
        return applications

    async def get_by_consultant(self, consultant_id: str, skip: int = 0, limit: int = 100) -> List[Application]:
        """Get all applications by a specific consultant"""
        return await self.get_all(skip=skip, limit=limit, consultant_id=consultant_id)

    async def get_by_job(self, job_id: str, skip: int = 0, limit: int = 100) -> List[Application]:
        """Get all applications for a specific job"""
        return await self.get_all(skip=skip, limit=limit, job_id=job_id)

    async def update(self, application_id: str, application_data: ApplicationUpdate) -> Optional[Application]:
        """Update application"""
        db = await get_database()
        
        update_data = {k: v for k, v in application_data.dict().items() if v is not None}
        if update_data:
            update_data["updated_at"] = datetime.utcnow()
            
            result = await db.applications.update_one(
                {"_id": ObjectId(application_id)},
                {"$set": update_data}
            )
            
            if result.modified_count:
                return await self.get_by_id(application_id)
        
        return None

    async def update_status(self, application_id: str, status: ApplicationStatus, updated_by: str) -> Optional[Application]:
        """Update application status"""
        db = await get_database()
        
        result = await db.applications.update_one(
            {"_id": ObjectId(application_id)},
            {"$set": {
                "status": status,
                "updated_at": datetime.utcnow()
            }}
        )
        
        if result.modified_count:
            return await self.get_by_id(application_id)
        
        return None

    async def delete(self, application_id: str) -> bool:
        """Delete application"""
        db = await get_database()
        result = await db.applications.delete_one({"_id": ObjectId(application_id)})
        return result.deleted_count > 0

    async def withdraw_application(self, application_id: str) -> bool:
        """Withdraw an application"""
        db = await get_database()
        result = await db.applications.update_one(
            {"_id": ObjectId(application_id)},
            {"$set": {
                "status": ApplicationStatus.WITHDRAWN,
                "updated_at": datetime.utcnow()
            }}
        )
        return result.modified_count > 0

    async def get_application_stats(self, consultant_id: Optional[str] = None, job_id: Optional[str] = None) -> dict:
        """Get application statistics"""
        db = await get_database()
        
        query = {}
        if consultant_id:
            query["consultant_id"] = consultant_id
        if job_id:
            query["job_id"] = job_id
        
        pipeline = [
            {"$match": query},
            {"$group": {
                "_id": "$status",
                "count": {"$sum": 1}
            }}
        ]
        
        stats = {}
        async for doc in db.applications.aggregate(pipeline):
            stats[doc["_id"]] = doc["count"]
        
        return stats

    async def count(self, consultant_id: Optional[str] = None, job_id: Optional[str] = None, status: Optional[ApplicationStatus] = None) -> int:
        """Count applications"""
        db = await get_database()
        
        query = {}
        if consultant_id:
            query["consultant_id"] = consultant_id
        if job_id:
            query["job_id"] = job_id
        if status:
            query["status"] = status
            
        return await db.applications.count_documents(query)
