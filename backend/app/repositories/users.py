from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from app.models import User, UserCreate, UserUpdate, UserRole
from app.auth import get_password_hash
from app.db import get_database

class UserRepository:
    def __init__(self):
        self.collection_name = "users"

    async def create(self, user_data: UserCreate) -> User:
        """Create a new user"""
        db = await get_database()
        
        # Check if email already exists
        existing_user = await db.users.find_one({"email": user_data.email})
        if existing_user:
            raise ValueError("Email already exists")
        
        # Hash password
        hashed_password = get_password_hash(user_data.password)
        
        # Create user document
        user_doc = {
            "email": user_data.email,
            "name": user_data.name,
            "role": user_data.role,
            "is_active": user_data.is_active,
            "hashed_password": hashed_password,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = await db.users.insert_one(user_doc)
        user_doc["id"] = str(result.inserted_id)
        
        return User(**user_doc)

    async def get_by_id(self, user_id: str) -> Optional[User]:
        """Get user by ID"""
        db = await get_database()
        user_data = await db.users.find_one({"_id": ObjectId(user_id)})
        if user_data:
            user_data["id"] = str(user_data["_id"])
            return User(**user_data)
        return None

    async def get_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        db = await get_database()
        user_data = await db.users.find_one({"email": email})
        if user_data:
            user_data["id"] = str(user_data["_id"])
            return User(**user_data)
        return None

    async def get_all(self, skip: int = 0, limit: int = 100, role: Optional[UserRole] = None) -> List[User]:
        """Get all users with optional role filter"""
        db = await get_database()
        
        query = {}
        if role:
            query["role"] = role
        
        cursor = db.users.find(query).skip(skip).limit(limit)
        users = []
        
        async for user_data in cursor:
            user_data["id"] = str(user_data["_id"])
            users.append(User(**user_data))
        
        return users

    async def update(self, user_id: str, user_data: UserUpdate) -> Optional[User]:
        """Update user"""
        db = await get_database()
        
        update_data = {k: v for k, v in user_data.dict().items() if v is not None}
        if update_data:
            update_data["updated_at"] = datetime.utcnow()
            
            result = await db.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": update_data}
            )
            
            if result.modified_count:
                return await self.get_by_id(user_id)
        
        return None

    async def delete(self, user_id: str) -> bool:
        """Delete user"""
        db = await get_database()
        result = await db.users.delete_one({"_id": ObjectId(user_id)})
        return result.deleted_count > 0

    async def deactivate(self, user_id: str) -> bool:
        """Deactivate user (soft delete)"""
        db = await get_database()
        result = await db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"is_active": False, "updated_at": datetime.utcnow()}}
        )
        return result.modified_count > 0

    async def activate(self, user_id: str) -> bool:
        """Activate user"""
        db = await get_database()
        result = await db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"is_active": True, "updated_at": datetime.utcnow()}}
        )
        return result.modified_count > 0

    async def get_by_role(self, role: UserRole) -> List[User]:
        """Get all users by role"""
        return await self.get_all(role=role)

    async def count(self, role: Optional[UserRole] = None) -> int:
        """Count users, optionally by role"""
        db = await get_database()
        
        query = {}
        if role:
            query["role"] = role
            
        return await db.users.count_documents(query)
