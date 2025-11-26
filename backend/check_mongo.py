import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = "consultant_tracker"

async def check_and_fix_db():
    print(f"--- Connecting to {DB_NAME} at {MONGO_URL} ---")
    try:
        client = AsyncIOMotorClient(MONGO_URL, serverSelectionTimeoutMS=5000)
        db = client[DB_NAME]
        
        server_info = await client.server_info()
        print(f"Connected to MongoDB version: {server_info.get('version')}")
        
        print("\n--- Checking for bad indexes ---")
        try:
            await db.consultants.drop_index("email_1")
            print("FIXED: Removed the bad 'email_1' index. Crash should be gone.")
        except Exception:
            print(" GOOD: Bad 'email' index not found (it might already be fixed).")

    
        collections = await db.list_collection_names()
        print(f"\nFound collections: {collections}")
       
        user_count = await db.users.count_documents({})
        consultant_count = await db.consultants.count_documents({})
        print(f"Users: {user_count}")
        print(f"Consultant Profiles: {consultant_count}")

    except Exception as e:
        print(f"\n❌ ERROR: Could not connect to MongoDB.")
        print(f"Details: {e}")

if __name__ == "__main__":
    asyncio.run(check_and_fix_db())