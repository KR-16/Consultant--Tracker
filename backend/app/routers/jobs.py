from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.dependencies import get_current_hiring_manager
from app.models.jobs import Job
from app.models.users import User, UserRole
from app.schemas.jobs import JobCreate, JobUpdate, JobResponse

router = APIRouter()

@router.get("/", response_model=List[JobResponse])
def read_jobs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Retrieve all active jobs"""
    return db.query(Job).filter(Job.is_active == True).offset(skip).limit(limit).all()

@router.post("/", response_model=JobResponse)
def create_job(
    job_in: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_hiring_manager)
):
    job_data = job_in.dict()
    
    db_job = Job(
        **job_data,
        creator_id=current_user.id
    )
    
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

@router.put("/{id}", response_model=JobResponse)
def update_job(
    id: int,
    job_in: JobUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_hiring_manager)
):
    job = db.query(Job).filter(Job.id == id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Authorization: Admins or the Creator only
    if current_user.role != UserRole.ADMIN and job.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    update_data = job_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(job, key, value)

    db.commit()
    db.refresh(job)
    return job

@router.delete("/{id}")
def delete_job(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_hiring_manager)
):
    job = db.query(Job).filter(Job.id == id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if current_user.role != UserRole.ADMIN and job.creator_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    job.is_active = False # Soft delete
    db.commit()
    return {"message": "Job closed successfully"}