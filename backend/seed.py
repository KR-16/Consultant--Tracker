import logging
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.core.security import get_password_hash

# --- CRITICAL FIX: Import ALL models so they are registered ---
from app.models.users import User, UserRole, CandidateProfile
from app.models.jobs import Job           # <--- Needed for relationship resolution
from app.models.submissions import Submission # <--- Needed for relationship resolution

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def seed_users():
    db: Session = SessionLocal()
    
    users = [
        {
            "email": "admin@recruitops.com",
            "name": "Admin User",
            "password": "password123",
            "role": UserRole.ADMIN
        },
        {
            "email": "manager@recruitops.com",
            "name": "Talent Manager",
            "password": "password123",
            "role": UserRole.TALENT_MANAGER
        },
        {
            "email": "candidate@recruitops.com",
            "name": "Candidate User",
            "password": "password123",
            "role": UserRole.CANDIDATE
        }
    ]

    try:
        for user_data in users:
            existing_user = db.query(User).filter(User.email == user_data["email"]).first()
            
            if not existing_user:
                logger.info(f"Creating user: {user_data['email']}")
                new_user = User(
                    email=user_data["email"],
                    name=user_data["name"],
                    hashed_password=get_password_hash(user_data["password"]),
                    role=user_data["role"],
                    is_active=True
                )
                db.add(new_user)
                db.commit()
                db.refresh(new_user)
                
                # If candidate, create empty profile
                if user_data["role"] == UserRole.CANDIDATE:
                    profile = CandidateProfile(user_id=new_user.id)
                    db.add(profile)
                    db.commit()
            else:
                logger.info(f"User already exists: {user_data['email']}")
                
    except Exception as e:
        logger.error(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    logger.info("Starting database seed...")
    seed_users()
    logger.info("Database seed completed.")