from fastapi import APIRouter, Depends, Query
from typing import List, Optional
from datetime import datetime
from app.models import (
    StatusReport, TechReport, RecruiterReport, FunnelReport, TimeToStageReport,
    SubmissionFilters
)
from app.repositories.reports import ReportsRepository

router = APIRouter()

# Dependency to get repository
def get_reports_repository():
    return ReportsRepository()

@router.get("/status", response_model=List[StatusReport])
async def get_status_report(
    consultant_id: Optional[str] = Query(None),
    recruiter: Optional[str] = Query(None),
    client_or_job: Optional[str] = Query(None),
    date_from: Optional[datetime] = Query(None),
    date_to: Optional[datetime] = Query(None),
    repo: ReportsRepository = Depends(get_reports_repository)
):
    """Get submissions count by status"""
    filters = SubmissionFilters(
        consultant_id=consultant_id,
        recruiter=recruiter,
        client_or_job=client_or_job,
        date_from=date_from,
        date_to=date_to
    )
    
    return await repo.get_status_report(filters)

@router.get("/tech", response_model=List[TechReport])
async def get_tech_report(
    consultant_id: Optional[str] = Query(None),
    recruiter: Optional[str] = Query(None),
    client_or_job: Optional[str] = Query(None),
    date_from: Optional[datetime] = Query(None),
    date_to: Optional[datetime] = Query(None),
    repo: ReportsRepository = Depends(get_reports_repository)
):
    """Get submissions count by tech stack"""
    filters = SubmissionFilters(
        consultant_id=consultant_id,
        recruiter=recruiter,
        client_or_job=client_or_job,
        date_from=date_from,
        date_to=date_to
    )
    
    return await repo.get_tech_report(filters)

@router.get("/recruiter", response_model=List[RecruiterReport])
async def get_recruiter_report(
    consultant_id: Optional[str] = Query(None),
    recruiter: Optional[str] = Query(None),
    client_or_job: Optional[str] = Query(None),
    date_from: Optional[datetime] = Query(None),
    date_to: Optional[datetime] = Query(None),
    repo: ReportsRepository = Depends(get_reports_repository)
):
    """Get recruiter productivity report"""
    filters = SubmissionFilters(
        consultant_id=consultant_id,
        recruiter=recruiter,
        client_or_job=client_or_job,
        date_from=date_from,
        date_to=date_to
    )
    
    return await repo.get_recruiter_report(filters)

@router.get("/funnel", response_model=List[FunnelReport])
async def get_funnel_report(
    consultant_id: Optional[str] = Query(None),
    recruiter: Optional[str] = Query(None),
    client_or_job: Optional[str] = Query(None),
    date_from: Optional[datetime] = Query(None),
    date_to: Optional[datetime] = Query(None),
    repo: ReportsRepository = Depends(get_reports_repository)
):
    """Get pipeline funnel report"""
    filters = SubmissionFilters(
        consultant_id=consultant_id,
        recruiter=recruiter,
        client_or_job=client_or_job,
        date_from=date_from,
        date_to=date_to
    )
    
    return await repo.get_funnel_report(filters)

@router.get("/time-to-stage", response_model=List[TimeToStageReport])
async def get_time_to_stage_report(
    consultant_id: Optional[str] = Query(None),
    recruiter: Optional[str] = Query(None),
    client_or_job: Optional[str] = Query(None),
    date_from: Optional[datetime] = Query(None),
    date_to: Optional[datetime] = Query(None),
    repo: ReportsRepository = Depends(get_reports_repository)
):
    """Get average time between stages"""
    filters = SubmissionFilters(
        consultant_id=consultant_id,
        recruiter=recruiter,
        client_or_job=client_or_job,
        date_from=date_from,
        date_to=date_to
    )
    
    return await repo.get_time_to_stage_report(filters)

@router.get("/dashboard")
async def get_dashboard_data(
    consultant_id: Optional[str] = Query(None),
    recruiter: Optional[str] = Query(None),
    client_or_job: Optional[str] = Query(None),
    date_from: Optional[datetime] = Query(None),
    date_to: Optional[datetime] = Query(None),
    repo: ReportsRepository = Depends(get_reports_repository)
):
    """Get comprehensive dashboard data"""
    filters = SubmissionFilters(
        consultant_id=consultant_id,
        recruiter=recruiter,
        client_or_job=client_or_job,
        date_from=date_from,
        date_to=date_to
    )
    
    # Get all reports in parallel
    status_report = await repo.get_status_report(filters)
    tech_report = await repo.get_tech_report(filters)
    recruiter_report = await repo.get_recruiter_report(filters)
    funnel_report = await repo.get_funnel_report(filters)
    time_to_stage_report = await repo.get_time_to_stage_report(filters)
    
    return {
        "status_report": status_report,
        "tech_report": tech_report,
        "recruiter_report": recruiter_report,
        "funnel_report": funnel_report,
        "time_to_stage_report": time_to_stage_report,
        "filters_applied": filters.dict(exclude_unset=True)
    }
