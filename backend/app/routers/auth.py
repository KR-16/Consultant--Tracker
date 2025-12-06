from fastapi import APIRouter, HTTPException, Depends, status, Body
from fastapi.security import HTTPBearer
from datetime import timedelta
import logging
import uuid
from pydantic import BaseModel, EmailStr
from app.models import User, UserCreate, Token, UserRole, UserResponse
from app.repositories.users import UserRepository
from app.auth import authenticate_user, create_access_token, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES, get_password_hash
from app.db import get_database

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["authentication"])

# --- Local Schemas ---

class LoginRequest(BaseModel):
    identifier: str  # Can be email or name
    password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

# --- Dependencies ---

def get_user_repository():
    return UserRepository()

# --- Endpoints ---

@router.post("/register", response_model=UserResponse)
async def register(
    user_data: UserCreate,
    repo: UserRepository = Depends(get_user_repository)
):
    """Register a new user (Candidate, Talent Manager, or Admin)"""
    logger.info(f"Registration request: {user_data.email}, Role: {user_data.role}")
    
    try:
        # Create user via repository
        user = await repo.create(user_data)
        
        # Prepare response
        user_dict = user.dict()
        if "hashed_password" in user_dict:
            del user_dict["hashed_password"]
            
        return UserResponse(**user_dict)
            
    except ValueError as e:
        logger.warning(f"Registration validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Registration error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail="Registration failed")

@router.post("/login", response_model=Token)
async def login(
    login_data: LoginRequest,
    db_conn = Depends(get_database)
):
    """Login user with Email OR Username"""
    logger.info(f"Login attempt for identifier: {login_data.identifier}")
    
    try:
        # Step 1: Find the user by Email OR Username
        # This allows users to login with either their unique name or email
        user_doc = await db_conn["users"].find_one({
            "$or": [
                {"email": login_data.identifier},
                {"name": login_data.identifier}
            ]
        })

        if not user_doc:
            logger.warning(f"User not found for identifier {login_data.identifier}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username/email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Step 2: Authenticate using the found email
        found_email = user_doc["email"]
        
        # This will verify password hash
        user = await authenticate_user(found_email, login_data.password)
        if not user:
             raise HTTPException(status_code=401, detail="Incorrect username/email or password")
        
        # Step 3: Check if user is active
        if not user.is_active:
            raise HTTPException(status_code=401, detail="User account is deactivated")
        
        # Step 4: Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
        # Note: We can include the role in the token claims if needed by frontend
        access_token = create_access_token(
            data={"sub": user.email, "role": user.role}, 
            expires_delta=access_token_expires
        )
        
        logger.info(f"Login successful: {user.email} ({user.role})")
        return {"access_token": access_token, "token_type": "bearer"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Login failed")

# --- Password Management ---

@router.post("/forgot-password")
async def forgot_password(
    request: ForgotPasswordRequest,
    db_conn = Depends(get_database)
):
    """Generates a password reset token (Mock Implementation)"""
    logger.info(f"Password reset requested for: {request.email}")
    
    user = await db_conn["users"].find_one({"email": request.email})
    if not user:
        return {"message": "If an account exists, you will receive instructions."}

    reset_token = str(uuid.uuid4())
    
    await db_conn["users"].update_one(
        {"email": request.email},
        {"$set": {"reset_token": reset_token}}
    )

    # Mock Email Log
    reset_link = f"http://localhost:3000/reset-password?token={reset_token}"
    logger.warning(f"\n\n[MOCK EMAIL] Reset Link for {request.email}: {reset_link}\n\n")

    return {"message": "If an account exists, you will receive instructions."}

@router.post("/reset-password")
async def reset_password(
    request: ResetPasswordRequest,
    db_conn = Depends(get_database)
):
    """Resets password using token"""
    user = await db_conn["users"].find_one({"reset_token": request.token})
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    hashed_password = get_password_hash(request.new_password)

    await db_conn["users"].update_one(
        {"_id": user["_id"]},
        {
            "$set": {"hashed_password": hashed_password},
            "$unset": {"reset_token": ""}
        }
    )
    
    return {"message": "Password reset successfully"}

# --- Utility Endpoints ---

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    try:
        user_dict = current_user.dict()
        if "hashed_password" in user_dict:
            del user_dict["hashed_password"]
        return UserResponse(**user_dict)
    except Exception as e:
        logger.error(f"Error getting user info: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve info")

@router.post("/refresh", response_model=Token)
async def refresh_token(current_user: User = Depends(get_current_user)):
    """Refresh access token"""
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": current_user.email, "role": current_user.role}, 
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/logout")
async def logout():
    return {"message": "Successfully logged out"}

# --- Admin User Management ---

@router.get("/users", response_model=list[UserResponse])
async def get_all_users(
    skip: int = 0,
    limit: int = 100,
    role: UserRole = None,
    current_user: User = Depends(get_current_user),
    repo: UserRepository = Depends(get_user_repository)
):
    """Get all users (Admin only)"""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required")
        
    return await repo.get_all(skip=skip, limit=limit, role=role)

@router.post("/users", response_model=UserResponse)
async def create_user_admin(
    user_data: UserCreate,
    current_user: User = Depends(get_current_user),
    repo: UserRepository = Depends(get_user_repository)
):
    """Create a new user manually (Admin only)"""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required")
        
    try:
        user = await repo.create(user_data)
        user_dict = user.dict()
        if "hashed_password" in user_dict:
            del user_dict["hashed_password"]
        return UserResponse(**user_dict)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))