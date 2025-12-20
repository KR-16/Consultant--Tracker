from sqlalchemy.orm import Session
from app.models.users import User, CandidateProfile, UserRole
from app.schemas.users import UserCreate, CandidateProfileUpdate
from app.core.security import get_password_hash

class UserRepository:
    def get_by_email(self, db: Session, email: str):
        return db.query(User).filter(User.email == email).first()

    def get_by_id(self, db: Session, user_id: int):
        return db.query(User).filter(User.id == user_id).first()

    def create(self, db: Session, user_in: UserCreate):
        hashed_password = get_password_hash(user_in.password)
        db_user = User(
            email=user_in.email,
            name=user_in.name,
            hashed_password=hashed_password,
            role=user_in.role,
            is_active=user_in.is_active
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        if user_in.role == UserRole.CANDIDATE:
            profile = CandidateProfile(user_id=db_user.id)
            db.add(profile)
            db.commit()
            
        return db_user

    def update_candidate_profile(self, db: Session, user_id: int, profile_in: CandidateProfileUpdate):
        profile = db.query(CandidateProfile).filter(CandidateProfile.user_id == user_id).first()
        if not profile:
            profile = CandidateProfile(user_id=user_id)
            db.add(profile)
        
        update_data = profile_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(profile, field, value)
            
        db.commit()
        db.refresh(profile)
        return profile
    
    def get_candidate_profile(self, db: Session, user_id: int):
        return db.query(CandidateProfile).filter(CandidateProfile.user_id == user_id).first()