import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os

async def fix_indexes():
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    client = AsyncIOMotorClient(mongodb_url)
    db = client.consultant_tracker
    
    print("Dropping email index from consultants collection...")
    try:
        await db.consultants.drop_index("email_1")
        print("Index dropped successfully.")
    except Exception as e:
        print(f"Error dropping index (might not exist): {e}")
        
    # Check indexes
    print("\nCurrent indexes on consultants:")
    async for index in db.consultants.list_indexes():
        print(index)

    client.close()

if __name__ == "__main__":
    asyncio.run(fix_indexes())
