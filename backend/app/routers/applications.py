from fastapi import APIRouter, HTTPException, Depends, Query, UploadFile, File
from fastapi.responses import FileResponse
from typing import List, Optional
from app.models import (
    Application, ApplicationCreate, ApplicationUpdate, ApplicationStatus,
    User, UserRole
)
from app.repositories.applications import ApplicationRepository
from app.auth import get_current_user, require_consultant_or_admin
from app.services.file_upload import file_upload_service
import os

router = APIRouter(prefix="/applications", tags=["applications"])

# Dependency to get repository
def get_application_repository():
    return ApplicationRepository()

@router.post("/", response_model=Application)
async def create_application(
    application_data: ApplicationCreate,
    current_user: User = Depends(require_consultant_or_admin),
    repo: ApplicationRepository = Depends(get_application_repository)
):
    """Create a new application"""
    # Set consultant_id to current user if not admin
    if current_user.role == UserRole.CONSULTANT:
        application_data.consultant_id = current_user.id
    
    try:
        return await repo.create(application_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[Application])
async def get_applications(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    job_id: Optional[str] = Query(None),
    consultant_id: Optional[str] = Query(None),
    status: Optional[ApplicationStatus] = Query(None),
    current_user: User = Depends(get_current_user),
    repo: ApplicationRepository = Depends(get_application_repository)
):
    """Get applications with optional filters"""
    # Consultants can only see their own applications
    if current_user.role == UserRole.CONSULTANT and not consultant_id:
        consultant_id = current_user.id
    
    return await repo.get_all(skip=skip, limit=limit, job_id=job_id, consultant_id=consultant_id, status=status)

@router.get("/my-applications", response_model=List[Application])
async def get_my_applications(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(require_consultant_or_admin),
    repo: ApplicationRepository = Depends(get_application_repository)
):
    """Get current user's applications"""
    consultant_id = current_user.id
    return await repo.get_by_consultant(consultant_id, skip=skip, limit=limit)

@router.get("/job/{job_id}", response_model=List[Application])
async def get_job_applications(
    job_id: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user: User = Depends(get_current_user),
    repo: ApplicationRepository = Depends(get_application_repository)
):
    """Get all applications for a specific job"""
    return await repo.get_by_job(job_id, skip=skip, limit=limit)

@router.get("/{application_id}", response_model=Application)
async def get_application(
    application_id: str,
    current_user: User = Depends(get_current_user),
    repo: ApplicationRepository = Depends(get_application_repository)
):
    """Get a specific application"""
    application = await repo.get_by_id(application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Check permissions
    if current_user.role == UserRole.CONSULTANT and application.consultant_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return application

@router.put("/{application_id}", response_model=Application)
async def update_application(
    application_id: str,
    application_data: ApplicationUpdate,
    current_user: User = Depends(get_current_user),
    repo: ApplicationRepository = Depends(get_application_repository)
):
    """Update an application"""
    application = await repo.get_by_id(application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Check permissions
    if current_user.role == UserRole.CONSULTANT and application.consultant_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    updated_application = await repo.update(application_id, application_data)
    if not updated_application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    return updated_application

@router.put("/{application_id}/status", response_model=Application)
async def update_application_status(
    application_id: str,
    status: ApplicationStatus,
    current_user: User = Depends(get_current_user),
    repo: ApplicationRepository = Depends(get_application_repository)
):
    """Update application status"""
    application = await repo.get_by_id(application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Check permissions - only recruiters/admins can update status
    if current_user.role == UserRole.CONSULTANT:
        raise HTTPException(status_code=403, detail="Access denied")
    
    updated_application = await repo.update_status(application_id, status, current_user.id)
    if not updated_application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    return updated_application

@router.post("/{application_id}/withdraw")
async def withdraw_application(
    application_id: str,
    current_user: User = Depends(require_consultant_or_admin),
    repo: ApplicationRepository = Depends(get_application_repository)
):
    """Withdraw an application"""
    application = await repo.get_by_id(application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Check permissions
    if current_user.role == UserRole.CONSULTANT and application.consultant_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    success = await repo.withdraw_application(application_id)
    if not success:
        raise HTTPException(status_code=404, detail="Application not found")
    
    return {"message": "Application withdrawn successfully"}

@router.delete("/{application_id}")
async def delete_application(
    application_id: str,
    current_user: User = Depends(get_current_user),
    repo: ApplicationRepository = Depends(get_application_repository)
):
    """Delete an application"""
    application = await repo.get_by_id(application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Check permissions
    if current_user.role == UserRole.CONSULTANT and application.consultant_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    success = await repo.delete(application_id)
    if not success:
        raise HTTPException(status_code=404, detail="Application not found")
    
    return {"message": "Application deleted successfully"}

@router.get("/stats/summary")
async def get_application_stats(
    consultant_id: Optional[str] = Query(None),
    job_id: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    repo: ApplicationRepository = Depends(get_application_repository)
):
    """Get application statistics"""
    # Consultants can only see their own stats
    if current_user.role == UserRole.CONSULTANT and not consultant_id:
        consultant_id = current_user.id
    
    return await repo.get_application_stats(consultant_id=consultant_id, job_id=job_id)

@router.post("/{application_id}/upload-resume")
async def upload_resume(
    application_id: str,
    file: UploadFile = File(...),
    current_user: User = Depends(require_consultant_or_admin),
    repo: ApplicationRepository = Depends(get_application_repository)
):
    """Upload resume for an application"""
    application = await repo.get_by_id(application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Check permissions
    if current_user.role == UserRole.CONSULTANT and application.consultant_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    try:
        # Upload file
        file_path = await file_upload_service.upload_resume(file, current_user.id, application_id)
        
        # Update application with resume path
        update_data = ApplicationUpdate(resume_path=file_path)
        updated_application = await repo.update(application_id, update_data)
        
        if not updated_application:
            raise HTTPException(status_code=404, detail="Application not found")
        
        return {
            "message": "Resume uploaded successfully",
            "file_path": file_path,
            "filename": file.filename,
            "application_id": application_id
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading resume: {str(e)}")

@router.get("/{application_id}/resume")
async def download_resume(
    application_id: str,
    current_user: User = Depends(get_current_user),
    repo: ApplicationRepository = Depends(get_application_repository)
):
    """Download resume for an application"""
    application = await repo.get_by_id(application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Check permissions
    if current_user.role == UserRole.CONSULTANT and application.consultant_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    if not application.resume_path:
        raise HTTPException(status_code=404, detail="No resume uploaded for this application")
    
    try:
        full_path = await file_upload_service.get_resume_path(application.resume_path)
        
        if not os.path.exists(full_path):
            raise HTTPException(status_code=404, detail="Resume file not found")
        
        return FileResponse(
            path=full_path,
            filename=os.path.basename(application.resume_path),
            media_type='application/pdf'
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error downloading resume: {str(e)}")

@router.delete("/{application_id}/resume")
async def delete_resume(
    application_id: str,
    current_user: User = Depends(require_consultant_or_admin),
    repo: ApplicationRepository = Depends(get_application_repository)
):
    """Delete resume for an application"""
    application = await repo.get_by_id(application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Check permissions
    if current_user.role == UserRole.CONSULTANT and application.consultant_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    if not application.resume_path:
        raise HTTPException(status_code=404, detail="No resume uploaded for this application")
    
    try:
        # Delete file from disk
        await file_upload_service.delete_resume(application.resume_path)
        
        # Update application to remove resume path
        update_data = ApplicationUpdate(resume_path=None)
        updated_application = await repo.update(application_id, update_data)
        
        if not updated_application:
            raise HTTPException(status_code=404, detail="Application not found")
        
        return {"message": "Resume deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting resume: {str(e)}")

@router.get("/{application_id}/resume-info")
async def get_resume_info(
    application_id: str,
    current_user: User = Depends(get_current_user),
    repo: ApplicationRepository = Depends(get_application_repository)
):
    """Get resume file information for an application"""
    application = await repo.get_by_id(application_id)
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Check permissions
    if current_user.role == UserRole.CONSULTANT and application.consultant_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    if not application.resume_path:
        return {"exists": False, "message": "No resume uploaded"}
    
    try:
        resume_info = await file_upload_service.get_resume_info(application.resume_path)
        return resume_info
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting resume info: {str(e)}")
