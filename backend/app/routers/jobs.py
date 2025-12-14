from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.jobs import JobCreate, JobResponse
from app.models.users import User
from app.repositories.jobs import JobRepository
from app.dependencies import get_current_active_user, get_current_manager

router = APIRouter()
job_repo = JobRepository()

@router.get("/", response_model=List[JobResponse])
def read_jobs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_active_user)):
    """
    List all open jobs. Accessible by Candidates and Managers.
    """
    return job_repo.get_all(db, skip=skip, limit=limit)

@router.post("/", response_model=JobResponse)
def create_job(
    job_in: JobCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_manager) # Only Managers
):
    """
    Create a new job posting.
    """
    return job_repo.create(db, job_in, manager_id=current_user.id)

@router.get("/my-jobs", response_model=List[JobResponse])
def read_my_jobs(db: Session = Depends(get_db), current_user: User = Depends(get_current_manager)):
    """
    List jobs created by the logged-in manager.
    """
    return job_repo.get_by_manager(db, current_user.id)