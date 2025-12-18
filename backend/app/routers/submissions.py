from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.submissions import SubmissionCreate, SubmissionResponse, SubmissionUpdate
from app.models.users import User, UserRole
from app.repositories.submissions import SubmissionRepository
from app.dependencies import get_current_active_user, get_current_manager

router = APIRouter()
sub_repo = SubmissionRepository()

@router.post("/apply", response_model=SubmissionResponse)
def apply_for_job(
    sub_in: SubmissionCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_active_user)
):
    """
    Candidate: Apply for a job.
    Auto-attaches the resume from the user's profile.
    """
    if current_user.role != UserRole.CANDIDATE:
         raise HTTPException(status_code=403, detail="Only candidates can apply")
    
    # ✅ 1. Logic Check: Does the user have a resume?
    # (Assuming your User model has a 'resume_path' or similar field)
    # If your User model stores it elsewhere, adjust this check.
    if not current_user.resume_path: 
        raise HTTPException(
            status_code=400, 
            detail="Please upload your resume in the Profile section before applying."
        )

    # ✅ 2. Create Submission
    try:
        # Pass the existing resume path to the repository
        return sub_repo.create(
            db, 
            sub_in, 
            candidate_id=current_user.id, 
            resume_path=current_user.resume_path
        )
    except ValueError as e:
        # Handle cases like "Already applied"
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
    # Optional: Verify manager owns the job here if needed
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