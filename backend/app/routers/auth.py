from fastapi import APIRouter, HTTPException, Depends, status, Body
from fastapi.security import HTTPBearer
from datetime import timedelta
import logging
import uuid
from pydantic import BaseModel, EmailStr
from app.models import User, UserCreate, Token, UserRole, UserResponse
from app.repositories.users import UserRepository
from app.auth import authenticate_user, create_access_token, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES, get_password_hash
from app.db import get_database, db 

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["authentication"])

# --- Local Schemas to match Frontend Requirements ---

class LoginRequest(BaseModel):
    identifier: str  
    password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

# ---------------------------------------------------

# Dependency to get user repository
def get_user_repository():
    logger.debug("Creating UserRepository instance")
    return UserRepository()

@router.post("/register", response_model=UserResponse)
async def register(
    user_data: UserCreate,
    repo: UserRepository = Depends(get_user_repository)
):
    """Register a new user"""
    logger.info(f"Registration request received for email: {user_data.email}, role: {user_data.role}")
    
    try:
        # Step 1: Log registration attempt
        logger.debug(f"Step 1: Processing registration for email: {user_data.email}, name: {user_data.name}, role: {user_data.role}")
        
        # Step 2: Create user via repository
        logger.debug("Step 2: Calling repository.create() to create user")
        try:
            user = await repo.create(user_data)
            logger.info(f"User created successfully in repository: {user.email}, ID: {user.id}")
        except ValueError as e:
            logger.warning(f"User creation failed due to validation error: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Repository error during user creation: {str(e)}", exc_info=True)
            raise
        
        # Step 3: Prepare response (remove sensitive data)
        logger.debug("Step 3: Preparing response - removing password from user data")
        try:
            user_dict = user.dict()
            if "hashed_password" in user_dict:
                del user_dict["hashed_password"]
                logger.debug("Password removed from response")
            
            response_user = UserResponse(**user_dict)
            logger.info(f"Registration completed successfully for email: {user_data.email}, ID: {user.id}")
            return response_user
        except Exception as e:
            logger.error(f"Error preparing response: {str(e)}", exc_info=True)
            raise HTTPException(status_code=500, detail="Error preparing registration response")
            
    except ValueError as e:
        logger.warning(f"Registration validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        logger.debug("Re-raising HTTPException")
        raise
    except Exception as e:
        logger.error(f"Unexpected registration error: {str(e)}", exc_info=True)
        error_msg = str(e)
        raise HTTPException(status_code=400, detail=f"Registration failed: {error_msg}")

@router.post("/login", response_model=Token)
async def login(
    login_data: LoginRequest,
    repo: UserRepository = Depends(get_user_repository),
    db_conn = Depends(get_database) # Injected database dependency
):
    """Login user with Email OR Username"""
    logger.info(f"Login attempt for identifier: {login_data.identifier}")
    
    try:
        # Step 1: Find the user by Email OR Username
        logger.debug(f"Step 1: Searching for user with identifier: {login_data.identifier}")
        
        # Use injected db_conn instead of global db object
        user_doc = await db_conn["users"].find_one({
            "$or": [
                {"email": login_data.identifier},
                {"name": login_data.identifier}
            ]
        })

        if not user_doc:
            logger.warning(f"Authentication failed: User not found for identifier {login_data.identifier}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username/email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Step 2: Authenticate using the FOUND email
        found_email = user_doc["email"]
        logger.debug(f"User found. Authenticating with email: {found_email}")

        try:
            user = await authenticate_user(found_email, login_data.password)
            if not user:
                 raise HTTPException(status_code=401, detail="Incorrect username/email or password")
            
            logger.debug(f"User authenticated successfully: {user.email}, ID: {user.id}")
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error during authentication: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Authentication error occurred"
            )
        
        # Step 3: Check if user is active
        logger.debug(f"Step 3: Checking if user is active - is_active: {user.is_active}")
        if not user.is_active:
            logger.warning(f"Login attempt for deactivated account: {user.email}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User account is deactivated"
            )
        
        # Step 4: Create access token
        logger.debug(f"Step 4: Creating access token for user: {user.email}")
        try:
            access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = create_access_token(
                data={"sub": user.email}, expires_delta=access_token_expires
            )
        except Exception as e:
            logger.error(f"Error creating access token: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error generating access token"
            )
        
        logger.info(f"Login successful for user: {user.email}")
        return {"access_token": access_token, "token_type": "bearer"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error during login: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed due to internal error"
        )

# --- NEW: Forgot Password (Mock) ---
@router.post("/forgot-password")
async def forgot_password(
    request: ForgotPasswordRequest,
    db_conn = Depends(get_database) # Injected database dependency
):
    """
    Generates a password reset token and 'sends' it (logs to console for now).
    """
    logger.info(f"Password reset requested for email: {request.email}")
    
    # Use injected db_conn
    user = await db_conn["users"].find_one({"email": request.email})
    if not user:
        # Security: Don't reveal if email exists or not
        logger.info("Email not found, but returning success message for security.")
        return {"message": "If an account exists with this email, you will receive password reset instructions."}

    # Generate a random token
    reset_token = str(uuid.uuid4())
    
    
    # Use injected db_conn
    await db_conn["users"].update_one(
        {"email": request.email},
        {"$set": {"reset_token": reset_token}}
    )

    # --- MOCK EMAIL SENDING ---
    reset_link = f"http://localhost:3000/reset-password?token={reset_token}"
    logger.warning(f"\n\n[MOCK EMAIL] Password Reset Link for {request.email}: {reset_link}\n\n")
    # --------------------------

    return {"message": "If an account exists with this email, you will receive password reset instructions."}

@router.post("/reset-password")
async def reset_password(
    request: ResetPasswordRequest,
    db_conn = Depends(get_database) # Injected database dependency
):
    """
    Resets the password using a valid token.
    """
    logger.info("Processing password reset")
    
    
    # Use injected db_conn
    user = await db_conn["users"].find_one({"reset_token": request.token})
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    # Hash new password
    hashed_password = get_password_hash(request.new_password)

    
    await db_conn["users"].update_one(
        {"_id": user["_id"]},
        {
            "$set": {"hashed_password": hashed_password},
            "$unset": {"reset_token": ""}
        }
    )
    
    logger.info(f"Password reset successful for user: {user.get('email')}")
    return {"message": "Password has been reset successfully"}
# -----------------------------------

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    logger.info(f"Get current user info request for: {current_user.email}")
    
    try:
        user_dict = current_user.dict()
        if "hashed_password" in user_dict:
            del user_dict["hashed_password"]
            
        response_user = UserResponse(**user_dict)
        return response_user
    except Exception as e:
        logger.error(f"Error getting user info: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve user information"
        )

@router.post("/refresh", response_model=Token)
async def refresh_token(current_user: User = Depends(get_current_user)):
    """Refresh access token"""
    try:
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": current_user.email}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        logger.error(f"Error refreshing token: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Token refresh failed")

@router.post("/logout")
async def logout():
    """Logout user (client should discard token)"""
    return {"message": "Successfully logged out"}

# Admin-only endpoints
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
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
        
    try:
        users = await repo.get_all(skip=skip, limit=limit, role=role)
        response_users = []
        for user in users:
            user_dict = user.dict()
            if "hashed_password" in user_dict:
                del user_dict["hashed_password"]
            response_users.append(UserResponse(**user_dict))
        return response_users
    except Exception as e:
        logger.error(f"Error retrieving users: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to retrieve users")

@router.post("/users", response_model=UserResponse)
async def create_user(
    user_data: UserCreate,
    current_user: User = Depends(get_current_user),
    repo: UserRepository = Depends(get_user_repository)
):
    """Create a new user (Admin only)"""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
        
    try:
        user = await repo.create(user_data)
        user_dict = user.dict()
        if "hashed_password" in user_dict:
            del user_dict["hashed_password"]
        return UserResponse(**user_dict)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error creating user: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to create user")