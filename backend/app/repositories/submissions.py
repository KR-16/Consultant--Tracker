from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.submissions import Submission, SubmissionStatus
from app.schemas.submissions import SubmissionCreate

class SubmissionRepository:
    def create(self, db: Session, sub_in: SubmissionCreate, candidate_id: int):
        existing = db.query(Submission).filter(
            Submission.job_id == sub_in.job_id,
            Submission.candidate_id == candidate_id
        ).first()
        if existing:
            raise ValueError("You have already applied for this job.")

        db_sub = Submission(
            job_id=sub_in.job_id,
            candidate_id=candidate_id,
            resume_used=sub_in.resume_used,
            status=SubmissionStatus.APPLIED
        )
        db.add(db_sub)
        db.commit()
        db.refresh(db_sub)
        return db_sub

    def get_by_candidate(self, db: Session, candidate_id: int):
        # Return submissions with Job details loaded
        return db.query(Submission).filter(Submission.candidate_id == candidate_id).all()

    def get_by_job(self, db: Session, job_id: int):
        return db.query(Submission).filter(Submission.job_id == job_id).all()
        
    def update_status(self, db: Session, submission_id: int, status: SubmissionStatus, ats_score: float = None):
        submission = db.query(Submission).filter(Submission.id == submission_id).first()
        if submission:
            submission.status = status
            if ats_score is not None:
                submission.ats_score = ats_score
            db.commit()
            db.refresh(submission)
        return submission