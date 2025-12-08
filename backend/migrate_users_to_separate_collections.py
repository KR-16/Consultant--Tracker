"""
Migration script to split users collection into three separate collections:
- recruiters (for users with role RECRUITER)
- consultants (for users with role CONSULTANT)  
- admins (for users with role ADMIN)

This script should be run once to migrate existing data.

Usage:
    python -m backend.migrate_users_to_separate_collections
"""

import asyncio
import logging
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def migrate_users():
    """Migrate users from single collection to three separate collections"""
    logger.info("=" * 60)
    logger.info("Starting user migration")
    logger.info("=" * 60)
    
    try:
        # Connect to database
        logger.info("Connecting to database...")
        client = AsyncIOMotorClient(settings.MONGODB_URL)
        db = client[settings.DATABASE_NAME]
        logger.info("Connected to database")
        
        # Check if users collection exists
        collections = await db.list_collection_names()
        if "users" not in collections:
            logger.warning("Users collection does not exist. Nothing to migrate.")
            return
        
        # Get all users
        logger.info("Fetching all users from users collection...")
        users_cursor = db.users.find({})
        users = []
        async for user in users_cursor:
            users.append(user)
        
        logger.info(f"Found {len(users)} users to migrate")
        
        if len(users) == 0:
            logger.info("No users to migrate. Migration complete.")
            return
        
        # Count users by role
        recruiters = [u for u in users if u.get("role") == "RECRUITER"]
        consultants = [u for u in users if u.get("role") == "CONSULTANT"]
        admins = [u for u in users if u.get("role") == "ADMIN"]
        other = [u for u in users if u.get("role") not in ["RECRUITER", "CONSULTANT", "ADMIN"]]
        
        logger.info(f"Users by role:")
        logger.info(f"  - Recruiters: {len(recruiters)}")
        logger.info(f"  - Consultants: {len(consultants)}")
        logger.info(f"  - Admins: {len(admins)}")
        if other:
            logger.warning(f"  - Other/Unknown roles: {len(other)}")
        
        # Migrate recruiters
        if recruiters:
            logger.info(f"Migrating {len(recruiters)} recruiters...")
            for user in recruiters:
                user_doc = dict(user)
                # Check if email already exists in target collection
                existing = await db.recruiters.find_one({"email": user_doc.get("email")})
                if not existing:
                    await db.recruiters.insert_one(user_doc)
                    # Also ensure it's in users collection
                    existing_user = await db.users.find_one({"email": user_doc.get("email")})
                    if not existing_user:
                        await db.users.insert_one(user_doc)
                    logger.debug(f"Migrated recruiter: {user_doc.get('email')}")
                else:
                    logger.warning(f"Recruiter with email {user_doc.get('email')} already exists in recruiters collection. Skipping.")
            logger.info(f"Migrated {len(recruiters)} recruiters")
        
        # Migrate consultants
        if consultants:
            logger.info(f"Migrating {len(consultants)} consultants...")
            for user in consultants:
                user_doc = dict(user)
                # Check if email already exists in target collection
                existing = await db.consultants.find_one({"email": user_doc.get("email")})
                if not existing:
                    await db.consultants.insert_one(user_doc)
                    # Also ensure it's in users collection
                    existing_user = await db.users.find_one({"email": user_doc.get("email")})
                    if not existing_user:
                        await db.users.insert_one(user_doc)
                    logger.debug(f"Migrated consultant: {user_doc.get('email')}")
                else:
                    logger.warning(f"Consultant with email {user_doc.get('email')} already exists in consultants collection. Skipping.")
            logger.info(f"Migrated {len(consultants)} consultants")
        
        # Migrate admins
        if admins:
            logger.info(f"Migrating {len(admins)} admins...")
            for user in admins:
                user_doc = dict(user)
                # Check if email already exists in target collection
                existing = await db.admins.find_one({"email": user_doc.get("email")})
                if not existing:
                    await db.admins.insert_one(user_doc)
                    # Also ensure it's in users collection
                    existing_user = await db.users.find_one({"email": user_doc.get("email")})
                    if not existing_user:
                        await db.users.insert_one(user_doc)
                    logger.debug(f"Migrated admin: {user_doc.get('email')}")
                else:
                    logger.warning(f"Admin with email {user_doc.get('email')} already exists in admins collection. Skipping.")
            logger.info(f"Migrated {len(admins)} admins")
        
        # Handle other roles
        if other:
            logger.warning(f"Found {len(other)} users with unknown roles. They will not be migrated.")
            for user in other:
                logger.warning(f"  - User {user.get('email')} has role: {user.get('role')}")
        
        logger.info("=" * 60)
        logger.info("Migration completed successfully!")
        logger.info("=" * 60)
        logger.info("NOTE: The 'users' collection is maintained as a unified view.")
        logger.info("All future operations will keep both the role-specific collections")
        logger.info("and the users collection in sync automatically.")
        logger.info("=" * 60)
        
    except Exception as e:
        logger.error(f"Migration failed: {str(e)}", exc_info=True)
        raise
    finally:
        client.close()


if __name__ == "__main__":
    asyncio.run(migrate_users())

