from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.models import JobDescription, JobDescriptionCreate, User
from app.auth import require_talent_manager_or_admin
from app.repositories.jobs import JobRepository

router = APIRouter(prefix="/jobs", tags=["Jobs"])

@router.post("/", response_model=JobDescription)
async def create_job(
    job: JobDescriptionCreate,
    current_user: User = Depends(require_talent_manager_or_admin),
    repo: JobRepository = Depends(JobRepository)
):
    return await repo.create(job, current_user.id)

@router.get("/", response_model=List[JobDescription])
async def get_jobs(repo: JobRepository = Depends(JobRepository)):
    return await repo.get_all()