from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.models import User, UserRole, ConsultantProfile, ConsultantProfileUpdate
from app.auth import get_current_user, require_role, require_recruiter_or_admin
from app.repositories.consultants import ConsultantRepository
from app.db import get_database

router = APIRouter(prefix="/consultants", tags=["consultants"])
repo = ConsultantRepository()

@router.get("/me", response_model=ConsultantProfile)
async def get_my_profile(current_user: User = Depends(get_current_user)):
    """Get current consultant's profile"""
    if current_user.role != UserRole.CONSULTANT:
        raise HTTPException(status_code=403, detail="Only consultants have profiles")
        
    profile = await repo.get_by_user_id(current_user.id)
    if not profile:
       
        return await repo.create_or_update(current_user.id, ConsultantProfileUpdate(experience_years=0))
    return profile

@router.put("/me", response_model=ConsultantProfile)
async def update_my_profile(
    profile_data: ConsultantProfileUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update current consultant's profile"""
    if current_user.role != UserRole.CONSULTANT:
        raise HTTPException(status_code=403, detail="Only consultants can update their profile")
        
    return await repo.create_or_update(current_user.id, profile_data)

@router.get("/", response_model=List[ConsultantProfile])
async def get_all_consultants(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(require_recruiter_or_admin)
):
    """
    Get consultants.
    - If ADMIN: Returns all consultants.
    - If RECRUITER: Returns ONLY consultants who have applied to your jobs.
    """
    filter_ids = None

    if current_user.role == UserRole.RECRUITER:
        db = await get_database()
        
        my_jobs_cursor = db.job_descriptions.find({"recruiter_id": str(current_user.id)}, {"_id": 1})
        my_job_ids = [str(doc["_id"]) async for doc in my_jobs_cursor]
        
        if not my_job_ids:
            return [] 
            
        submissions_cursor = db.submissions.find({"jd_id": {"$in": my_job_ids}}, {"consultant_id": 1})
        
        applicant_ids = {doc["consultant_id"] async for doc in submissions_cursor}
        filter_ids = list(applicant_ids)
       
        if not filter_ids:
            return []

    return await repo.get_all(skip, limit, user_ids=filter_ids)

@router.get("/{user_id}", response_model=ConsultantProfile)
async def get_consultant_profile(
    user_id: str,
    current_user: User = Depends(require_recruiter_or_admin)
):
    """Get specific consultant profile (Recruiter only)"""
    profile = await repo.get_by_user_id(user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Consultant profile not found")
    return profile