import logging
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.core.security import get_password_hash
from app.models.users import User, UserRole, CandidateProfile

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def seed_users():
    db: Session = SessionLocal()
    
    users = [
        # 1. Admin
        {
            "email": "admin@example.com",
            "first_name": "Admin",
            "last_name": "User",
            "password": "admin123",  
            "role": UserRole.ADMIN
        },
        # 2. Hiring Manager
        {
            "email": "manager@example.com",
            "first_name": "Hiring",
            "last_name": "Manager",
            "password": "manager123",
            "role": UserRole.HIRING_MANAGER 
        },
        # 3. Candidate
        {
            "email": "candidate@example.com",
            "first_name": "John",
            "last_name": "Candidate",
            "password": "candidate123", 
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
                    first_name=user_data["first_name"],
                    last_name=user_data["last_name"],
                    hashed_password=get_password_hash(user_data["password"]),
                    role=user_data["role"],
                    is_active=True
                )
                db.add(new_user)
                db.commit()
                db.refresh(new_user)
                
        
                if user_data["role"] == UserRole.CANDIDATE:
                    profile = CandidateProfile(
                        user_id=new_user.id,
                        current_city="Remote",
                        experience_level="Fresher"
                    )
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