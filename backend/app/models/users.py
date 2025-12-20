from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.db.base import Base

class UserRole(str, enum.Enum):
    ADMIN = "ADMIN"
    HIRING_MANAGER = "HIRING_MANAGER"  
    CANDIDATE = "CANDIDATE"

class ExperienceLevel(str, enum.Enum):
    FRESHER = "Fresher"
    ONE_TO_THREE = "1-3 Years"
    THREE_TO_FIVE = "3-5 Years"
    FIVE_PLUS = "5+ Years"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    first_name = Column(String)
    last_name = Column(String)
    phone = Column(String, nullable=True)
    role = Column(SQLEnum(UserRole), default=UserRole.CANDIDATE)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    
    profile = relationship("CandidateProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    resumes = relationship("Resume", back_populates="owner", cascade="all, delete-orphan")
    assigned_candidates = relationship("CandidateAssignment", foreign_keys="[CandidateAssignment.manager_id]", back_populates="manager")
    assigned_manager = relationship("CandidateAssignment", foreign_keys="[CandidateAssignment.candidate_id]", back_populates="candidate")

    jobs = relationship("Job", back_populates="creator")
    submissions = relationship("Submission", back_populates="candidate")

class CandidateProfile(Base):
    __tablename__ = "candidate_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    phone = Column(String, nullable=True)
    current_city = Column(String, nullable=True)
    visa_status = Column(String, nullable=True)
    experience_level = Column(SQLEnum(ExperienceLevel), nullable=True)
    primary_skills = Column(String, nullable=True) 
    
    user = relationship("User", back_populates="profile")

class CandidateAssignment(Base):
    __tablename__ = "candidate_assignments"

    id = Column(Integer, primary_key=True, index=True)
    manager_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    candidate_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    assigned_at = Column(DateTime(timezone=True), server_default=func.now())

    manager = relationship("User", foreign_keys=[manager_id], back_populates="assigned_candidates")
    candidate = relationship("User", foreign_keys=[candidate_id], back_populates="assigned_manager")