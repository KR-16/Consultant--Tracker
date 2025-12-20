from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.dependencies import get_current_admin
from app.models.users import User, UserRole, CandidateAssignment
from app.schemas.users import UserResponse, AssignmentCreate, AssignmentResponse

router = APIRouter()

@router.get("/users", response_model=List[UserResponse])
def get_all_users(
    role: str = None, 
    db: Session = Depends(get_db), 
    _: User = Depends(get_current_admin)  
):
    """
    List all users, optionally filtered by role.
    The dependency `get_current_admin` ensures only Admins can access this.
    """
    query = db.query(User)
    if role:
        query = query.filter(User.role == role)
    return query.all()

@router.post("/assign", response_model=AssignmentResponse)
def assign_candidate_to_manager(
    assignment: AssignmentCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin) 
):
    """
    Assign a Candidate to a Hiring Manager.
    Only Admins can perform this action.
    """
    manager = db.query(User).filter(User.id == assignment.manager_id, User.role == UserRole.HIRING_MANAGER).first()
    if not manager:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Hiring Manager not found"
        )

    candidate = db.query(User).filter(User.id == assignment.candidate_id, User.role == UserRole.CANDIDATE).first()
    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Candidate not found"
        )

    existing = db.query(CandidateAssignment).filter(CandidateAssignment.candidate_id == assignment.candidate_id).first()
    if existing:
        existing.manager_id = assignment.manager_id
        db.commit()
        db.refresh(existing)
        return existing

    new_assignment = CandidateAssignment(manager_id=assignment.manager_id, candidate_id=assignment.candidate_id)
    db.add(new_assignment)
    db.commit()
    db.refresh(new_assignment)
    return new_assignment