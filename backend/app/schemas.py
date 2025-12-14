from pydantic import BaseModel, EmailStr, Field, validator, ConfigDict
from typing import Optional, List
from datetime import datetime
from enum import Enum
import logging

# Set up logger
logger = logging.getLogger(__name__)

# --- 1. ENUMS ---

class UserRole(str, Enum):
    ADMIN = "ADMIN"
    TALENT_MANAGER = "TALENT_MANAGER"
    CANDIDATE = "CANDIDATE"
    
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

# --- 2. AUTH & USER SCHEMAS ---

class UserBase(BaseModel):
    email: EmailStr
    name: str = Field(..., min_length=1, max_length=100)
    role: UserRole
    is_active: bool = True

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters")
    
    @validator('password')
    def validate_password_length(cls, v):
        if not v:
            raise ValueError("Password is required")
        if len(v.encode('utf-8')) > 72:
            raise ValueError("Password is too long (max 72 bytes)")
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters")
        return v

class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None

class UserResponse(UserBase):
    id: int  # Changed from str to int for SQL
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class UserInDB(UserResponse):
    hashed_password: str

# --- 3. TOKENS ---

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

# --- 4. CANDIDATE PROFILE SCHEMAS ---

class CandidateProfileBase(BaseModel):
    experience_years: float = Field(..., ge=0)
    skills: List[str] = [] 
    available: bool = True
    location: Optional[str] = None
    visa_status: Optional[str] = None
    rating: Optional[float] = None
    notes: Optional[str] = None
    resume_url: Optional[str] = None
    assigned_manager_id: Optional[int] = None # Changed to int

class CandidateProfileCreate(CandidateProfileBase):
    pass

class CandidateProfileUpdate(BaseModel):
    experience_years: Optional[float] = None
    skills: Optional[List[str]] = None
    available: Optional[bool] = None
    location: Optional[str] = None
    visa_status: Optional[str] = None
    resume_url: Optional[str] = None
    assigned_manager_id: Optional[int] = None 

class CandidateProfile(CandidateProfileBase):
    id: int # Changed to int
    user_id: int # Changed to int
    
    # These fields might need to be fetched via joins in the repository
    email: Optional[str] = None
    name: Optional[str] = None
    phone: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)

# --- 5. JOB SCHEMAS ---

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
    id: int # Changed to int
    talent_manager_id: int # Changed to int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)

# --- 6. SUBMISSION SCHEMAS ---

class SubmissionBase(BaseModel):
    job_id: int # Changed to int
    comments: Optional[str] = None

class SubmissionCreate(SubmissionBase):
    candidate_id: int # Explicitly needed for creation

class SubmissionUpdate(BaseModel):
    status: Optional[SubmissionStatus] = None
    comments: Optional[str] = None
    manager_read: Optional[bool] = None

class Submission(SubmissionBase):
    id: int # Changed to int
    candidate_id: int # Changed to int
    talent_manager_id: int # Changed to int
    resume_path: Optional[str] = None
    status: SubmissionStatus
    manager_read: bool = False
    created_at: datetime
    updated_at: Optional[datetime] = None
    candidate_name: Optional[str] = None
    job_title: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)