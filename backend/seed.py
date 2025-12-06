import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from datetime import datetime

# 1. Setup Password Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

# 2. Database Connection URL
# Ensure this matches your .env or docker-compose
MONGODB_URL = "mongodb://localhost:27017" 

# 3. Define Demo Users
demo_users = [
    {
        "_id": "admin_user_id", # Hardcoded IDs for simplicity
        "email": "admin@recruitops.com",
        "name": "System Admin",
        "role": "ADMIN",
        "password": "password123"
    },
    {
        "_id": "manager_user_id",
        "email": "manager@recruitops.com",
        "name": "Hiring Manager",
        "role": "TALENT_MANAGER",
        "password": "password123"
    },
    {
        "_id": "candidate_user_id",
        "email": "candidate@recruitops.com",
        "name": "John Doe",
        "role": "CANDIDATE",
        "password": "password123"
    }
]

async def seed_database():
    print("🌱 Connecting to MongoDB at", MONGODB_URL)
    
    try:
        client = AsyncIOMotorClient(MONGODB_URL)
        db = client.recruitops
        
        # Test connection
        await client.admin.command('ping')
        print("✅ MongoDB Connected!")

        print("🚀 Seeding Users...")
        
        for user in demo_users:
            # Check if user exists
            existing = await db.users.find_one({"email": user["email"]})
            
            if existing:
                print(f"   ⚠️  Skipping {user['email']} (Already exists)")
                continue

            # Create User Document
            user_doc = {
                "email": user["email"],
                "name": user["name"],
                "role": user["role"],
                "hashed_password": get_password_hash(user["password"]),
                "is_active": True,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }

            await db.users.insert_one(user_doc)
            print(f"   ✅ Created {user['role']}: {user['email']}")
            
        print("\n🎉 Database Seeded Successfully!")
        print("👉 You can now login with password: password123")

    except Exception as e:
        print(f"❌ Error seeding database: {str(e)}")
    finally:
        client.close()

if __name__ == "__main__":
    # Windows specific event loop policy fix
    if os.name == 'nt':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
        
    asyncio.run(seed_database())