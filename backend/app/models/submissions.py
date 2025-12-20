import enum
from sqlalchemy import Column, Integer, ForeignKey, DateTime, Text, JSON, Float, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class SubmissionStatus(str, enum.Enum):
    APPLIED = "Applied"
    ASSESSMENT = "Online Assessment"
    INTERVIEW_TECH = "Technical Interview"
    INTERVIEW_MANAGER = "Manager Round"
    OFFER = "Offer Letter"
    REJECTED = "Rejected"

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("users.id"))
    job_id = Column(Integer, ForeignKey("jobs.id"))
    resume_id = Column(Integer, ForeignKey("resumes.id"), nullable=True)
    
    status = Column(Enum(SubmissionStatus), default=SubmissionStatus.APPLIED)
    ats_score = Column(Float, nullable=True)
    timeline_history = Column(JSON, default=list) 
    manager_notes = Column(Text, nullable=True)
    
    applied_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    candidate = relationship("User", back_populates="submissions")
    job = relationship("Job", back_populates="submissions")
    resume_used = relationship("Resume", back_populates="submissions")