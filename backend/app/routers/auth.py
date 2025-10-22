from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer
from datetime import timedelta
from app.models import User, UserCreate, UserLogin, Token, UserRole
from app.repositories.users import UserRepository
from app.auth import authenticate_user, create_access_token, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES
from app.db import get_database

router = APIRouter(prefix="/auth", tags=["authentication"])

# Dependency to get user repository
def get_user_repository():
    return UserRepository()

@router.post("/register", response_model=User)
async def register(
    user_data: UserCreate,
    repo: UserRepository = Depends(get_user_repository)
):
    """Register a new user"""
    try:
        user = await repo.create(user_data)
        # Remove password from response
        user_dict = user.dict()
        del user_dict["hashed_password"]
        return User(**user_dict)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login", response_model=Token)
async def login(
    user_credentials: UserLogin,
    repo: UserRepository = Depends(get_user_repository)
):
    """Login user and return access token"""
    user = await authenticate_user(user_credentials.email, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is deactivated"
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=User)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    # Remove password from response
    user_dict = current_user.dict()
    del user_dict["hashed_password"]
    return User(**user_dict)

@router.post("/refresh", response_model=Token)
async def refresh_token(current_user: User = Depends(get_current_user)):
    """Refresh access token"""
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": current_user.email}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/logout")
async def logout():
    """Logout user (client should discard token)"""
    return {"message": "Successfully logged out"}

# Admin-only endpoints
@router.get("/users", response_model=list[User])
async def get_all_users(
    skip: int = 0,
    limit: int = 100,
    role: UserRole = None,
    current_user: User = Depends(get_current_user),
    repo: UserRepository = Depends(get_user_repository)
):
    """Get all users (Admin only)"""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    users = await repo.get_all(skip=skip, limit=limit, role=role)
    # Remove passwords from response
    for user in users:
        user_dict = user.dict()
        del user_dict["hashed_password"]
        user = User(**user_dict)
    
    return users

@router.post("/users", response_model=User)
async def create_user(
    user_data: UserCreate,
    current_user: User = Depends(get_current_user),
    repo: UserRepository = Depends(get_user_repository)
):
    """Create a new user (Admin only)"""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    try:
        user = await repo.create(user_data)
        # Remove password from response
        user_dict = user.dict()
        del user_dict["hashed_password"]
        return User(**user_dict)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
