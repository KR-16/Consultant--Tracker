from bson import ObjectId
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from app.db import get_database
from app.models import (
    Submission, SubmissionCreate, SubmissionUpdate, SubmissionFilters,
    StatusHistory, SubmissionStatus, StatusReport, TechReport, 
    RecruiterReport, FunnelReport, TimeToStageReport
)

class SubmissionRepository:
    def __init__(self):
        self.collection_name = "submissions"
        self.history_collection_name = "status_history"

    async def create(self, submission: SubmissionCreate) -> Submission:
        db = await get_database()
        submission_dict = submission.dict()
        submission_dict["created_at"] = datetime.now()
        submission_dict["updated_at"] = datetime.now()
        
        result = await db[self.collection_name].insert_one(submission_dict)
        submission_dict["id"] = str(result.inserted_id)
        
        # Create initial status history entry
        await self._create_status_history(
            str(result.inserted_id),
            None,
            submission.status,
            "System",
            "Initial submission"
        )
        
        return Submission(**submission_dict)

    async def get_by_id(self, submission_id: str) -> Optional[Submission]:
        db = await get_database()
        submission = await db[self.collection_name].find_one({"_id": ObjectId(submission_id)})
        if submission:
            submission["id"] = str(submission["_id"])
            return Submission(**submission)
        return None

    async def get_all(self, filters: Optional[SubmissionFilters] = None, skip: int = 0, limit: int = 100) -> List[Submission]:
        db = await get_database()
        query = {}
        
        if filters:
            if filters.consultant_id:
                query["consultant_id"] = filters.consultant_id
            if filters.recruiter:
                query["recruiter"] = {"$regex": filters.recruiter, "$options": "i"}
            if filters.status:
                query["status"] = filters.status
            if filters.client_or_job:
                query["client_or_job"] = {"$regex": filters.client_or_job, "$options": "i"}
            if filters.date_from or filters.date_to:
                date_query = {}
                if filters.date_from:
                    date_query["$gte"] = filters.date_from
                if filters.date_to:
                    date_query["$lte"] = filters.date_to
                query["submitted_on"] = date_query

        cursor = db[self.collection_name].find(query).skip(skip).limit(limit).sort("submitted_on", -1)
        submissions = []
        async for submission in cursor:
            submission["id"] = str(submission["_id"])
            submissions.append(Submission(**submission))
        return submissions

    async def update_status(self, submission_id: str, new_status: SubmissionStatus, changed_by: str, comments: Optional[str] = None) -> Optional[Submission]:
        db = await get_database()
        
        # Get current submission
        submission = await db[self.collection_name].find_one({"_id": ObjectId(submission_id)})
        if not submission:
            return None
        
        old_status = submission.get("status")
        
        # Update submission status
        result = await db[self.collection_name].update_one(
            {"_id": ObjectId(submission_id)},
            {
                "$set": {
                    "status": new_status,
                    "updated_at": datetime.now()
                }
            }
        )
        
        if result.modified_count:
            # Create status history entry
            await self._create_status_history(
                submission_id,
                old_status,
                new_status,
                changed_by,
                comments
            )
            
            return await self.get_by_id(submission_id)
        return None

    async def update(self, submission_id: str, submission_update: SubmissionUpdate) -> Optional[Submission]:
        db = await get_database()
        update_data = submission_update.dict(exclude_unset=True)
        if update_data:
            update_data["updated_at"] = datetime.now()
            result = await db[self.collection_name].update_one(
                {"_id": ObjectId(submission_id)},
                {"$set": update_data}
            )
            if result.modified_count:
                return await self.get_by_id(submission_id)
        return None

    async def delete(self, submission_id: str) -> bool:
        db = await get_database()
        result = await db[self.collection_name].delete_one({"_id": ObjectId(submission_id)})
        return result.deleted_count > 0

    async def get_by_consultant(self, consultant_id: str) -> List[Submission]:
        db = await get_database()
        cursor = db[self.collection_name].find({"consultant_id": consultant_id}).sort("submitted_on", -1)
        submissions = []
        async for submission in cursor:
            submission["id"] = str(submission["_id"])
            submissions.append(Submission(**submission))
        return submissions

    async def get_status_history(self, submission_id: str) -> List[StatusHistory]:
        db = await get_database()
        cursor = db[self.history_collection_name].find({"submission_id": submission_id}).sort("changed_at", -1)
        history = []
        async for entry in cursor:
            entry["id"] = str(entry["_id"])
            history.append(StatusHistory(**entry))
        return history

    async def _create_status_history(self, submission_id: str, old_status: Optional[SubmissionStatus], 
                                   new_status: SubmissionStatus, changed_by: str, comments: Optional[str]):
        db = await get_database()
        history_entry = {
            "submission_id": submission_id,
            "old_status": old_status,
            "new_status": new_status,
            "changed_at": datetime.now(),
            "changed_by": changed_by,
            "comments": comments
        }
        await db[self.history_collection_name].insert_one(history_entry)

    async def count(self, filters: Optional[SubmissionFilters] = None) -> int:
        db = await get_database()
        query = {}
        
        if filters:
            if filters.consultant_id:
                query["consultant_id"] = filters.consultant_id
            if filters.recruiter:
                query["recruiter"] = {"$regex": filters.recruiter, "$options": "i"}
            if filters.status:
                query["status"] = filters.status
            if filters.client_or_job:
                query["client_or_job"] = {"$regex": filters.client_or_job, "$options": "i"}
            if filters.date_from or filters.date_to:
                date_query = {}
                if filters.date_from:
                    date_query["$gte"] = filters.date_from
                if filters.date_to:
                    date_query["$lte"] = filters.date_to
                query["submitted_on"] = date_query

        return await db[self.collection_name].count_documents(query)
