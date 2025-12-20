from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from datetime import datetime
from app.schemas.users import UserResponse
from app.schemas.jobs import JobResponse
from app.schemas.resumes import ResumeResponse

class TimelineEvent(BaseModel):
    stage: str
    date: datetime
    notes: Optional[str] = None

class SubmissionBase(BaseModel):
    job_id: int
    resume_id: int

class SubmissionCreate(SubmissionBase):
    pass

class SubmissionUpdateStatus(BaseModel):
    current_status: str
    notes: Optional[str] = None 

class SubmissionResponse(BaseModel):
    id: int
    candidate_id: int
    job_id: int
    resume_id: Optional[int] = None
    current_status: str
    manager_notes: Optional[str] = None
    timeline_history: List[Dict[str, Any]] = [] 
    applied_at: datetime
    updated_at: Optional[datetime] = None
    
    
    candidate: Optional[UserResponse] = None
    job: Optional[JobResponse] = None
    resume_used: Optional[ResumeResponse] = None

    class Config:
        from_attributes = True