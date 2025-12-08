from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer
from datetime import timedelta
import logging
from app.models import User, UserCreate, UserLogin, Token, UserRole, UserResponse
from app.repositories.recruiters import RecruiterRepository
from app.repositories.consultants_user import ConsultantUserRepository
from app.repositories.admins import AdminRepository
from app.auth import authenticate_user, create_access_token, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES
from app.db import get_database

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["authentication"])

# Helper function to get the correct repository based on role
def get_user_repository_by_role(role: UserRole):
    """Get the appropriate user repository based on role"""
    if role == UserRole.RECRUITER:
        return RecruiterRepository()
    elif role == UserRole.CONSULTANT:
        return ConsultantUserRepository()
    elif role == UserRole.ADMIN:
        return AdminRepository()
    else:
        raise ValueError(f"Unknown role: {role}")

# Dependency to get user repository (for backward compatibility, but should use get_user_repository_by_role)
def get_user_repository():
    logger.warning("get_user_repository() is deprecated. Use get_user_repository_by_role() instead.")
    # Return a default - this should not be used
    return RecruiterRepository()

@router.post("/register", response_model=UserResponse)
async def register(
    user_data: UserCreate
):
    """Register a new user"""
    logger.info(f"Registration request received for email: {user_data.email}, role: {user_data.role}")
    
    try:
        # Step 1: Log registration attempt
        logger.debug(f"Step 1: Processing registration for email: {user_data.email}, name: {user_data.name}, role: {user_data.role}")
        
        # Step 2: Get the correct repository based on role
        logger.debug(f"Step 2: Getting repository for role: {user_data.role}")
        repo = get_user_repository_by_role(user_data.role)
        
        # Step 3: Create user via repository
        logger.debug("Step 3: Calling repository.create() to create user")
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
            else:
                logger.warning("hashed_password not found in user_dict")
            
            response_user = UserResponse(**user_dict)
            logger.info(f"Registration completed successfully for email: {user_data.email}, ID: {user.id}")
            return response_user
        except Exception as e:
            logger.error(f"Error preparing response: {str(e)}", exc_info=True)
            raise HTTPException(status_code=500, detail="Error preparing registration response")
            
    except ValueError as e:
        # ValueError is from validation - pass through the error message
        logger.warning(f"Registration validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        # Re-raise HTTPException as-is
        logger.debug("Re-raising HTTPException")
        raise
    except Exception as e:
        # Log unexpected errors for debugging
        logger.error(f"Unexpected registration error: {str(e)}", exc_info=True)
        error_msg = str(e)
        raise HTTPException(status_code=400, detail=f"Registration failed: {error_msg}")

@router.post("/login", response_model=Token)
async def login(
    user_credentials: UserLogin
):
    """Login user and return access token"""
    logger.info(f"Login attempt for email: {user_credentials.email}")
    
    try:
        # Step 1: Authenticate user
        logger.debug(f"Step 1: Authenticating user with email: {user_credentials.email}")
        try:
            user = await authenticate_user(user_credentials.email, user_credentials.password)
            if not user:
                logger.warning(f"Authentication failed: Invalid email or password for {user_credentials.email}")
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Incorrect email or password",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            logger.debug(f"User authenticated successfully: {user.email}, ID: {user.id}")
        except HTTPException:
            # Re-raise authentication HTTPException
            raise
        except Exception as e:
            logger.error(f"Error during authentication: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Authentication error occurred"
            )
        
        # Step 2: Check if user is active
        logger.debug(f"Step 2: Checking if user is active - is_active: {user.is_active}")
        if not user.is_active:
            logger.warning(f"Login attempt for deactivated account: {user_credentials.email}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User account is deactivated"
            )
        logger.debug("User account is active")
        
        # Step 3: Create access token
        logger.debug(f"Step 3: Creating access token for user: {user.email}")
        try:
            access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            logger.debug(f"Token expiration set to {ACCESS_TOKEN_EXPIRE_MINUTES} minutes")
            
            access_token = create_access_token(
                data={"sub": user.email}, expires_delta=access_token_expires
            )
            logger.debug("Access token created successfully")
        except Exception as e:
            logger.error(f"Error creating access token: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error generating access token"
            )
        
        # Step 4: Return token
        logger.info(f"Login successful for email: {user_credentials.email}, role: {user.role}")
        return {"access_token": access_token, "token_type": "bearer"}
        
    except HTTPException:
        # Re-raise HTTPException as-is
        raise
    except Exception as e:
        logger.error(f"Unexpected error during login: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed due to internal error"
        )

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    logger.info(f"Get current user info request for: {current_user.email}")
    
    try:
        # Step 1: Prepare response (remove sensitive data)
        logger.debug("Step 1: Preparing user info response - removing password")
        try:
            user_dict = current_user.dict()
            if "hashed_password" in user_dict:
                del user_dict["hashed_password"]
                logger.debug("Password removed from response")
            else:
                logger.warning("hashed_password not found in user_dict")
            
            response_user = UserResponse(**user_dict)
            logger.info(f"User info retrieved successfully for: {current_user.email}, role: {current_user.role}")
            return response_user
        except Exception as e:
            logger.error(f"Error preparing user info response: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error retrieving user information"
            )
            
    except HTTPException:
        # Re-raise HTTPException as-is
        raise
    except Exception as e:
        logger.error(f"Unexpected error getting user info: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve user information"
        )

@router.post("/refresh", response_model=Token)
async def refresh_token(current_user: User = Depends(get_current_user)):
    """Refresh access token"""
    logger.info(f"Token refresh request for user: {current_user.email}")
    
    try:
        # Step 1: Create new access token
        logger.debug(f"Step 1: Creating new access token for user: {current_user.email}")
        try:
            access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            logger.debug(f"Token expiration set to {ACCESS_TOKEN_EXPIRE_MINUTES} minutes")
            
            access_token = create_access_token(
                data={"sub": current_user.email}, expires_delta=access_token_expires
            )
            logger.debug("New access token created successfully")
        except Exception as e:
            logger.error(f"Error creating refresh token: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error generating refresh token"
            )
        
        # Step 2: Return new token
        logger.info(f"Token refreshed successfully for user: {current_user.email}")
        return {"access_token": access_token, "token_type": "bearer"}
        
    except HTTPException:
        # Re-raise HTTPException as-is
        raise
    except Exception as e:
        logger.error(f"Unexpected error during token refresh: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Token refresh failed"
        )

@router.post("/logout")
async def logout():
    """Logout user (client should discard token)"""
    logger.info("Logout request received")
    
    try:
        # Note: Token invalidation would be handled client-side or via a token blacklist
        # This endpoint just confirms the logout request
        logger.debug("Processing logout request")
        logger.info("Logout successful (client should discard token)")
        return {"message": "Successfully logged out"}
        
    except Exception as e:
        logger.error(f"Unexpected error during logout: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Logout failed"
        )

# Admin-only endpoints
@router.get("/users", response_model=list[UserResponse])
async def get_all_users(
    skip: int = 0,
    limit: int = 100,
    role: UserRole = None,
    current_user: User = Depends(get_current_user)
):
    """Get all users (Admin only)"""
    logger.info(f"Get all users request from: {current_user.email}, filters - skip: {skip}, limit: {limit}, role: {role}")
    
    try:
        # Step 1: Check admin authorization
        logger.debug(f"Step 1: Checking admin authorization for user: {current_user.email}, role: {current_user.role}")
        if current_user.role != UserRole.ADMIN:
            logger.warning(f"Unauthorized access attempt: {current_user.email} (role: {current_user.role}) tried to access admin endpoint")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required"
            )
        logger.debug("Admin authorization confirmed")
        
        # Step 2: Get users from appropriate repository(s)
        logger.debug(f"Step 2: Fetching users from repository with filters")
        try:
            if role:
                # Get users from specific role repository
                repo = get_user_repository_by_role(role)
                users = await repo.get_all(skip=skip, limit=limit)
            else:
                # Get users from all repositories
                all_users = []
                for user_role in [UserRole.RECRUITER, UserRole.CONSULTANT, UserRole.ADMIN]:
                    repo = get_user_repository_by_role(user_role)
                    role_users = await repo.get_all(skip=0, limit=1000)  # Get all, then paginate
                    all_users.extend(role_users)
                # Simple pagination (in production, you'd want better pagination)
                users = all_users[skip:skip+limit]
            logger.debug(f"Retrieved {len(users)} users from repository")
        except ValueError as e:
            logger.error(f"Repository error getting users: {str(e)}", exc_info=True)
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            logger.error(f"Unexpected repository error: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error retrieving users"
            )
        
        # Step 3: Remove passwords from response
        logger.debug("Step 3: Removing passwords from user data")
        try:
            response_users = []
            for user in users:
                user_dict = user.dict()
                if "hashed_password" in user_dict:
                    del user_dict["hashed_password"]
                response_users.append(UserResponse(**user_dict))
            logger.debug(f"Passwords removed from {len(response_users)} users")
        except Exception as e:
            logger.error(f"Error preparing user list response: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error preparing user list"
            )
        
        logger.info(f"Successfully retrieved {len(response_users)} users for admin: {current_user.email}")
        return response_users
        
    except HTTPException:
        # Re-raise HTTPException as-is
        raise
    except Exception as e:
        logger.error(f"Unexpected error getting all users: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve users"
        )

@router.post("/users", response_model=UserResponse)
async def create_user(
    user_data: UserCreate,
    current_user: User = Depends(get_current_user)
):
    """Create a new user (Admin only)"""
    logger.info(f"Create user request from admin: {current_user.email}, new user email: {user_data.email}, role: {user_data.role}")
    
    try:
        # Step 1: Check admin authorization
        logger.debug(f"Step 1: Checking admin authorization for user: {current_user.email}, role: {current_user.role}")
        if current_user.role != UserRole.ADMIN:
            logger.warning(f"Unauthorized access attempt: {current_user.email} (role: {current_user.role}) tried to create user")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required"
            )
        logger.debug("Admin authorization confirmed")
        
        # Step 2: Get the correct repository based on role
        logger.debug(f"Step 2: Getting repository for role: {user_data.role}")
        repo = get_user_repository_by_role(user_data.role)
        
        # Step 3: Create user via repository
        logger.debug(f"Step 3: Creating user via repository - email: {user_data.email}, role: {user_data.role}")
        try:
            user = await repo.create(user_data)
            logger.info(f"User created successfully by admin {current_user.email}: {user.email}, ID: {user.id}")
        except ValueError as e:
            logger.warning(f"User creation failed due to validation error: {str(e)}")
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            logger.error(f"Repository error during user creation: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error creating user: {str(e)}"
            )
        
        # Step 3: Prepare response (remove sensitive data)
        logger.debug("Step 3: Preparing response - removing password from user data")
        try:
            user_dict = user.dict()
            if "hashed_password" in user_dict:
                del user_dict["hashed_password"]
                logger.debug("Password removed from response")
            else:
                logger.warning("hashed_password not found in user_dict")
            
            response_user = UserResponse(**user_dict)
            logger.info(f"User creation completed successfully by admin {current_user.email} for: {user_data.email}")
            return response_user
        except Exception as e:
            logger.error(f"Error preparing create user response: {str(e)}", exc_info=True)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error preparing user creation response"
            )
            
    except HTTPException:
        # Re-raise HTTPException as-is
        raise
    except Exception as e:
        logger.error(f"Unexpected error creating user: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user"
        )
