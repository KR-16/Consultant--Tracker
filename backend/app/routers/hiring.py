from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.users import User, UserRole, CandidateAssignment
from app.schemas.users import UserResponse
from app.dependencies import get_current_user

router = APIRouter()

@router.get("/my-candidates", response_model=List[UserResponse])
def get_assigned_candidates(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Security: Ensure user is a Hiring Manager (or Admin)
    if current_user.role != UserRole.HIRING_MANAGER and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized")

    # 2. Query the assignment table for this manager's ID
    assignments = db.query(CandidateAssignment).filter(
        CandidateAssignment.manager_id == current_user.id
    ).all()

    # 3. Get the list of Candidate IDs
    candidate_ids = [a.candidate_id for a in assignments]

    # 4. Fetch the actual Candidate User objects
    if not candidate_ids:
        return []

    candidates = db.query(User).filter(User.id.in_(candidate_ids)).all()
    return candidates