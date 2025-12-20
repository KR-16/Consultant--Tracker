from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List
import shutil
import os

from app.db.session import get_db
from app.dependencies import get_current_user
from app.models.users import User, UserRole, CandidateProfile
from app.models.resumes import Resume
from app.schemas.users import CandidateProfileUpdate, CandidateProfileResponse
from app.schemas.resumes import ResumeResponse

router = APIRouter()

@router.put("/profile", response_model=CandidateProfileResponse)
def update_candidate_profile(
    profile_data: CandidateProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != UserRole.CANDIDATE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Only candidates can update profiles"
        )

    if profile_data.first_name is not None:
        current_user.first_name = profile_data.first_name
    if profile_data.last_name is not None:
        current_user.last_name = profile_data.last_name
    if profile_data.phone is not None:
        current_user.phone = profile_data.phone


    profile = db.query(CandidateProfile).filter(CandidateProfile.user_id == current_user.id).first()

    if not profile:
        profile = CandidateProfile(user_id=current_user.id)
        db.add(profile)
    
    profile_fields = ["current_city", "visa_status", "experience_level", "primary_skills"]
    
    data_dict = profile_data.dict(exclude_unset=True)
    
    for key, value in data_dict.items():
        if key in profile_fields:
            setattr(profile, key, value)
    
    db.commit()
    db.refresh(profile)
 
    return profile

@router.post("/resumes", response_model=ResumeResponse)
async def upload_resume(
    file: UploadFile = File(...),
    is_primary: bool = Form(False),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Upload resume with Max 2 limit"""
    if current_user.role != UserRole.CANDIDATE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Not authorized"
        )

    count = db.query(Resume).filter(Resume.user_id == current_user.id).count()
    if count >= 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Maximum 2 resumes allowed. Please delete one to upload new."
        )

    upload_dir = f"uploads/{current_user.id}"
    os.makedirs(upload_dir, exist_ok=True)
    file_location = f"{upload_dir}/{file.filename}"
    
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    new_resume = Resume(
        user_id=current_user.id,
        file_name=file.filename,
        file_url=file_location,
        is_primary=is_primary
    )
    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)
    return new_resume

@router.get("/resumes", response_model=List[ResumeResponse])
def get_my_resumes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Resume).filter(Resume.user_id == current_user.id).all()

@router.delete("/resumes/{resume_id}")
def delete_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a resume by ID"""
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Resume not found"
        )
    
    if os.path.exists(resume.file_url):
        try:
            os.remove(resume.file_url)
        except Exception as e:
            print(f"Error deleting file {resume.file_url}: {e}")

    db.delete(resume)
    db.commit()
    
    return {"message": "Resume deleted successfully"}