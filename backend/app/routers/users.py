from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.models import UserResponse, UserCreate, UserRole, User
from app.auth import get_current_user, require_admin
from app.repositories.users import UserRepository

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/", response_model=List[UserResponse])
async def get_users(
    role: UserRole = None,
    current_user: User = Depends(require_admin),
    repo: UserRepository = Depends(UserRepository)
):
    return await repo.get_all(role=role)

@router.post("/", response_model=UserResponse)
async def create_user(
    user: UserCreate,
    current_user: User = Depends(require_admin),
    repo: UserRepository = Depends(UserRepository)
):
    try:
        return await repo.create(user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))