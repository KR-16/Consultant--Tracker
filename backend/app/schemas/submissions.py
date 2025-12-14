from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from app.models.submissions import SubmissionStatus
from app.schemas.users import UserResponse
from app.schemas.jobs import JobResponse

class SubmissionCreate(BaseModel):
    job_id: int
    resume_used: Optional[str] = None

class SubmissionUpdate(BaseModel):
    status: SubmissionStatus
    ats_score: Optional[float] = None

class SubmissionResponse(BaseModel):
    id: int
    job_id: int
    candidate_id: int
    status: SubmissionStatus
    resume_used: Optional[str] = None
    ats_score: Optional[float] = None
    created_at: datetime
    
    # Nested objects for convenience (optional)
    job: Optional[JobResponse] = None
    candidate: Optional[UserResponse] = None

    model_config = ConfigDict(from_attributes=True)