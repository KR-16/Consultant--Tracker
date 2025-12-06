from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
from datetime import datetime
from enum import Enum
import logging

# Set up logger
logger = logging.getLogger(__name__)

# --- 1. ENUMS ---

class UserRole(str, Enum):
    ADMIN = "ADMIN"
    TALENT_MANAGER = "TALENT_MANAGER"  # Renamed from RECRUITER
    CANDIDATE = "CANDIDATE"            # Renamed from CONSULTANT
    
    def __str__(self):
        return self.value

class SubmissionStatus(str, Enum):
    SUBMITTED = "SUBMITTED"
    INTERVIEW = "INTERVIEW"
    OFFER = "OFFER"
    JOINED = "JOINED"
    REJECTED = "REJECTED"
    ON_HOLD = "ON_HOLD"
    WITHDRAWN = "WITHDRAWN"

# --- 2. AUTH & USER MODELS ---

class UserBase(BaseModel):
    email: EmailStr
    name: str = Field(..., min_length=1, max_length=100)
    role: UserRole
    is_active: bool = True

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters")
    
    @validator('password')
    def validate_password_length(cls, v):
        """Ensure password doesn't exceed 72 bytes (bcrypt limitation)"""
        if not v:
            raise ValueError("Password is required")
        
        try:
            password_bytes = v.encode('utf-8')
            if len(password_bytes) > 72:
                raise ValueError("Password is too long (max 72 bytes)")
            if len(v) < 6:
                raise ValueError("Password must be at least 6 characters")
            return v
        except Exception as e:
            logger.error(f"Password validation error: {str(e)}")
            raise ValueError("Invalid password format")

class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None

class UserResponse(UserBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class User(UserBase):
    id: str
    created_at: datetime
    updated_at: datetime
    hashed_password: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

# --- 3. CANDIDATE PROFILE (Formerly Consultant) ---

class CandidateProfileBase(BaseModel):
    experience_years: float = Field(..., ge=0)
    skills: List[str] = [] 
    available: bool = True
    location: Optional[str] = None
    visa_status: Optional[str] = None
    rating: Optional[float] = None
    notes: Optional[str] = None
    resume_url: Optional[str] = None

class CandidateProfileCreate(CandidateProfileBase):
    pass

class CandidateProfileUpdate(BaseModel):
    experience_years: Optional[float] = None
    skills: Optional[List[str]] = None
    available: Optional[bool] = None
    location: Optional[str] = None
    visa_status: Optional[str] = None
    resume_url: Optional[str] = None

class CandidateProfile(CandidateProfileBase):
    id: str
    user_id: str
    email: Optional[str] = None
    name: Optional[str] = None
    phone: Optional[str] = None
    
    class Config:
        from_attributes = True

# --- 4. JOB DESCRIPTIONS ---


class JobDescriptionBase(BaseModel):
    title: str = Field(..., min_length=1)
    description: str
    experience_required: float = Field(..., ge=0)
    skills_required: List[str] = []
    location: Optional[str] = None
    status: str = "OPEN"

class JobDescriptionCreate(JobDescriptionBase):
    pass

class JobDescriptionUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    experience_required: Optional[float] = None
    skills_required: Optional[List[str]] = None
    location: Optional[str] = None
    status: Optional[str] = None

class JobDescription(JobDescriptionBase):
    id: str
    talent_manager_id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# --- 5. SUBMISSIONS ---

class SubmissionBase(BaseModel):
    job_id: str
    comments: Optional[str] = None

class SubmissionCreate(SubmissionBase):
    pass

class SubmissionUpdate(BaseModel):
    status: Optional[SubmissionStatus] = None
    comments: Optional[str] = None
    manager_read: Optional[bool] = None

class Submission(SubmissionBase):
    id: str
    candidate_id: str
    talent_manager_id: str
    resume_path: Optional[str] = None
    status: SubmissionStatus
    manager_read: bool = False
    created_at: datetime
    updated_at: datetime
    candidate_name: Optional[str] = None
    job_title: Optional[str] = None
    
    class Config:
        from_attributes = True