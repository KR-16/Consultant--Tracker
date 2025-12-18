import enum
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum as SQLEnum, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class SubmissionStatus(str, enum.Enum):
    APPLIED = "APPLIED"
    SCREENING = "SCREENING"
    INTERVIEW = "INTERVIEW"
    OFFER = "OFFER"
    REJECTED = "REJECTED"

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    candidate_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    status = Column(SQLEnum(SubmissionStatus), default=SubmissionStatus.APPLIED)
    resume_used = Column(String, nullable=True) 
    ats_score = Column(Float, nullable=True)    
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    job = relationship("Job", back_populates="submissions")
    candidate = relationship("User", back_populates="submissions", foreign_keys=[candidate_id])