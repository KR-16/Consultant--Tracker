from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from bson.errors import InvalidId
from pymongo.errors import PyMongoError
import logging
from app.models import Submission, SubmissionCreate, SubmissionUpdate, SubmissionStatus
from app.db import get_database

logger = logging.getLogger(__name__)

class SubmissionRepository:
    def __init__(self):
        self.collection_name = "submissions"
        logger.debug(f"SubmissionRepository initialized")

    async def create(self, submission_data: SubmissionCreate, consultant_id: str, recruiter_id: str, resume_path: str) -> Submission:
        """Create a new submission"""
        logger.info(f"Creating new submission for JD: {submission_data.jd_id}")
        try:
            db = await get_database()
            if db is None:
                raise ValueError("Database connection not available")
            
            # Check if already applied
            existing = await db.submissions.find_one({
                "consultant_id": consultant_id,
                "jd_id": submission_data.jd_id
            })
            
            # We allow multiple submissions, but maybe warn? For now just create new.
            
            doc = submission_data.dict()
            doc["consultant_id"] = consultant_id
            doc["recruiter_id"] = recruiter_id
            doc["resume_path"] = resume_path
            doc["status"] = SubmissionStatus.SUBMITTED
            doc["recruiter_read"] = False
            doc["created_at"] = datetime.utcnow()
            doc["updated_at"] = datetime.utcnow()
            doc["status_history"] = [{
                "status": SubmissionStatus.SUBMITTED,
                "changed_at": datetime.utcnow(),
                "note": "Initial submission"
            }]
            
            result = await db.submissions.insert_one(doc)
            doc["id"] = str(result.inserted_id)
            
            return Submission(**doc)
        except Exception as e:
            logger.error(f"Error creating submission: {str(e)}", exc_info=True)
            raise

    async def get_by_consultant(self, consultant_id: str) -> List[Submission]:
        """Get all submissions for a consultant"""
        logger.debug(f"Getting submissions for consultant: {consultant_id}")
        try:
            db = await get_database()
            if db is None:
                raise ValueError("Database connection not available")
            
            cursor = db.submissions.find({"consultant_id": consultant_id}).sort("created_at", -1)
            submissions = []
            
            async for doc in cursor:
                doc["id"] = str(doc["_id"])
                # Fetch JD title
                try:
                    jd = await db.job_descriptions.find_one({"_id": ObjectId(doc["jd_id"])})
                    if jd:
                        doc["jd_title"] = jd.get("title", "Unknown Job")
                    else:
                        doc["jd_title"] = "Unknown Job"
                except (InvalidId, TypeError) as e:
                    logger.warning(f"Invalid jd_id format in submission {doc['id']}: {doc.get('jd_id')}")
                    doc["jd_title"] = "Unknown Job"
                except Exception as e:
                    logger.error(f"Error fetching JD for submission {doc['id']}: {str(e)}")
                    doc["jd_title"] = "Unknown Job"
                submissions.append(Submission(**doc))
                
            return submissions
        except Exception as e:
            logger.error(f"Error getting consultant submissions: {str(e)}", exc_info=True)
            raise

    async def get_all(self, recruiter_id: Optional[str] = None) -> List[Submission]:
        """Get all submissions with full JD and recruiter details (optionally filtered by recruiter)"""
        logger.debug(f"Getting all submissions (recruiter_id: {recruiter_id})")
        try:
            db = await get_database()
            if db is None:
                raise ValueError("Database connection not available")
            
            query = {}
            if recruiter_id:
                query["recruiter_id"] = recruiter_id
                
            cursor = db.submissions.find(query).sort("created_at", -1)
            submissions = []
            
            async for doc in cursor:
                doc["id"] = str(doc["_id"])
                
                # Fetch consultant name and email from users collection
                try:
                    consultant_user = await db.users.find_one({"_id": ObjectId(doc["consultant_id"])})
                    if consultant_user:
                        doc["consultant_name"] = consultant_user.get("name", "Unknown")
                        doc["consultant_email"] = consultant_user.get("email", "")
                    else:
                        doc["consultant_name"] = "Unknown"
                        doc["consultant_email"] = ""
                except (InvalidId, TypeError) as e:
                    logger.warning(f"Invalid consultant_id format in submission {doc['id']}: {doc.get('consultant_id')}")
                    doc["consultant_name"] = "Unknown"
                    doc["consultant_email"] = ""
                except Exception as e:
                    logger.error(f"Error fetching consultant user for submission {doc['id']}: {str(e)}")
                    doc["consultant_name"] = "Unknown"
                    doc["consultant_email"] = ""
                
                # Fetch full JD details and recruiter information
                try:
                    jd = await db.job_descriptions.find_one({"_id": ObjectId(doc["jd_id"])})
                    if jd:
                        doc["jd_title"] = jd.get("title", "Unknown Job")
                        doc["jd_location"] = jd.get("location", "")
                        doc["jd_experience_required"] = jd.get("experience_required", 0)
                        doc["jd_tech_required"] = jd.get("tech_required", [])
                        doc["jd_description"] = jd.get("description", "")
                        
                        # Fetch recruiter who posted the JD
                        jd_recruiter_id = jd.get("recruiter_id")
                        if jd_recruiter_id:
                            try:
                                recruiter_user = await db.users.find_one({"_id": ObjectId(jd_recruiter_id)})
                                if recruiter_user:
                                    doc["jd_recruiter_name"] = recruiter_user.get("name", "Unknown")
                                    doc["jd_recruiter_email"] = recruiter_user.get("email", "")
                                else:
                                    doc["jd_recruiter_name"] = "Unknown Recruiter"
                                    doc["jd_recruiter_email"] = ""
                            except (InvalidId, TypeError):
                                doc["jd_recruiter_name"] = "Unknown Recruiter"
                                doc["jd_recruiter_email"] = ""
                        else:
                            doc["jd_recruiter_name"] = "Unknown Recruiter"
                            doc["jd_recruiter_email"] = ""
                    else:
                        doc["jd_title"] = "Unknown Job"
                        doc["jd_location"] = ""
                        doc["jd_experience_required"] = 0
                        doc["jd_tech_required"] = []
                        doc["jd_description"] = ""
                        doc["jd_recruiter_name"] = "Unknown Recruiter"
                        doc["jd_recruiter_email"] = ""
                except (InvalidId, TypeError) as e:
                    logger.warning(f"Invalid jd_id format in submission {doc['id']}: {doc.get('jd_id')}")
                    doc["jd_title"] = "Unknown Job"
                    doc["jd_location"] = ""
                    doc["jd_experience_required"] = 0
                    doc["jd_tech_required"] = []
                    doc["jd_description"] = ""
                    doc["jd_recruiter_name"] = "Unknown Recruiter"
                    doc["jd_recruiter_email"] = ""
                except Exception as e:
                    logger.error(f"Error fetching JD for submission {doc['id']}: {str(e)}")
                    doc["jd_title"] = "Unknown Job"
                    doc["jd_location"] = ""
                    doc["jd_experience_required"] = 0
                    doc["jd_tech_required"] = []
                    doc["jd_description"] = ""
                    doc["jd_recruiter_name"] = "Unknown Recruiter"
                    doc["jd_recruiter_email"] = ""
                    
                submissions.append(Submission(**doc))
                
            return submissions
        except Exception as e:
            logger.error(f"Error getting all submissions: {str(e)}", exc_info=True)
            raise

    async def update_status(self, submission_id: str, status: SubmissionStatus, recruiter_id: str) -> Optional[Submission]:
        """Update submission status"""
        logger.info(f"Updating submission status: {submission_id} -> {status}")
        try:
            db = await get_database()
            if db is None:
                raise ValueError("Database connection not available")
            
            # Verify ownership/permission
            existing = await db.submissions.find_one({"_id": ObjectId(submission_id)})
            if not existing:
                return None
            
            # Only the recruiter who owns the JD (or admin) should update? 
            # For now, check if recruiter_id matches
            if existing["recruiter_id"] != recruiter_id:
                # Unless admin? We'll handle admin check in router
                pass 
            
            update_data = {
                "status": status,
                "updated_at": datetime.utcnow(),
                "recruiter_read": True
            }
            
            # Add to history
            history_entry = {
                "status": status,
                "changed_at": datetime.utcnow(),
                "note": "Status updated by recruiter"
            }
            
            await db.submissions.update_one(
                {"_id": ObjectId(submission_id)},
                {
                    "$set": update_data,
                    "$push": {"status_history": history_entry}
                }
            )
            
            return await self.get_by_id(submission_id)
        except Exception as e:
            logger.error(f"Error updating submission status: {str(e)}", exc_info=True)
            raise

    async def get_by_id(self, submission_id: str) -> Optional[Submission]:
        """Get submission by ID"""
        try:
            db = await get_database()
            if db is None:
                raise ValueError("Database connection not available")
                
            doc = await db.submissions.find_one({"_id": ObjectId(submission_id)})
            if doc:
                doc["id"] = str(doc["_id"])
                
                # Fetch consultant name from users collection
                try:
                    consultant_user = await db.users.find_one({"_id": ObjectId(doc["consultant_id"])})
                    if consultant_user:
                        doc["consultant_name"] = consultant_user.get("name", "Unknown")
                    else:
                        doc["consultant_name"] = "Unknown"
                except (InvalidId, TypeError) as e:
                    logger.warning(f"Invalid consultant_id format in submission {submission_id}: {doc.get('consultant_id')}")
                    doc["consultant_name"] = "Unknown"
                except Exception as e:
                    logger.error(f"Error fetching consultant user for submission {submission_id}: {str(e)}")
                    doc["consultant_name"] = "Unknown"
                
                # Fetch JD title
                try:
                    jd = await db.job_descriptions.find_one({"_id": ObjectId(doc["jd_id"])})
                    if jd:
                        doc["jd_title"] = jd.get("title", "Unknown Job")
                    else:
                        doc["jd_title"] = "Unknown Job"
                except (InvalidId, TypeError) as e:
                    logger.warning(f"Invalid jd_id format in submission {submission_id}: {doc.get('jd_id')}")
                    doc["jd_title"] = "Unknown Job"
                except Exception as e:
                    logger.error(f"Error fetching JD for submission {submission_id}: {str(e)}")
                    doc["jd_title"] = "Unknown Job"
                
                return Submission(**doc)
            return None
        except (InvalidId, TypeError) as e:
            logger.error(f"Invalid submission_id format: {submission_id}")
            return None
        except Exception as e:
            logger.error(f"Error getting submission by ID: {str(e)}", exc_info=True)
            return None
