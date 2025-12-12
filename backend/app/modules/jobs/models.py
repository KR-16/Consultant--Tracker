"""
Jobs Module Models
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class JobDescriptionBase(BaseModel):
    title: str = Field(..., min_length=1)
    description: str
    experience_required: float = Field(..., ge=0)
    tech_required: List[str] = []
    location: Optional[str] = None
    visa_required: Optional[str] = None
    notes: Optional[str] = None
    status: str = "OPEN"  # OPEN, CLOSED

class JobDescriptionCreate(JobDescriptionBase):
    pass

class JobDescriptionUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    experience_required: Optional[float] = None
    tech_required: Optional[List[str]] = None
    location: Optional[str] = None
    visa_required: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[str] = None

class JobDescription(JobDescriptionBase):
    id: str
    recruiter_id: str
    created_at: datetime
    updated_at: datetime
    recruiter_name: Optional[str] = None
    recruiter_email: Optional[str] = None
    
    class Config:
        from_attributes = True

__all__ = [
    "JobDescriptionBase",
    "JobDescriptionCreate",
    "JobDescriptionUpdate",
    "JobDescription",
]

