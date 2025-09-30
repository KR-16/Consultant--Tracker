from fastapi import APIRouter, HTTPException, Depends, Query, UploadFile, File
from typing import List, Optional
from datetime import datetime
from app.models import (
    Submission, SubmissionCreate, SubmissionUpdate, SubmissionFilters,
    SubmissionStatusUpdate, StatusHistory
)
from app.repositories.submissions import SubmissionRepository
from app.repositories.consultants import ConsultantRepository
import csv
import io

router = APIRouter()

# Dependency to get repository
def get_submission_repository():
    return SubmissionRepository()

def get_consultant_repository():
    return ConsultantRepository()

# Submission endpoints
@router.post("/", response_model=Submission)
async def create_submission(
    submission: SubmissionCreate,
    submission_repo: SubmissionRepository = Depends(get_submission_repository),
    consultant_repo: ConsultantRepository = Depends(get_consultant_repository)
):
    """Create a new submission"""
    # Verify consultant exists
    consultant = await consultant_repo.get_by_id(submission.consultant_id)
    if not consultant:
        raise HTTPException(status_code=404, detail="Consultant not found")
    
    return await submission_repo.create(submission)

@router.get("/", response_model=List[Submission])
async def get_submissions(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    consultant_id: Optional[str] = Query(None),
    recruiter: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    client_or_job: Optional[str] = Query(None),
    date_from: Optional[datetime] = Query(None),
    date_to: Optional[datetime] = Query(None),
    repo: SubmissionRepository = Depends(get_submission_repository)
):
    """Get all submissions with optional filters"""
    filters = SubmissionFilters(
        consultant_id=consultant_id,
        recruiter=recruiter,
        status=status,
        client_or_job=client_or_job,
        date_from=date_from,
        date_to=date_to
    )
    
    return await repo.get_all(filters, skip, limit)

@router.get("/{submission_id}", response_model=Submission)
async def get_submission(
    submission_id: str,
    repo: SubmissionRepository = Depends(get_submission_repository)
):
    """Get a specific submission by ID"""
    submission = await repo.get_by_id(submission_id)
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    return submission

@router.put("/{submission_id}", response_model=Submission)
async def update_submission(
    submission_id: str,
    submission_update: SubmissionUpdate,
    repo: SubmissionRepository = Depends(get_submission_repository)
):
    """Update a submission"""
    submission = await repo.update(submission_id, submission_update)
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    return submission

@router.put("/{submission_id}/status", response_model=Submission)
async def update_submission_status(
    submission_id: str,
    status_update: SubmissionStatusUpdate,
    changed_by: str = Query(..., description="User who made the change"),
    repo: SubmissionRepository = Depends(get_submission_repository)
):
    """Update submission status with audit trail"""
    submission = await repo.update_status(
        submission_id, 
        status_update.status, 
        changed_by, 
        status_update.comments
    )
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    return submission

@router.delete("/{submission_id}")
async def delete_submission(
    submission_id: str,
    repo: SubmissionRepository = Depends(get_submission_repository)
):
    """Delete a submission"""
    success = await repo.delete(submission_id)
    if not success:
        raise HTTPException(status_code=404, detail="Submission not found")
    return {"message": "Submission deleted successfully"}

@router.get("/consultant/{consultant_id}", response_model=List[Submission])
async def get_submissions_by_consultant(
    consultant_id: str,
    repo: SubmissionRepository = Depends(get_submission_repository)
):
    """Get all submissions for a specific consultant"""
    return await repo.get_by_consultant(consultant_id)

@router.get("/{submission_id}/history", response_model=List[StatusHistory])
async def get_submission_status_history(
    submission_id: str,
    repo: SubmissionRepository = Depends(get_submission_repository)
):
    """Get status change history for a submission"""
    return await repo.get_status_history(submission_id)

@router.post("/import-csv")
async def import_submissions_csv(
    file: UploadFile = File(...),
    submission_repo: SubmissionRepository = Depends(get_submission_repository),
    consultant_repo: ConsultantRepository = Depends(get_consultant_repository)
):
    """Import submissions from CSV file"""
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="File must be a CSV")
    
    content = await file.read()
    csv_content = content.decode('utf-8')
    csv_reader = csv.DictReader(io.StringIO(csv_content))
    
    imported_count = 0
    errors = []
    
    for row_num, row in enumerate(csv_reader, start=2):  # Start at 2 because of header
        try:
            # Verify consultant exists
            consultant = await consultant_repo.get_by_id(row.get('consultant_id', ''))
            if not consultant:
                errors.append(f"Row {row_num}: Consultant not found")
                continue
            
            # Parse submitted_on date
            submitted_on = datetime.fromisoformat(row.get('submitted_on', ''))
            
            submission_data = SubmissionCreate(
                consultant_id=row.get('consultant_id', ''),
                client_or_job=row.get('client_or_job', ''),
                recruiter=row.get('recruiter', ''),
                submitted_on=submitted_on,
                status=row.get('status', 'SUBMITTED'),
                comments=row.get('comments', ''),
                attachment_path=row.get('attachment_path', '')
            )
            
            await submission_repo.create(submission_data)
            imported_count += 1
            
        except Exception as e:
            errors.append(f"Row {row_num}: {str(e)}")
    
    return {
        "imported_count": imported_count,
        "errors": errors,
        "message": f"Successfully imported {imported_count} submissions"
    }

@router.get("/export/csv")
async def export_submissions_csv(
    consultant_id: Optional[str] = Query(None),
    recruiter: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    date_from: Optional[datetime] = Query(None),
    date_to: Optional[datetime] = Query(None),
    repo: SubmissionRepository = Depends(get_submission_repository)
):
    """Export submissions to CSV with optional filters"""
    filters = SubmissionFilters(
        consultant_id=consultant_id,
        recruiter=recruiter,
        status=status,
        date_from=date_from,
        date_to=date_to
    )
    
    submissions = await repo.get_all(filters)
    
    output = io.StringIO()
    fieldnames = [
        'id', 'consultant_id', 'client_or_job', 'recruiter', 'submitted_on',
        'status', 'comments', 'attachment_path', 'created_at', 'updated_at'
    ]
    
    writer = csv.DictWriter(output, fieldnames=fieldnames)
    writer.writeheader()
    
    for submission in submissions:
        row = submission.dict()
        writer.writerow(row)
    
    csv_content = output.getvalue()
    output.close()
    
    return {
        "csv_content": csv_content,
        "filename": "submissions_export.csv"
    }
