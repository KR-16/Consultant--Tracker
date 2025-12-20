from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Boolean, JSON 
from sqlalchemy.orm import relationship
from app.db.base import Base
from datetime import datetime

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    company_name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    location = Column(String, nullable=True)
    department = Column(String, nullable=True)
    employment_type = Column(String, default="Full-time")
    salary_range = Column(String, nullable=True)
    requirements = Column(Text, nullable=True)
    required_skills = Column(Text, nullable=True)
    experience_required = Column(String, nullable=True)
    
    hiring_stages = Column(JSON, default=lambda: ["Applied", "Screening", "Interview", "Offer", "Rejected"])

    creator_id = Column(Integer, ForeignKey("users.id"))
    creator = relationship("User", back_populates="jobs")
    submissions = relationship("Submission", back_populates="job")

    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)