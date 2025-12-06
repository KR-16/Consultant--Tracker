from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.models import User, TokenData, UserRole
from app.db import get_database
import os
import logging

# Set up logger
logger = logging.getLogger(__name__)

# Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-this-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Log configuration on module load
logger.debug(f"Auth module initialized - ALGORITHM: {ALGORITHM}, TOKEN_EXPIRE_MINUTES: {ACCESS_TOKEN_EXPIRE_MINUTES}")
if SECRET_KEY == "your-secret-key-change-this-in-production":
    logger.warning("Using default SECRET_KEY - change this in production!")

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
logger.debug("Password hashing context initialized with bcrypt")

# JWT token scheme
security = HTTPBearer()
logger.debug("HTTPBearer security scheme initialized")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    try:
        # Truncate password to 72 bytes if necessary (bcrypt limitation)
        password_bytes = plain_password.encode('utf-8')
        if len(password_bytes) > 72:
            truncated = password_bytes[:72]
            while truncated and (truncated[-1] & 0x80) and not (truncated[-1] & 0x40):
                truncated = truncated[:-1]
            plain_password = truncated.decode('utf-8', errors='ignore')
        
        return pwd_context.verify(plain_password, hashed_password)
    except Exception as e:
        logger.error(f"Error during password verification: {str(e)}", exc_info=True)
        return False

def get_password_hash(password: str) -> str:
    """Hash a password - bcrypt has a 72-byte limit"""
    try:
        password_bytes = password.encode('utf-8')
        if len(password_bytes) > 72:
            truncated = password_bytes[:72]
            while truncated and (truncated[-1] & 0x80) and not (truncated[-1] & 0x40):
                truncated = truncated[:-1]
            password = truncated.decode('utf-8', errors='ignore')
        
        return pwd_context.hash(password)
    except Exception as e:
        logger.error(f"Error during password hashing: {str(e)}", exc_info=True)
        raise ValueError(f"Password hashing failed: {str(e)}")

async def get_user_by_email(email: str) -> Optional[User]:
    """Get user by email from database"""
    try:
        if not email:
            return None
        
        db = await get_database()
        if db is None:
            return None
        
        user_data = await db.users.find_one({"email": email})
        if user_data:
            # Convert MongoDB _id to id
            user_data["id"] = str(user_data["_id"])
            try:
                # This will validates against new UserRole (TALENT_MANAGER/CANDIDATE)
                return User(**user_data)
            except Exception as e:
                logger.error(f"Error creating User object: {str(e)}", exc_info=True)
                return None
        return None
    except Exception as e:
        logger.error(f"Unexpected error getting user by email: {str(e)}", exc_info=True)
        return None

async def authenticate_user(email: str, password: str) -> Optional[User]:
    """Authenticate a user with email and password"""
    try:
        user = await get_user_by_email(email)
        if not user:
            return None
        
        if not verify_password(password, user.hashed_password):
            return None
        
        logger.info(f"User authenticated: {email}, Role: {user.role}")
        return user
    except Exception as e:
        logger.error(f"Authentication error: {str(e)}", exc_info=True)
        return None

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token"""
    try:
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire})
        
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    except Exception as e:
        logger.error(f"Token creation failed: {str(e)}", exc_info=True)
        raise ValueError("Could not create token")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    """Get current authenticated user from JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        token = credentials.credentials
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            email: str = payload.get("sub")
            if email is None:
                raise credentials_exception
            token_data = TokenData(email=email)
        except JWTError:
            raise credentials_exception
        
        user = await get_user_by_email(email=token_data.email)
        if user is None:
            raise credentials_exception
        
        return user
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting current user: {str(e)}", exc_info=True)
        raise credentials_exception

# --- ROLE CHECK DECORATORS (UPDATED) ---

def require_role(required_role: UserRole):
    """Decorator to require specific role"""
    def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role != required_role and current_user.role != UserRole.ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role {required_role} required"
            )
        return current_user
    return role_checker

def require_admin(current_user: User = Depends(get_current_user)):
    """Require admin role"""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user

def require_talent_manager_or_admin(current_user: User = Depends(get_current_user)):
    """Require Talent Manager or Admin role (Formerly Recruiter)"""
    allowed = [UserRole.TALENT_MANAGER, UserRole.ADMIN]
    if current_user.role not in allowed:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Talent Manager access required"
        )
    return current_user

def require_candidate_or_admin(current_user: User = Depends(get_current_user)):
    """Require Candidate or Admin role (Formerly Consultant)"""
    allowed = [UserRole.CANDIDATE, UserRole.ADMIN]
    if current_user.role not in allowed:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Candidate access required"
        )
    return current_user