from fastapi import APIRouter, HTTPException, Depends, Query, UploadFile, File
from typing import List, Optional
from app.models import (
    JobDescription, JobDescriptionCreate, JobDescriptionUpdate, JobStatus,
    User, UserRole
)
from app.repositories.job_descriptions import JobDescriptionRepository
from app.auth import get_current_user, require_recruiter_or_admin

router = APIRouter(prefix="/jobs", tags=["job-descriptions"])

# Dependency to get repository
def get_job_repository():
    return JobDescriptionRepository()

@router.post("/", response_model=JobDescription)
async def create_job(
    job_data: JobDescriptionCreate,
    current_user: User = Depends(require_recruiter_or_admin),
    repo: JobDescriptionRepository = Depends(get_job_repository)
):
    """Create a new job description"""
    # Set recruiter_id to current user if not admin
    if current_user.role == UserRole.RECRUITER:
        job_data.recruiter_id = current_user.id
    
    return await repo.create(job_data)

@router.get("/", response_model=List[JobDescription])
async def get_jobs(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status: Optional[JobStatus] = Query(None),
    recruiter_id: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    repo: JobDescriptionRepository = Depends(get_job_repository)
):
    """Get job descriptions with optional filters"""
    # Recruiters can only see their own jobs unless admin
    if current_user.role == UserRole.RECRUITER and not recruiter_id:
        recruiter_id = current_user.id
    elif current_user.role == UserRole.CONSULTANT:
        # Consultants can only see open jobs
        status = JobStatus.OPEN
    
    return await repo.get_all(skip=skip, limit=limit, recruiter_id=recruiter_id, status=status)

@router.get("/open", response_model=List[JobDescription])
async def get_open_jobs(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    repo: JobDescriptionRepository = Depends(get_job_repository)
):
    """Get all open job descriptions"""
    return await repo.get_open_jobs(skip=skip, limit=limit)

@router.get("/search", response_model=List[JobDescription])
async def search_jobs(
    q: str = Query(..., min_length=1),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    repo: JobDescriptionRepository = Depends(get_job_repository)
):
    """Search job descriptions"""
    return await repo.search_jobs(q, skip=skip, limit=limit)

@router.get("/tech-stack", response_model=List[JobDescription])
async def get_jobs_by_tech_stack(
    tech_stack: List[str] = Query(...),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    repo: JobDescriptionRepository = Depends(get_job_repository)
):
    """Get jobs matching specific tech stack"""
    return await repo.get_jobs_by_tech_stack(tech_stack, skip=skip, limit=limit)

@router.get("/{job_id}", response_model=JobDescription)
async def get_job(
    job_id: str,
    current_user: User = Depends(get_current_user),
    repo: JobDescriptionRepository = Depends(get_job_repository)
):
    """Get a specific job description"""
    job = await repo.get_by_id(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Check permissions
    if current_user.role == UserRole.RECRUITER and job.recruiter_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    elif current_user.role == UserRole.CONSULTANT and job.status != JobStatus.OPEN:
        raise HTTPException(status_code=403, detail="Job is not available")
    
    return job

@router.put("/{job_id}", response_model=JobDescription)
async def update_job(
    job_id: str,
    job_data: JobDescriptionUpdate,
    current_user: User = Depends(require_recruiter_or_admin),
    repo: JobDescriptionRepository = Depends(get_job_repository)
):
    """Update a job description"""
    job = await repo.get_by_id(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Check permissions
    if current_user.role == UserRole.RECRUITER and job.recruiter_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    updated_job = await repo.update(job_id, job_data)
    if not updated_job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return updated_job

@router.delete("/{job_id}")
async def delete_job(
    job_id: str,
    current_user: User = Depends(require_recruiter_or_admin),
    repo: JobDescriptionRepository = Depends(get_job_repository)
):
    """Delete a job description"""
    job = await repo.get_by_id(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Check permissions
    if current_user.role == UserRole.RECRUITER and job.recruiter_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    success = await repo.delete(job_id)
    if not success:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return {"message": "Job deleted successfully"}

@router.post("/{job_id}/close")
async def close_job(
    job_id: str,
    current_user: User = Depends(require_recruiter_or_admin),
    repo: JobDescriptionRepository = Depends(get_job_repository)
):
    """Close a job description"""
    job = await repo.get_by_id(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Check permissions
    if current_user.role == UserRole.RECRUITER and job.recruiter_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    success = await repo.close_job(job_id)
    if not success:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return {"message": "Job closed successfully"}

@router.post("/{job_id}/fill")
async def fill_job(
    job_id: str,
    current_user: User = Depends(require_recruiter_or_admin),
    repo: JobDescriptionRepository = Depends(get_job_repository)
):
    """Mark job as filled"""
    job = await repo.get_by_id(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Check permissions
    if current_user.role == UserRole.RECRUITER and job.recruiter_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    success = await repo.fill_job(job_id)
    if not success:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return {"message": "Job marked as filled"}
