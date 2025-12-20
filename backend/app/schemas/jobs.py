from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime

class JobBase(BaseModel):
    title: str
    company_name: str
    description: str  
    location: Optional[str] = None
    department: Optional[str] = None
    employment_type: Optional[str] = "Full-time" 
    salary_range: Optional[str] = None
    requirements: Optional[str] = None 
    required_skills: Optional[str] = None
    experience_required: Optional[str] = None
    hiring_stages: List[str] = ["Applied", "Screening", "Interview", "Offer", "Rejected"]
    is_active: bool = True

class JobCreate(JobBase):
    pass

class JobUpdate(BaseModel):
    title: Optional[str] = None
    company_name: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    department: Optional[str] = None
    employment_type: Optional[str] = None
    hiring_stages: Optional[List[str]] = None
    is_active: Optional[bool] = None

class JobResponse(JobBase):
    id: int
    creator_id: int
    created_at: datetime

    class Config:
        from_attributes = True