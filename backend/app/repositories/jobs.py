from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.jobs import Job
from app.schemas.jobs import JobCreate, JobUpdate

class JobRepository:
    def create(self, db: Session, job_in: JobCreate, manager_id: int):
        db_job = Job(**job_in.model_dump(), manager_id=manager_id)
        db.add(db_job)
        db.commit()
        db.refresh(db_job)
        return db_job

    def get_all(self, db: Session, skip: int = 0, limit: int = 100):
        return db.query(Job).filter(Job.is_active == True).offset(skip).limit(limit).all()

    def get_by_manager(self, db: Session, manager_id: int):
        return db.query(Job).filter(Job.manager_id == manager_id).all()

    def get_by_id(self, db: Session, job_id: int):
        return db.query(Job).filter(Job.id == job_id).first()