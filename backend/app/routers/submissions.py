from fastapi import APIRouter, Depends
from typing import List
from app.models import Submission, SubmissionCreate, User
from app.auth import get_current_user, require_talent_manager_or_admin
from app.repositories.submissions import SubmissionRepository
from app.repositories.jobs import JobRepository

router = APIRouter(prefix="/submissions", tags=["Submissions"])

@router.get("/", response_model=List[Submission])
async def get_submissions(
    current_user: User = Depends(require_talent_manager_or_admin),
    repo: SubmissionRepository = Depends(SubmissionRepository)
):
    return await repo.get_all()

@router.post("/", response_model=Submission)
async def create_submission(
    submission: SubmissionCreate,
    current_user: User = Depends(require_talent_manager_or_admin),
    repo: SubmissionRepository = Depends(SubmissionRepository),
    job_repo: JobRepository = Depends(JobRepository)
):
    # Verify Job exists
    # job = await job_repo.get_by_id(submission.job_id) 
    # For now assuming job exists or front-end handles it
    
    return await repo.create(submission, submission.candidate_id, current_user.id)