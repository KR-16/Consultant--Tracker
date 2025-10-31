from pydantic import BaseModel, EmailStr, Field, validator
from typing import List, Optional
from datetime import datetime
from enum import Enum

class VisaStatus(str, Enum):
    H1B = "H1B"
    GREEN_CARD = "GREEN_CARD"
    CITIZEN = "CITIZEN"
    OTHER = "OTHER"

class Rating(str, Enum):
    EXCELLENT = "EXCELLENT"
    GOOD = "GOOD"
    AVERAGE = "AVERAGE"
    POOR = "POOR"

class SubmissionStatus(str, Enum):
    SUBMITTED = "SUBMITTED"
    INTERVIEW = "INTERVIEW"
    OFFER = "OFFER"
    JOINED = "JOINED"
    REJECTED = "REJECTED"
    ON_HOLD = "ON_HOLD"
    WITHDRAWN = "WITHDRAWN"

# Consultant Models
class ConsultantBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    experience_years: int = Field(..., ge=0, le=50)
    tech_stack: List[str] = Field(default_factory=list)
    available: bool = True
    location: str = Field(..., min_length=1, max_length=100)
    visa_status: VisaStatus
    rating: Rating
    email: EmailStr
    phone: str = Field(..., pattern=r'^\+?1?\d{9,15}$')
    notes: Optional[str] = None

class ConsultantCreate(ConsultantBase):
    pass

class ConsultantUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    experience_years: Optional[int] = Field(None, ge=0, le=50)
    tech_stack: Optional[List[str]] = None
    available: Optional[bool] = None
    location: Optional[str] = Field(None, min_length=1, max_length=100)
    visa_status: Optional[VisaStatus] = None
    rating: Optional[Rating] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, pattern=r'^\+?1?\d{9,15}$')
    notes: Optional[str] = None

class Consultant(ConsultantBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Submission Models
class SubmissionBase(BaseModel):
    consultant_id: str = Field(..., min_length=1)
    client_or_job: str = Field(..., min_length=1, max_length=200)
    recruiter: str = Field(..., min_length=1, max_length=100)
    submitted_on: datetime
    status: SubmissionStatus = SubmissionStatus.SUBMITTED
    comments: Optional[str] = None
    attachment_path: Optional[str] = None

    @validator('submitted_on')
    def validate_submitted_on(cls, v):
        if v > datetime.now():
            raise ValueError('submitted_on cannot be in the future')
        return v

class SubmissionCreate(SubmissionBase):
    pass

class SubmissionUpdate(BaseModel):
    client_or_job: Optional[str] = Field(None, min_length=1, max_length=200)
    recruiter: Optional[str] = Field(None, min_length=1, max_length=100)
    submitted_on: Optional[datetime] = None
    status: Optional[SubmissionStatus] = None
    comments: Optional[str] = None
    attachment_path: Optional[str] = None

class Submission(SubmissionBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class SubmissionStatusUpdate(BaseModel):
    status: SubmissionStatus
    comments: Optional[str] = None

# Status History Model
class StatusHistory(BaseModel):
    id: str
    submission_id: str
    old_status: Optional[SubmissionStatus]
    new_status: SubmissionStatus
    changed_at: datetime
    changed_by: str
    comments: Optional[str] = None

    class Config:
        from_attributes = True

# Filter Models
class ConsultantFilters(BaseModel):
    tech_stack: Optional[List[str]] = None
    available: Optional[bool] = None
    location: Optional[str] = None
    visa_status: Optional[VisaStatus] = None
    rating: Optional[Rating] = None
    experience_min: Optional[int] = Field(None, ge=0)
    experience_max: Optional[int] = Field(None, le=50)

class SubmissionFilters(BaseModel):
    consultant_id: Optional[str] = None
    recruiter: Optional[str] = None
    status: Optional[SubmissionStatus] = None
    tech_stack: Optional[List[str]] = None
    client_or_job: Optional[str] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None

# Report Models
class StatusReport(BaseModel):
    status: SubmissionStatus
    count: int
    percentage: float

class TechReport(BaseModel):
    tech: str
    count: int
    percentage: float

class RecruiterReport(BaseModel):
    recruiter: str
    total_submissions: int
    interviews: int
    offers: int
    joined: int
    win_rate: float

class FunnelReport(BaseModel):
    stage: str
    count: int
    conversion_rate: float

class TimeToStageReport(BaseModel):
    from_stage: str
    to_stage: str
    avg_days: float
    count: int
