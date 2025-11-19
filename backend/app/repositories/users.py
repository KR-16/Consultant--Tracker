from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from bson.errors import InvalidId
from pymongo.errors import PyMongoError, DuplicateKeyError
import logging
from app.models import User, UserCreate, UserUpdate, UserRole
from app.auth import get_password_hash
from app.db import get_database

# Set up logger
logger = logging.getLogger(__name__)

class UserRepository:
    def __init__(self):
        self.collection_name = "users"
        logger.debug(f"UserRepository initialized with collection: {self.collection_name}")

    async def create(self, user_data: UserCreate) -> User:
        """Create a new user"""
        logger.info(f"Starting user creation for email: {user_data.email}, role: {user_data.role}")
        
        try:
            # Step 1: Get database connection
            logger.debug("Step 1: Getting database connection")
            db = await get_database()
            if not db:
                raise ValueError("Database connection not available")
            logger.debug("Database connection obtained successfully")
            
            # Step 2: Check if email already exists
            logger.debug(f"Step 2: Checking if email already exists: {user_data.email}")
            try:
                existing_user = await db.users.find_one({"email": user_data.email})
                if existing_user:
                    logger.warning(f"Email already exists in database: {user_data.email}")
                    raise ValueError("Email already exists")
                logger.debug(f"Email check passed: {user_data.email} is available")
            except PyMongoError as e:
                logger.error(f"Database error while checking email existence: {str(e)}", exc_info=True)
                raise ValueError(f"Database error while checking email: {str(e)}")
            
            # Step 3: Hash password
            logger.debug("Step 3: Starting password hashing process")
            password_bytes = user_data.password.encode('utf-8')
            password_byte_length = len(password_bytes)
            logger.debug(f"Password byte length: {password_byte_length} bytes")
            
            try:
                logger.debug("Calling get_password_hash function")
                hashed_password = get_password_hash(user_data.password)
                logger.debug("Password hashed successfully")
            except ValueError as e:
                # Re-raise ValueError as-is (it's from our validator or truncation check)
                logger.error(f"Password validation/hashing ValueError: {str(e)}")
                raise
            except Exception as e:
                error_msg = str(e)
                logger.error(f"Unexpected error during password hashing: {error_msg}", exc_info=True)
                # Only catch bcrypt-specific errors about password length
                if "72 bytes" in error_msg or "password cannot be longer" in error_msg.lower():
                    # If password was already validated to be <= 72 bytes, this is unexpected
                    if password_byte_length <= 72:
                        logger.error(f"Unexpected password hashing error. Password is {password_byte_length} bytes (should be valid)")
                        raise ValueError(
                            f"Unexpected password hashing error. "
                            f"Plain text password is {password_byte_length} bytes (should be valid). "
                            f"Original error: {error_msg}"
                        )
                    logger.error(f"Password too long: {password_byte_length} bytes")
                    raise ValueError("Password is too long. Maximum 72 bytes allowed (approximately 72 characters for ASCII passwords).")
                # For other errors, provide a more generic message
                raise ValueError(f"Password hashing failed: {error_msg}")
            
            # Step 4: Create user document
            logger.debug("Step 4: Creating user document")
            created_at = datetime.utcnow()
            updated_at = datetime.utcnow()
            user_doc = {
                "email": user_data.email,
                "name": user_data.name,
                "role": user_data.role,
                "is_active": user_data.is_active,
                "hashed_password": hashed_password,
                "created_at": created_at,
                "updated_at": updated_at
            }
            logger.debug(f"User document created with fields: email={user_data.email}, name={user_data.name}, role={user_data.role}, is_active={user_data.is_active}")
            
            # Step 5: Insert into database
            logger.debug("Step 5: Inserting user document into database")
            try:
                result = await db.users.insert_one(user_doc)
                inserted_id = str(result.inserted_id)
                logger.info(f"User successfully inserted into database with ID: {inserted_id}")
            except DuplicateKeyError as e:
                logger.error(f"Duplicate key error during user insertion: {str(e)}", exc_info=True)
                raise ValueError("Email already exists (duplicate key constraint)")
            except PyMongoError as e:
                logger.error(f"MongoDB error during user insertion: {str(e)}", exc_info=True)
                raise ValueError(f"Database error while creating user: {str(e)}")
            
            # Step 6: Prepare return value
            logger.debug("Step 6: Preparing user object for return")
            user_doc["id"] = inserted_id
            user = User(**user_doc)
            logger.info(f"User creation completed successfully for email: {user_data.email}, ID: {inserted_id}")
            return user
            
        except ValueError as e:
            # Re-raise ValueError as-is (validation errors)
            logger.warning(f"User creation failed due to validation error: {str(e)}")
            raise
        except Exception as e:
            # Catch any unexpected errors
            logger.error(f"Unexpected error during user creation: {str(e)}", exc_info=True)
            raise ValueError(f"Failed to create user: {str(e)}")

    async def get_by_id(self, user_id: str) -> Optional[User]:
        """Get user by ID"""
        logger.debug(f"Getting user by ID: {user_id}")
        
        try:
            # Step 1: Validate and convert user_id
            logger.debug(f"Step 1: Validating user ID format: {user_id}")
            try:
                object_id = ObjectId(user_id)
                logger.debug(f"User ID converted to ObjectId successfully")
            except InvalidId as e:
                logger.warning(f"Invalid user ID format: {user_id} - {str(e)}")
                return None
            
            # Step 2: Get database connection
            logger.debug("Step 2: Getting database connection")
            db = await get_database()
            if not db:
                logger.error("Database connection not available")
                raise ValueError("Database connection not available")
            logger.debug("Database connection obtained successfully")
            
            # Step 3: Query database
            logger.debug(f"Step 3: Querying database for user with ID: {user_id}")
            try:
                user_data = await db.users.find_one({"_id": object_id})
                if user_data:
                    logger.debug(f"User found in database: {user_id}")
                    user_data["id"] = str(user_data["_id"])
                    user = User(**user_data)
                    logger.info(f"Successfully retrieved user by ID: {user_id}, email: {user.email}")
                    return user
                else:
                    logger.debug(f"User not found with ID: {user_id}")
                    return None
            except PyMongoError as e:
                logger.error(f"MongoDB error while getting user by ID: {str(e)}", exc_info=True)
                raise ValueError(f"Database error while retrieving user: {str(e)}")
                
        except ValueError as e:
            logger.error(f"Error getting user by ID: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error while getting user by ID: {str(e)}", exc_info=True)
            raise ValueError(f"Failed to get user by ID: {str(e)}")

    async def get_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        logger.debug(f"Getting user by email: {email}")
        
        try:
            # Step 1: Validate email
            logger.debug(f"Step 1: Validating email format: {email}")
            if not email or not email.strip():
                logger.warning("Empty email provided")
                return None
            
            # Step 2: Get database connection
            logger.debug("Step 2: Getting database connection")
            db = await get_database()
            if not db:
                logger.error("Database connection not available")
                raise ValueError("Database connection not available")
            logger.debug("Database connection obtained successfully")
            
            # Step 3: Query database
            logger.debug(f"Step 3: Querying database for user with email: {email}")
            try:
                user_data = await db.users.find_one({"email": email})
                if user_data:
                    logger.debug(f"User found in database: {email}")
                    user_data["id"] = str(user_data["_id"])
                    user = User(**user_data)
                    logger.info(f"Successfully retrieved user by email: {email}, ID: {user.id}")
                    return user
                else:
                    logger.debug(f"User not found with email: {email}")
                    return None
            except PyMongoError as e:
                logger.error(f"MongoDB error while getting user by email: {str(e)}", exc_info=True)
                raise ValueError(f"Database error while retrieving user: {str(e)}")
                
        except ValueError as e:
            logger.error(f"Error getting user by email: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error while getting user by email: {str(e)}", exc_info=True)
            raise ValueError(f"Failed to get user by email: {str(e)}")

    async def get_all(self, skip: int = 0, limit: int = 100, role: Optional[UserRole] = None) -> List[User]:
        """Get all users with optional role filter"""
        logger.debug(f"Getting all users with filters - skip: {skip}, limit: {limit}, role: {role}")
        
        try:
            # Step 1: Get database connection
            logger.debug("Step 1: Getting database connection")
            db = await get_database()
            if not db:
                logger.error("Database connection not available")
                raise ValueError("Database connection not available")
            logger.debug("Database connection obtained successfully")
            
            # Step 2: Build query
            logger.debug("Step 2: Building query")
            query = {}
            if role:
                query["role"] = role
                logger.debug(f"Query filter added for role: {role}")
            logger.debug(f"Final query: {query}")
            
            # Step 3: Execute query
            logger.debug(f"Step 3: Executing query with skip={skip}, limit={limit}")
            try:
                cursor = db.users.find(query).skip(skip).limit(limit)
                users = []
                count = 0
                
                async for user_data in cursor:
                    user_data["id"] = str(user_data["_id"])
                    users.append(User(**user_data))
                    count += 1
                
                logger.info(f"Successfully retrieved {count} users (skip={skip}, limit={limit}, role={role})")
                return users
            except PyMongoError as e:
                logger.error(f"MongoDB error while getting all users: {str(e)}", exc_info=True)
                raise ValueError(f"Database error while retrieving users: {str(e)}")
                
        except ValueError as e:
            logger.error(f"Error getting all users: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error while getting all users: {str(e)}", exc_info=True)
            raise ValueError(f"Failed to get all users: {str(e)}")

    async def update(self, user_id: str, user_data: UserUpdate) -> Optional[User]:
        """Update user"""
        logger.info(f"Updating user with ID: {user_id}")
        
        try:
            # Step 1: Validate and convert user_id
            logger.debug(f"Step 1: Validating user ID format: {user_id}")
            try:
                object_id = ObjectId(user_id)
                logger.debug(f"User ID converted to ObjectId successfully")
            except InvalidId as e:
                logger.warning(f"Invalid user ID format: {user_id} - {str(e)}")
                raise ValueError(f"Invalid user ID format: {user_id}")
            
            # Step 2: Get database connection
            logger.debug("Step 2: Getting database connection")
            db = await get_database()
            if not db:
                logger.error("Database connection not available")
                raise ValueError("Database connection not available")
            logger.debug("Database connection obtained successfully")
            
            # Step 3: Prepare update data
            logger.debug("Step 3: Preparing update data")
            update_data = {k: v for k, v in user_data.dict().items() if v is not None}
            logger.debug(f"Update data fields: {list(update_data.keys())}")
            
            if not update_data:
                logger.warning(f"No fields to update for user ID: {user_id}")
                return None
            
            update_data["updated_at"] = datetime.utcnow()
            logger.debug(f"Added updated_at timestamp to update data")
            
            # Step 4: Execute update
            logger.debug(f"Step 4: Executing database update for user ID: {user_id}")
            try:
                result = await db.users.update_one(
                    {"_id": object_id},
                    {"$set": update_data}
                )
                
                logger.debug(f"Update result - matched: {result.matched_count}, modified: {result.modified_count}")
                
                if result.modified_count > 0:
                    logger.info(f"User successfully updated: {user_id}")
                    return await self.get_by_id(user_id)
                elif result.matched_count > 0:
                    logger.debug(f"User found but no changes made: {user_id}")
                    return await self.get_by_id(user_id)
                else:
                    logger.warning(f"User not found for update: {user_id}")
                    return None
            except PyMongoError as e:
                logger.error(f"MongoDB error while updating user: {str(e)}", exc_info=True)
                raise ValueError(f"Database error while updating user: {str(e)}")
                
        except ValueError as e:
            logger.error(f"Error updating user: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error while updating user: {str(e)}", exc_info=True)
            raise ValueError(f"Failed to update user: {str(e)}")

    async def delete(self, user_id: str) -> bool:
        """Delete user"""
        logger.info(f"Deleting user with ID: {user_id}")
        
        try:
            # Step 1: Validate and convert user_id
            logger.debug(f"Step 1: Validating user ID format: {user_id}")
            try:
                object_id = ObjectId(user_id)
                logger.debug(f"User ID converted to ObjectId successfully")
            except InvalidId as e:
                logger.warning(f"Invalid user ID format: {user_id} - {str(e)}")
                raise ValueError(f"Invalid user ID format: {user_id}")
            
            # Step 2: Get database connection
            logger.debug("Step 2: Getting database connection")
            db = await get_database()
            if not db:
                logger.error("Database connection not available")
                raise ValueError("Database connection not available")
            logger.debug("Database connection obtained successfully")
            
            # Step 3: Execute delete
            logger.debug(f"Step 3: Executing database delete for user ID: {user_id}")
            try:
                result = await db.users.delete_one({"_id": object_id})
                deleted = result.deleted_count > 0
                
                if deleted:
                    logger.info(f"User successfully deleted: {user_id}")
                else:
                    logger.warning(f"User not found for deletion: {user_id}")
                
                return deleted
            except PyMongoError as e:
                logger.error(f"MongoDB error while deleting user: {str(e)}", exc_info=True)
                raise ValueError(f"Database error while deleting user: {str(e)}")
                
        except ValueError as e:
            logger.error(f"Error deleting user: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error while deleting user: {str(e)}", exc_info=True)
            raise ValueError(f"Failed to delete user: {str(e)}")

    async def deactivate(self, user_id: str) -> bool:
        """Deactivate user (soft delete)"""
        logger.info(f"Deactivating user with ID: {user_id}")
        
        try:
            # Step 1: Validate and convert user_id
            logger.debug(f"Step 1: Validating user ID format: {user_id}")
            try:
                object_id = ObjectId(user_id)
                logger.debug(f"User ID converted to ObjectId successfully")
            except InvalidId as e:
                logger.warning(f"Invalid user ID format: {user_id} - {str(e)}")
                raise ValueError(f"Invalid user ID format: {user_id}")
            
            # Step 2: Get database connection
            logger.debug("Step 2: Getting database connection")
            db = await get_database()
            if not db:
                logger.error("Database connection not available")
                raise ValueError("Database connection not available")
            logger.debug("Database connection obtained successfully")
            
            # Step 3: Execute deactivation
            logger.debug(f"Step 3: Executing database deactivation for user ID: {user_id}")
            try:
                update_data = {"is_active": False, "updated_at": datetime.utcnow()}
                result = await db.users.update_one(
                    {"_id": object_id},
                    {"$set": update_data}
                )
                
                deactivated = result.modified_count > 0
                logger.debug(f"Deactivation result - matched: {result.matched_count}, modified: {result.modified_count}")
                
                if deactivated:
                    logger.info(f"User successfully deactivated: {user_id}")
                elif result.matched_count > 0:
                    logger.debug(f"User found but already deactivated: {user_id}")
                else:
                    logger.warning(f"User not found for deactivation: {user_id}")
                
                return deactivated
            except PyMongoError as e:
                logger.error(f"MongoDB error while deactivating user: {str(e)}", exc_info=True)
                raise ValueError(f"Database error while deactivating user: {str(e)}")
                
        except ValueError as e:
            logger.error(f"Error deactivating user: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error while deactivating user: {str(e)}", exc_info=True)
            raise ValueError(f"Failed to deactivate user: {str(e)}")

    async def activate(self, user_id: str) -> bool:
        """Activate user"""
        logger.info(f"Activating user with ID: {user_id}")
        
        try:
            # Step 1: Validate and convert user_id
            logger.debug(f"Step 1: Validating user ID format: {user_id}")
            try:
                object_id = ObjectId(user_id)
                logger.debug(f"User ID converted to ObjectId successfully")
            except InvalidId as e:
                logger.warning(f"Invalid user ID format: {user_id} - {str(e)}")
                raise ValueError(f"Invalid user ID format: {user_id}")
            
            # Step 2: Get database connection
            logger.debug("Step 2: Getting database connection")
            db = await get_database()
            if not db:
                logger.error("Database connection not available")
                raise ValueError("Database connection not available")
            logger.debug("Database connection obtained successfully")
            
            # Step 3: Execute activation
            logger.debug(f"Step 3: Executing database activation for user ID: {user_id}")
            try:
                update_data = {"is_active": True, "updated_at": datetime.utcnow()}
                result = await db.users.update_one(
                    {"_id": object_id},
                    {"$set": update_data}
                )
                
                activated = result.modified_count > 0
                logger.debug(f"Activation result - matched: {result.matched_count}, modified: {result.modified_count}")
                
                if activated:
                    logger.info(f"User successfully activated: {user_id}")
                elif result.matched_count > 0:
                    logger.debug(f"User found but already activated: {user_id}")
                else:
                    logger.warning(f"User not found for activation: {user_id}")
                
                return activated
            except PyMongoError as e:
                logger.error(f"MongoDB error while activating user: {str(e)}", exc_info=True)
                raise ValueError(f"Database error while activating user: {str(e)}")
                
        except ValueError as e:
            logger.error(f"Error activating user: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error while activating user: {str(e)}", exc_info=True)
            raise ValueError(f"Failed to activate user: {str(e)}")

    async def get_by_role(self, role: UserRole) -> List[User]:
        """Get all users by role"""
        logger.debug(f"Getting users by role: {role}")
        try:
            users = await self.get_all(role=role)
            logger.info(f"Successfully retrieved {len(users)} users with role: {role}")
            return users
        except Exception as e:
            logger.error(f"Error getting users by role: {str(e)}", exc_info=True)
            raise

    async def count(self, role: Optional[UserRole] = None) -> int:
        """Count users, optionally by role"""
        logger.debug(f"Counting users with role filter: {role}")
        
        try:
            # Step 1: Get database connection
            logger.debug("Step 1: Getting database connection")
            db = await get_database()
            if not db:
                logger.error("Database connection not available")
                raise ValueError("Database connection not available")
            logger.debug("Database connection obtained successfully")
            
            # Step 2: Build query
            logger.debug("Step 2: Building count query")
            query = {}
            if role:
                query["role"] = role
                logger.debug(f"Query filter added for role: {role}")
            logger.debug(f"Final count query: {query}")
            
            # Step 3: Execute count
            logger.debug("Step 3: Executing count query")
            try:
                count = await db.users.count_documents(query)
                logger.info(f"User count: {count} (role filter: {role})")
                return count
            except PyMongoError as e:
                logger.error(f"MongoDB error while counting users: {str(e)}", exc_info=True)
                raise ValueError(f"Database error while counting users: {str(e)}")
                
        except ValueError as e:
            logger.error(f"Error counting users: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error while counting users: {str(e)}", exc_info=True)
            raise ValueError(f"Failed to count users: {str(e)}")
