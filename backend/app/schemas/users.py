from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional
from datetime import datetime
from app.models.users import UserRole

# --- User Schemas ---
class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: UserRole = UserRole.CANDIDATE
    is_active: bool = True

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

# --- Candidate Profile Schemas ---
class CandidateProfileBase(BaseModel):
    phone: Optional[str] = None
    location: Optional[str] = None
    experience_years: int = 0
    skills: Optional[str] = None # Comma-separated
    resume_1_url: Optional[str] = None
    resume_2_url: Optional[str] = None

class CandidateProfileUpdate(CandidateProfileBase):
    pass

class CandidateProfileResponse(CandidateProfileBase):
    id: int
    user_id: int
    
    model_config = ConfigDict(from_attributes=True)