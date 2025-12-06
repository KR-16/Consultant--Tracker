from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.models import CandidateProfile, CandidateProfileCreate, User, UserRole
from app.auth import get_current_user, require_talent_manager_or_admin
from app.repositories.candidates import CandidateRepository

router = APIRouter(prefix="/candidates", tags=["Candidates"])

@router.get("/", response_model=List[CandidateProfile])
async def get_all_candidates(
    current_user: User = Depends(require_talent_manager_or_admin),
    repo: CandidateRepository = Depends(CandidateRepository)
):
    """Talent Managers see all candidates"""
    return await repo.get_all_profiles()

@router.post("/profile", response_model=CandidateProfile)
async def create_my_profile(
    profile: CandidateProfileCreate,
    current_user: User = Depends(get_current_user),
    repo: CandidateRepository = Depends(CandidateRepository)
):
    """Candidates create their own profile"""
    if current_user.role != UserRole.CANDIDATE:
        raise HTTPException(status_code=403, detail="Only candidates have profiles")
    return await repo.create_profile(profile, current_user.id)