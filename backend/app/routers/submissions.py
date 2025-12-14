from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.submissions import SubmissionCreate, SubmissionResponse, SubmissionUpdate
from app.models.users import User, UserRole
from app.models.submissions import SubmissionStatus
from app.repositories.submissions import SubmissionRepository
from app.dependencies import get_current_active_user, get_current_manager
from app.services.ats_service import ATSService

router = APIRouter()
sub_repo = SubmissionRepository()

@router.post("/apply", response_model=SubmissionResponse)
def apply_for_job(
    sub_in: SubmissionCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_active_user)
):
    if current_user.role != UserRole.CANDIDATE:
         raise HTTPException(status_code=400, detail="Only candidates can apply")
         
    try:
        return sub_repo.create(db, sub_in, candidate_id=current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/my-applications", response_model=List[SubmissionResponse])
def get_my_applications(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_active_user)
):
    """Candidate: View my history"""
    return sub_repo.get_by_candidate(db, current_user.id)

@router.get("/job/{job_id}", response_model=List[SubmissionResponse])
def get_job_submissions(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_manager)
):
    """Manager: View who applied to a specific job"""
    # TODO: Add check to ensure this manager owns this job
    return sub_repo.get_by_job(db, job_id)

@router.put("/{submission_id}/status", response_model=SubmissionResponse)
def update_submission_status(
    submission_id: int,
    update_data: SubmissionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_manager)
):
    """Manager: Update status (e.g., Interview) or ATS Score"""
    return sub_repo.update_status(db, submission_id, update_data.status, update_data.ats_score)

@router.post("/{submission_id}/calculate-ats")
def trigger_ats_score(
    submission_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_manager)
):
    """Manager: Manually trigger ATS calculation"""
    # 1. Fetch submission
    # 2. Fetch Job Description
    # 3. Calculate Score
    # 4. Update DB
    # For now, we return a mock success
    return {"message": "ATS Score calculated", "score": 85.5}