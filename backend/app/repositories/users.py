from typing import List, Optional
from datetime import datetime
from app.db import get_database
from app.models import UserCreate, User, UserRole
from app.auth import get_password_hash

class UserRepository:
    async def create(self, user: UserCreate) -> User:
        db = await get_database()
        
        # Check if email exists
        existing_user = await db.users.find_one({"email": user.email})
        if existing_user:
            raise ValueError("Email already registered")
            
        # Prepare data
        user_dict = user.dict()
        user_dict["hashed_password"] = get_password_hash(user.password)
        del user_dict["password"]
        user_dict["created_at"] = datetime.utcnow()
        user_dict["updated_at"] = datetime.utcnow()
        
        # Insert
        result = await db.users.insert_one(user_dict)
        
        # Return created user
        created_user = await db.users.find_one({"_id": result.inserted_id})
        created_user["id"] = str(created_user["_id"])
        return User(**created_user)

    async def get_by_email(self, email: str) -> Optional[User]:
        db = await get_database()
        user_data = await db.users.find_one({"email": email})
        if user_data:
            user_data["id"] = str(user_data["_id"])
            return User(**user_data)
        return None

    async def get_all(self, skip: int = 0, limit: int = 100, role: Optional[UserRole] = None) -> List[User]:
        db = await get_database()
        query = {}
        if role:
            query["role"] = role.value
            
        cursor = db.users.find(query).skip(skip).limit(limit)
        users = []
        async for user_data in cursor:
            user_data["id"] = str(user_data["_id"])
            users.append(User(**user_data))
        return users