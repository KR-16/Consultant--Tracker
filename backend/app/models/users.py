import enum
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Enum as SQLEnum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class UserRole(str, enum.Enum):
    ADMIN = "ADMIN"
    TALENT_MANAGER = "TALENT_MANAGER"
    CANDIDATE = "CANDIDATE"

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
    submissions = relationship("Submission", back_populates="candidate", foreign_keys="[Submission.candidate_id]")

class CandidateProfile(Base):
    __tablename__ = "candidate_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    phone = Column(String, nullable=True)
    location = Column(String, nullable=True)
    experience_years = Column(Integer, default=0)
    skills = Column(String, nullable=True) # Stored as comma-separated string for simplicity
    
    # Resume URLs (Storing up to 2 as requested)
    resume_1_url = Column(String, nullable=True)
    resume_2_url = Column(String, nullable=True)

    user = relationship("User", back_populates="candidate_profile")