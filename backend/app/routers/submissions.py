from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

from app.db.session import get_db
from app.dependencies import get_current_user, get_current_hiring_manager
from app.models.submissions import Submission
from app.models.users import User, UserRole, CandidateAssignment
from app.schemas.submissions import SubmissionCreate, SubmissionResponse, SubmissionUpdateStatus
from app.repositories.submissions import submission_repo

router = APIRouter()

@router.get("/my-applications", response_model=List[SubmissionResponse])
def get_my_applications(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Fetch all applications for the logged-in candidate.
    """
    return submission_repo.get_submissions_by_candidate(
        db=db, 
        candidate_id=current_user.id, 
        skip=skip, 
        limit=limit
    )

@router.post("/apply", response_model=SubmissionResponse)
def apply_to_job(
    submission: SubmissionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.CANDIDATE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Only candidates can apply"
        )

    new_submission = Submission(
        candidate_id=current_user.id,
        job_id=submission.job_id,
        resume_used=getattr(submission, "resume_id", None) or getattr(submission, "resume_used", None),
        timeline_history=[{"stage": "Applied", "date": str(datetime.now()), "notes": "Initial Application"}]
    )
    db.add(new_submission)
    db.commit()
    db.refresh(new_submission)
    return new_submission

@router.put("/{id}/stage", response_model=SubmissionResponse)
def update_application_stage(
    id: int,
    status_update: SubmissionUpdateStatus,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_hiring_manager)
):
    submission = db.query(Submission).filter(Submission.id == id).first()
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Submission not found"
        )

    if current_user.role == UserRole.HIRING_MANAGER:
        assignment = db.query(CandidateAssignment).filter(
            CandidateAssignment.manager_id == current_user.id,
            CandidateAssignment.candidate_id == submission.candidate_id
        ).first()
        
        if not assignment:
             raise HTTPException(
                 status_code=status.HTTP_403_FORBIDDEN, 
                 detail="Not authorized to manage this candidate"
             )

    submission.status = status_update.current_status
    if status_update.notes:
        submission.manager_notes = status_update.notes
    
    new_event = {
        "stage": status_update.current_status,
        "date": str(datetime.now()),
        "notes": status_update.notes or ""
    }
    
    
    history = list(submission.timeline_history) if submission.timeline_history else []
    history.append(new_event)
    submission.timeline_history = history

    db.commit()
    db.refresh(submission)
    return submission