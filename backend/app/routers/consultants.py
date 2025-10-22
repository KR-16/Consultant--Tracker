from fastapi import APIRouter, HTTPException, Depends, Query, UploadFile, File
from typing import List, Optional
from app.models import (
    Consultant, ConsultantCreate, ConsultantUpdate, ConsultantFilters,
    Submission, SubmissionCreate, SubmissionUpdate, SubmissionFilters,
    SubmissionStatusUpdate, StatusHistory
)
from app.repositories.consultants import ConsultantRepository
from app.repositories.submissions import SubmissionRepository
import csv
import io

router = APIRouter()

# Dependency to get repository
def get_consultant_repository():
    return ConsultantRepository()

def get_submission_repository():
    return SubmissionRepository()

# Consultant endpoints
@router.post("/", response_model=Consultant)
async def create_consultant(
    consultant: ConsultantCreate,
    repo: ConsultantRepository = Depends(get_consultant_repository)
):
    """Create a new consultant"""
    # Check if email already exists
    existing = await repo.get_by_email(consultant.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")
    
    return await repo.create(consultant)

@router.get("/", response_model=List[Consultant])
async def get_consultants(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    tech_stack: Optional[List[str]] = Query(None),
    available: Optional[bool] = Query(None),
    location: Optional[str] = Query(None),
    visa_status: Optional[str] = Query(None),
    rating: Optional[str] = Query(None),
    experience_min: Optional[int] = Query(None, ge=0),
    experience_max: Optional[int] = Query(None, le=50),
    repo: ConsultantRepository = Depends(get_consultant_repository)
):
    """Get all consultants with optional filters"""
    # Convert empty strings to None for enum fields
    visa_status_filter = visa_status if visa_status and visa_status.strip() else None
    rating_filter = rating if rating and rating.strip() else None
    location_filter = location if location and location.strip() else None
    
    filters = ConsultantFilters(
        tech_stack=tech_stack,
        available=available,
        location=location_filter,
        visa_status=visa_status_filter,
        rating=rating_filter,
        experience_min=experience_min,
        experience_max=experience_max
    )
    
    return await repo.get_all(filters, skip, limit)

@router.get("/{consultant_id}", response_model=Consultant)
async def get_consultant(
    consultant_id: str,
    repo: ConsultantRepository = Depends(get_consultant_repository)
):
    """Get a specific consultant by ID"""
    consultant = await repo.get_by_id(consultant_id)
    if not consultant:
        raise HTTPException(status_code=404, detail="Consultant not found")
    return consultant

@router.put("/{consultant_id}", response_model=Consultant)
async def update_consultant(
    consultant_id: str,
    consultant_update: ConsultantUpdate,
    repo: ConsultantRepository = Depends(get_consultant_repository)
):
    """Update a consultant"""
    consultant = await repo.update(consultant_id, consultant_update)
    if not consultant:
        raise HTTPException(status_code=404, detail="Consultant not found")
    return consultant

@router.delete("/{consultant_id}")
async def delete_consultant(
    consultant_id: str,
    repo: ConsultantRepository = Depends(get_consultant_repository)
):
    """Delete a consultant"""
    success = await repo.delete(consultant_id)
    if not success:
        raise HTTPException(status_code=404, detail="Consultant not found")
    return {"message": "Consultant deleted successfully"}

@router.post("/import-csv")
async def import_consultants_csv(
    file: UploadFile = File(...),
    repo: ConsultantRepository = Depends(get_consultant_repository)
):
    """Import consultants from CSV file"""
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="File must be a CSV")
    
    content = await file.read()
    csv_content = content.decode('utf-8')
    csv_reader = csv.DictReader(io.StringIO(csv_content))
    
    imported_count = 0
    errors = []
    
    for row_num, row in enumerate(csv_reader, start=2):  # Start at 2 because of header
        try:
            # Map CSV columns to consultant fields
            consultant_data = ConsultantCreate(
                name=row.get('name', ''),
                experience_years=int(row.get('experience_years', 0)),
                tech_stack=row.get('tech_stack', '').split(',') if row.get('tech_stack') else [],
                available=row.get('available', 'true').lower() == 'true',
                location=row.get('location', ''),
                visa_status=row.get('visa_status', 'OTHER'),
                rating=row.get('rating', 'AVERAGE'),
                email=row.get('email', ''),
                phone=row.get('phone', ''),
                notes=row.get('notes', '')
            )
            
            # Check if email already exists
            existing = await repo.get_by_email(consultant_data.email)
            if existing:
                errors.append(f"Row {row_num}: Email {consultant_data.email} already exists")
                continue
            
            await repo.create(consultant_data)
            imported_count += 1
            
        except Exception as e:
            errors.append(f"Row {row_num}: {str(e)}")
    
    return {
        "imported_count": imported_count,
        "errors": errors,
        "message": f"Successfully imported {imported_count} consultants"
    }

@router.get("/export/csv")
async def export_consultants_csv(
    repo: ConsultantRepository = Depends(get_consultant_repository)
):
    """Export all consultants to CSV"""
    consultants = await repo.get_all()
    
    output = io.StringIO()
    fieldnames = [
        'id', 'name', 'experience_years', 'tech_stack', 'available', 
        'location', 'visa_status', 'rating', 'email', 'phone', 'notes',
        'created_at', 'updated_at'
    ]
    
    writer = csv.DictWriter(output, fieldnames=fieldnames)
    writer.writeheader()
    
    for consultant in consultants:
        row = consultant.dict()
        row['tech_stack'] = ','.join(row['tech_stack'])
        writer.writerow(row)
    
    csv_content = output.getvalue()
    output.close()
    
    return {
        "csv_content": csv_content,
        "filename": "consultants_export.csv"
    }
