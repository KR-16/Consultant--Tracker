from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.users import UserResponse, UserCreate
from app.models.users import User
from app.repositories.users import UserRepository
from app.dependencies import get_current_admin

router = APIRouter()
repo = UserRepository()

@router.get("/", response_model=List[UserResponse])
def get_all_users(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_admin)
):
    """Admin: Get all users"""
    # Simple query implementation (or use repo.get_all if you added it there)
    return db.query(User).offset(skip).limit(limit).all()

@router.post("/", response_model=UserResponse)
def create_user_admin(
    user_in: UserCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_admin)
):
    """Admin: Create a new user manually"""
    if repo.get_by_email(db, user_in.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    return repo.create(db, user_in)

@router.delete("/{user_id}")
def delete_user(
    user_id: int, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_admin)
):
    """Admin: Delete a user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}