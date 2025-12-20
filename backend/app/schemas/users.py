from typing import Optional
from pydantic import BaseModel, EmailStr
from datetime import datetime
from enum import Enum


class UserRole(str, Enum):
    ADMIN = "ADMIN"
    HIRING_MANAGER = "HIRING_MANAGER"
    CANDIDATE = "CANDIDATE"

class ExperienceLevel(str, Enum):
    FRESHER = "Fresher"
    ONE_TO_THREE = "1-3 Years"
    THREE_TO_FIVE = "3-5 Years"
    FIVE_PLUS = "5+ Years"


class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: Optional[str] = None
    role: Optional[str] = None


class CandidateProfileBase(BaseModel):
    phone: Optional[str] = None
    current_city: Optional[str] = None
    visa_status: Optional[str] = None
    experience_level: Optional[ExperienceLevel] = None
    primary_skills: Optional[str] = None

class CandidateProfileCreate(CandidateProfileBase):
    pass

class CandidateProfileUpdate(CandidateProfileBase):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    current_city: Optional[str] = None
    visa_status: Optional[str] = None
    experience_level: Optional[str] = None
    primary_skills: Optional[str] = None

class CandidateProfileResponse(CandidateProfileBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_active: Optional[bool] = True
    role: UserRole = UserRole.CANDIDATE

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    password: Optional[str] = None

class UserResponse(UserBase):
    id: int
    created_at: datetime
    profile: Optional[CandidateProfileResponse] = None

    class Config:
        from_attributes = True

class AssignmentCreate(BaseModel):
    manager_id: int
    candidate_id: int

class AssignmentResponse(BaseModel):
    id: int
    manager_id: int
    candidate_id: int
    assigned_at: datetime

    class Config:
        from_attributes = True