from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, DateTime, Enum as SQLEnum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import ARRAY  

from app.db import Base
import enum

# --- Enums for Database ---
class UserRole(str, enum.Enum):
    ADMIN = "ADMIN"
    TALENT_MANAGER = "TALENT_MANAGER"
    CANDIDATE = "CANDIDATE"

class SubmissionStatus(str, enum.Enum):
    SUBMITTED = "SUBMITTED"
    INTERVIEW = "INTERVIEW"
    OFFER = "OFFER"
    JOINED = "JOINED"
    REJECTED = "REJECTED"
    ON_HOLD = "ON_HOLD"
    WITHDRAWN = "WITHDRAWN"

# --- Database Tables ---

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(SQLEnum(UserRole), default=UserRole.CANDIDATE, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    # Relationships
    candidate_profile = relationship("CandidateProfile", back_populates="user", uselist=False)
    jobs_posted = relationship("Job", back_populates="manager")
    submissions_received = relationship("Submission", back_populates="manager")

class CandidateProfile(Base):
    __tablename__ = "candidate_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    # Manager who "owns" or is assigned to this candidate
    assigned_manager_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    experience_years = Column(Float, default=0.0)
    # Using Postgres ARRAY for skills. e.g. ["Python", "Docker"]
    skills = Column(ARRAY(String), default=list) 
    available = Column(Boolean, default=True)
    location = Column(String, nullable=True)
    visa_status = Column(String, nullable=True)
    rating = Column(Float, nullable=True)
    notes = Column(Text, nullable=True)
    resume_url = Column(String, nullable=True)
    
    # Relationships
    user = relationship("User", foreign_keys=[user_id], back_populates="candidate_profile")
    manager = relationship("User", foreign_keys=[assigned_manager_id])
    submissions = relationship("Submission", back_populates="candidate")

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    talent_manager_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    experience_required = Column(Float, default=0.0)
    skills_required = Column(ARRAY(String), default=list)
    location = Column(String, nullable=True)
    status = Column(String, default="OPEN")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    # Relationships
    manager = relationship("User", back_populates="jobs_posted")
    submissions = relationship("Submission", back_populates="job")

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    candidate_id = Column(Integer, ForeignKey("candidate_profiles.id"), nullable=False)
    talent_manager_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    status = Column(SQLEnum(SubmissionStatus), default=SubmissionStatus.SUBMITTED)
    comments = Column(Text, nullable=True)
    manager_read = Column(Boolean, default=False)
    resume_path = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    # Relationships
    job = relationship("Job", back_populates="submissions")
    candidate = relationship("CandidateProfile", back_populates="submissions")
    manager = relationship("User", back_populates="submissions_received")