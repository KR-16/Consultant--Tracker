from fastapi import APIRouter, Depends
from app.db import get_database
from app.auth import require_talent_manager_or_admin, User

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/dashboard-stats")
async def get_dashboard_stats(current_user: User = Depends(require_talent_manager_or_admin)):
    db = await get_database()
    
    # Simple aggregations
    candidates_count = await db.users.count_documents({"role": "CANDIDATE"})
    jobs_count = await db.jobs.count_documents({"status": "OPEN"})
    submissions_count = await db.submissions.count_documents({})
    
    return {
        "total_candidates": candidates_count,
        "active_jobs": jobs_count,
        "total_submissions": submissions_count
    }