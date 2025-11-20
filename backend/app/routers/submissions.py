from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from typing import List, Optional
import shutil
import os
from pathlib import Path
from app.models import User, UserRole, Submission, SubmissionCreate, SubmissionUpdate, SubmissionStatus
from app.auth import get_current_user, require_recruiter_or_admin, require_role
from app.repositories.submissions import SubmissionRepository
from app.repositories.jobs import JobRepository

router = APIRouter(prefix="/submissions", tags=["submissions"])
repo = SubmissionRepository()
job_repo = JobRepository()

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@router.post("/", response_model=Submission)
async def create_submission(
    jd_id: str = Form(...),
    comments: Optional[str] = Form(None),
    resume: UploadFile = File(...),
    current_user: User = Depends(require_role(UserRole.CONSULTANT))
):
    """Submit an application (Consultant only)"""
    # Verify JD exists
    jd = await job_repo.get_by_id(jd_id)
    if not jd:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if jd.status != "OPEN":
        raise HTTPException(status_code=400, detail="Job is not open for applications")

    # Save resume
    try:
        file_ext = os.path.splitext(resume.filename)[1]
        filename = f"{current_user.id}_{jd_id}_{os.urandom(4).hex()}{file_ext}"
        file_path = UPLOAD_DIR / filename
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(resume.file, buffer)
            
        submission_data = SubmissionCreate(jd_id=jd_id, comments=comments)
        return await repo.create(submission_data, current_user.id, jd.recruiter_id, str(file_path))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing submission: {str(e)}")

@router.get("/me", response_model=List[Submission])
async def get_my_submissions(current_user: User = Depends(require_role(UserRole.CONSULTANT))):
    """Get my submissions (Consultant only)"""
    return await repo.get_by_consultant(current_user.id)

@router.get("/", response_model=List[Submission])
async def get_all_submissions(
    current_user: User = Depends(require_recruiter_or_admin)
):
    """Get all submissions (Recruiter only)"""
    # If admin, see all. If recruiter, see only for their JDs?
    # Requirement says "See all submissions (for all consultants & all JDs)" for Recruiter.
    # But usually recruiters only see their own. The prompt says "See all submissions".
    # Let's assume they can see all for now as per prompt "See all submissions".
    return await repo.get_all() 

@router.put("/{submission_id}/status", response_model=Submission)
async def update_submission_status(
    submission_id: str,
    status_update: SubmissionUpdate,
    current_user: User = Depends(require_recruiter_or_admin)
):
    """Update submission status (Recruiter only)"""
    if not status_update.status:
        raise HTTPException(status_code=400, detail="Status is required")
        
    submission = await repo.get_by_id(submission_id)
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
        
    # Check if recruiter owns the JD? 
    # Prompt says "Trigger/see status changes".
    # We'll allow any recruiter to update for now based on "See all submissions".
    
    return await repo.update_status(submission_id, status_update.status, current_user.id)
