from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
from datetime import datetime
from enum import Enum
import logging

# Set up logger
logger = logging.getLogger(__name__)

# Authentication and User Models
class UserRole(str, Enum):
    ADMIN = "ADMIN"
    RECRUITER = "RECRUITER"
    CONSULTANT = "CONSULTANT"
    
    def __str__(self):
        return self.value
    
    @classmethod
    def _missing_(cls, value):
        logger.warning(f"Invalid UserRole value: {value}")
        return None

class UserBase(BaseModel):
    email: EmailStr
    name: str = Field(..., min_length=1, max_length=100)
    role: UserRole
    is_active: bool = True
    
    def __init__(self, **data):
        """Initialize UserBase with logging"""
        logger.debug(f"Initializing UserBase - email: {data.get('email', 'N/A')}, role: {data.get('role', 'N/A')}")
        try:
            super().__init__(**data)
            logger.debug(f"UserBase initialized successfully - email: {self.email}, role: {self.role}")
        except Exception as e:
            logger.error(f"Error initializing UserBase: {str(e)}", exc_info=True)
            raise

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters and maximum 72 bytes (bcrypt limitation)")
    
    @validator('password')
    def validate_password_length(cls, v):
        """Ensure password doesn't exceed 72 bytes (not just characters)"""
        logger.debug("Validating password length")
        
        try:
            # Step 1: Check if password is provided
            logger.debug("Step 1: Checking if password is provided")
            if not v:
                logger.warning("Password validation failed: Password is required")
                raise ValueError("Password is required")
            logger.debug("Password is provided")
            
            # Step 2: Encode password to bytes
            logger.debug("Step 2: Encoding password to UTF-8 bytes")
            try:
                password_bytes = v.encode('utf-8')
                byte_count = len(password_bytes)
                logger.debug(f"Password byte count: {byte_count} bytes")
            except UnicodeEncodeError as e:
                logger.error(f"Unicode encoding error during password validation: {str(e)}", exc_info=True)
                raise ValueError(f"Password encoding error: {str(e)}")
            except Exception as e:
                logger.error(f"Unexpected error encoding password: {str(e)}", exc_info=True)
                raise ValueError(f"Password validation error: {str(e)}")
            
            # Step 3: Check byte length
            logger.debug(f"Step 3: Checking password byte length ({byte_count} bytes)")
            if byte_count > 72:
                logger.warning(f"Password validation failed: Password too long ({byte_count} bytes, max 72)")
                raise ValueError(
                    f"Password is too long ({byte_count} bytes). "
                    f"Maximum 72 bytes allowed. "
                    f"For ASCII characters, this is approximately 72 characters. "
                    f"Some special characters or emojis use multiple bytes per character."
                )
            
            # Step 4: Check minimum length (character count)
            logger.debug(f"Step 4: Checking password character length ({len(v)} characters)")
            if len(v) < 6:
                logger.warning(f"Password validation failed: Password too short ({len(v)} characters, min 6)")
                raise ValueError("Password must be at least 6 characters")
            
            logger.debug(f"Password validation successful - {byte_count} bytes, {len(v)} characters")
            return v
            
        except ValueError as e:
            # Re-raise ValueError as-is (validation errors)
            logger.warning(f"Password validation error: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error during password validation: {str(e)}", exc_info=True)
            raise ValueError(f"Password validation failed: {str(e)}")
    
    def __init__(self, **data):
        """Initialize UserCreate with logging"""
        logger.debug(f"Initializing UserCreate - email: {data.get('email', 'N/A')}, role: {data.get('role', 'N/A')}")
        try:
            super().__init__(**data)
            logger.info(f"UserCreate initialized successfully - email: {self.email}, role: {self.role}")
        except Exception as e:
            logger.error(f"Error initializing UserCreate: {str(e)}", exc_info=True)
            raise

class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None
    
    def __init__(self, **data):
        """Initialize UserUpdate with logging"""
        logger.debug(f"Initializing UserUpdate with fields: {list(data.keys())}")
        try:
            super().__init__(**data)
            logger.debug(f"UserUpdate initialized successfully with {len([k for k, v in data.items() if v is not None])} fields")
        except Exception as e:
            logger.error(f"Error initializing UserUpdate: {str(e)}", exc_info=True)
            raise

class UserResponse(UserBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class User(UserBase):
    id: str
    created_at: datetime
    updated_at: datetime
    hashed_password: str

    class Config:
        from_attributes = True
    
    def __init__(self, **data):
        """Initialize User with logging"""
        user_id = data.get('id', 'N/A')
        email = data.get('email', 'N/A')
        logger.debug(f"Initializing User - ID: {user_id}, email: {email}")
        try:
            super().__init__(**data)
            logger.debug(f"User initialized successfully - ID: {self.id}, email: {self.email}, role: {self.role}")
        except Exception as e:
            logger.error(f"Error initializing User: {str(e)}", exc_info=True)
            raise
    
    @validator('id')
    def validate_id(cls, v):
        """Validate user ID"""
        logger.debug(f"Validating user ID: {v}")
        if not v or not v.strip():
            logger.warning("User ID validation failed: ID is required")
            raise ValueError("User ID is required")
        logger.debug("User ID validation successful")
        return v
    
    @validator('created_at', 'updated_at')
    def validate_datetime(cls, v):
        """Validate datetime fields"""
        logger.debug(f"Validating datetime: {v}")
        if not isinstance(v, datetime):
            logger.warning(f"Datetime validation failed: Expected datetime, got {type(v)}")
            raise ValueError(f"Expected datetime, got {type(v)}")
        logger.debug("Datetime validation successful")
        return v

class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., description="Password")
    
    def __init__(self, **data):
        """Initialize UserLogin with logging"""
        email = data.get('email', 'N/A')
        logger.debug(f"Initializing UserLogin - email: {email}")
        try:
            super().__init__(**data)
            logger.debug(f"UserLogin initialized successfully - email: {self.email}")
        except Exception as e:
            logger.error(f"Error initializing UserLogin: {str(e)}", exc_info=True)
            raise
    
    @validator('password')
    def validate_password_present(cls, v):
        """Validate that password is provided"""
        logger.debug("Validating password presence for login")
        if not v or not v.strip():
            logger.warning("Login password validation failed: Password is required")
            raise ValueError("Password is required")
        logger.debug("Login password validation successful")
        return v

class Token(BaseModel):
    access_token: str
    token_type: str
    
    def __init__(self, **data):
        """Initialize Token with logging"""
        logger.debug("Initializing Token")
        try:
            super().__init__(**data)
            logger.debug(f"Token initialized successfully - token_type: {self.token_type}")
        except Exception as e:
            logger.error(f"Error initializing Token: {str(e)}", exc_info=True)
            raise
    
    @validator('access_token')
    def validate_access_token(cls, v):
        """Validate access token"""
        logger.debug("Validating access token")
        if not v or not v.strip():
            logger.warning("Access token validation failed: Token is required")
            raise ValueError("Access token is required")
        logger.debug("Access token validation successful")
        return v
    
    @validator('token_type')
    def validate_token_type(cls, v):
        """Validate token type"""
        logger.debug(f"Validating token type: {v}")
        if not v or not v.strip():
            logger.warning("Token type validation failed: Token type is required")
            raise ValueError("Token type is required")
        expected_type = "bearer"
        if v.lower() != expected_type:
            logger.warning(f"Token type validation warning: Expected '{expected_type}', got '{v}'")
        logger.debug("Token type validation successful")
        return v

class TokenData(BaseModel):
    email: Optional[str] = None
    
    def __init__(self, **data):
        """Initialize TokenData with logging"""
        email = data.get('email', 'N/A')
        logger.debug(f"Initializing TokenData - email: {email}")
        try:
            super().__init__(**data)
            logger.debug(f"TokenData initialized successfully - email: {self.email}")
        except Exception as e:
            logger.error(f"Error initializing TokenData: {str(e)}", exc_info=True)
            raise
    
    @validator('email')
    def validate_email_format(cls, v):
        """Validate email format if provided"""
        if v is not None:
            logger.debug(f"Validating email format: {v}")
            if not v or not v.strip():
                logger.warning("Email validation failed: Email cannot be empty if provided")
                raise ValueError("Email cannot be empty if provided")
            if '@' not in v:
                logger.warning(f"Email validation failed: Invalid email format: {v}")
                raise ValueError("Invalid email format")
            logger.debug("Email validation successful")
        else:
            logger.debug("Email is None - skipping validation")
        return v

# Consultant Profile Models
class ConsultantProfileBase(BaseModel):
    experience_years: float = Field(..., ge=0)
    tech_stack: List[str] = []
    available: bool = True
    location: Optional[str] = None
    visa_status: Optional[str] = None
    rating: Optional[float] = None
    notes: Optional[str] = None

class ConsultantProfileCreate(ConsultantProfileBase):
    pass

class ConsultantProfileUpdate(BaseModel):
    experience_years: Optional[float] = Field(None, ge=0)
    tech_stack: Optional[List[str]] = None
    available: Optional[bool] = None
    location: Optional[str] = None
    visa_status: Optional[str] = None
    notes: Optional[str] = None

class ConsultantProfile(ConsultantProfileBase):
    id: str
    user_id: str
    email: Optional[str] = None
    name: Optional[str] = None
    phone: Optional[str] = None
    
    class Config:
        from_attributes = True

# Job Description Models
class JobDescriptionBase(BaseModel):
    title: str = Field(..., min_length=1)
    description: str
    experience_required: float = Field(..., ge=0)
    tech_required: List[str] = []
    location: Optional[str] = None
    visa_required: Optional[str] = None
    notes: Optional[str] = None
    status: str = "OPEN"  # OPEN, CLOSED

class JobDescriptionCreate(JobDescriptionBase):
    pass

class JobDescriptionUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    experience_required: Optional[float] = None
    tech_required: Optional[List[str]] = None
    location: Optional[str] = None
    visa_required: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[str] = None

class JobDescription(JobDescriptionBase):
    id: str
    recruiter_id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Submission Models
class SubmissionStatus(str, Enum):
    SUBMITTED = "SUBMITTED"
    INTERVIEW = "INTERVIEW"
    OFFER = "OFFER"
    JOINED = "JOINED"
    REJECTED = "REJECTED"
    ON_HOLD = "ON_HOLD"
    WITHDRAWN = "WITHDRAWN"

class SubmissionBase(BaseModel):
    jd_id: str
    comments: Optional[str] = None

class SubmissionCreate(SubmissionBase):
    pass

class SubmissionUpdate(BaseModel):
    status: Optional[SubmissionStatus] = None
    comments: Optional[str] = None
    recruiter_read: Optional[bool] = None

class Submission(SubmissionBase):
    id: str
    consultant_id: str
    recruiter_id: str
    resume_path: str
    status: SubmissionStatus
    recruiter_read: bool = False
    created_at: datetime
    updated_at: datetime
    consultant_name: Optional[str] = None
    jd_title: Optional[str] = None
    
    class Config:
        from_attributes = True
