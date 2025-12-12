"""
Jobs Router
"""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional

from app.core.models import User, UserRole
from app.core.auth import get_current_user, require_recruiter_or_admin
from app.modules.jobs.repository import JobRepository
from app.modules.jobs.models import JobDescription, JobDescriptionCreate, JobDescriptionUpdate

router = APIRouter(prefix="/jobs", tags=["jobs"])
repo = JobRepository()

@router.get("/", response_model=List[JobDescription])
async def get_jobs(
    status: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    """Get all JDs. Consultants see only OPEN, Recruiters see all."""
    if current_user.role == UserRole.CONSULTANT:
        return await repo.get_all(status="OPEN")
    return await repo.get_all(status=status)

@router.post("/", response_model=JobDescription)
async def create_job(
    jd_data: JobDescriptionCreate,
    current_user: User = Depends(require_recruiter_or_admin)
):
    """Create a new JD (Recruiter only)"""
    return await repo.create(jd_data, current_user.id)

@router.get("/{jd_id}", response_model=JobDescription)
async def get_job(
    jd_id: str,
    current_user: User = Depends(get_current_user)
):
    """Get JD details"""
    jd = await repo.get_by_id(jd_id)
    if not jd:
        raise HTTPException(status_code=404, detail="Job not found")
    return jd

@router.put("/{jd_id}", response_model=JobDescription)
async def update_job(
    jd_id: str,
    jd_data: JobDescriptionUpdate,
    current_user: User = Depends(require_recruiter_or_admin)
):
    """Update JD (Recruiter only)"""
    try:
        updated_jd = await repo.update(jd_id, jd_data, current_user.id)
        if not updated_jd:
            raise HTTPException(status_code=404, detail="Job not found or unauthorized")
        return updated_jd
    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e))

