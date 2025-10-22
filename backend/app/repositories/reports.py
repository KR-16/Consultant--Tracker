from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from app.db import get_database
from app.models import (
    StatusReport, TechReport, RecruiterReport, FunnelReport, TimeToStageReport,
    SubmissionStatus, SubmissionFilters
)

class ReportsRepository:
    def __init__(self):
        self.submissions_collection = "submissions"
        self.consultants_collection = "consultants"
        self.history_collection = "status_history"

    async def get_status_report(self, filters: Optional[SubmissionFilters] = None) -> List[StatusReport]:
        """Get submissions count by status"""
        db = await get_database()
        
        # Build match query
        match_query = {}
        if filters:
            if filters.consultant_id:
                match_query["consultant_id"] = filters.consultant_id
            if filters.recruiter:
                match_query["recruiter"] = {"$regex": filters.recruiter, "$options": "i"}
            if filters.client_or_job:
                match_query["client_or_job"] = {"$regex": filters.client_or_job, "$options": "i"}
            if filters.date_from or filters.date_to:
                date_query = {}
                if filters.date_from:
                    date_query["$gte"] = filters.date_from
                if filters.date_to:
                    date_query["$lte"] = filters.date_to
                match_query["submitted_on"] = date_query

        pipeline = [
            {"$match": match_query},
            {"$group": {"_id": "$status", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]
        
        cursor = db[self.submissions_collection].aggregate(pipeline)
        results = await cursor.to_list(length=None)
        
        total = sum(result["count"] for result in results)
        
        status_reports = []
        for result in results:
            percentage = (result["count"] / total * 100) if total > 0 else 0
            status_reports.append(StatusReport(
                status=result["_id"],
                count=result["count"],
                percentage=round(percentage, 2)
            ))
        
        return status_reports

    async def get_tech_report(self, filters: Optional[SubmissionFilters] = None) -> List[TechReport]:
        """Get submissions count by tech stack"""
        db = await get_database()
        
        # Build match query for submissions
        submission_match = {}
        if filters:
            if filters.consultant_id:
                submission_match["consultant_id"] = filters.consultant_id
            if filters.recruiter:
                submission_match["recruiter"] = {"$regex": filters.recruiter, "$options": "i"}
            if filters.client_or_job:
                submission_match["client_or_job"] = {"$regex": filters.client_or_job, "$options": "i"}
            if filters.date_from or filters.date_to:
                date_query = {}
                if filters.date_from:
                    date_query["$gte"] = filters.date_from
                if filters.date_to:
                    date_query["$lte"] = filters.date_to
                submission_match["submitted_on"] = date_query

        pipeline = [
            {"$match": submission_match},
            {
                "$lookup": {
                    "from": self.consultants_collection,
                    "localField": "consultant_id",
                    "foreignField": "_id",
                    "as": "consultant"
                }
            },
            {"$unwind": "$consultant"},
            {"$unwind": "$consultant.tech_stack"},
            {"$group": {"_id": "$consultant.tech_stack", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]
        
        cursor = db[self.submissions_collection].aggregate(pipeline)
        results = await cursor.to_list(length=None)
        
        total = sum(result["count"] for result in results)
        
        tech_reports = []
        for result in results:
            percentage = (result["count"] / total * 100) if total > 0 else 0
            tech_reports.append(TechReport(
                tech=result["_id"],
                count=result["count"],
                percentage=round(percentage, 2)
            ))
        
        return tech_reports

    async def get_recruiter_report(self, filters: Optional[SubmissionFilters] = None) -> List[RecruiterReport]:
        """Get recruiter productivity report"""
        db = await get_database()
        
        # Build match query
        match_query = {}
        if filters:
            if filters.consultant_id:
                match_query["consultant_id"] = filters.consultant_id
            if filters.recruiter:
                match_query["recruiter"] = {"$regex": filters.recruiter, "$options": "i"}
            if filters.client_or_job:
                match_query["client_or_job"] = {"$regex": filters.client_or_job, "$options": "i"}
            if filters.date_from or filters.date_to:
                date_query = {}
                if filters.date_from:
                    date_query["$gte"] = filters.date_from
                if filters.date_to:
                    date_query["$lte"] = filters.date_to
                match_query["submitted_on"] = date_query

        pipeline = [
            {"$match": match_query},
            {
                "$group": {
                    "_id": "$recruiter",
                    "total_submissions": {"$sum": 1},
                    "interviews": {
                        "$sum": {
                            "$cond": [{"$eq": ["$status", SubmissionStatus.INTERVIEW]}, 1, 0]
                        }
                    },
                    "offers": {
                        "$sum": {
                            "$cond": [{"$eq": ["$status", SubmissionStatus.OFFER]}, 1, 0]
                        }
                    },
                    "joined": {
                        "$sum": {
                            "$cond": [{"$eq": ["$status", SubmissionStatus.JOINED]}, 1, 0]
                        }
                    }
                }
            },
            {
                "$addFields": {
                    "win_rate": {
                        "$cond": [
                            {"$gt": ["$total_submissions", 0]},
                            {"$multiply": [{"$divide": ["$joined", "$total_submissions"]}, 100]},
                            0
                        ]
                    }
                }
            },
            {"$sort": {"total_submissions": -1}}
        ]
        
        cursor = db[self.submissions_collection].aggregate(pipeline)
        results = await cursor.to_list(length=None)
        
        recruiter_reports = []
        for result in results:
            recruiter_reports.append(RecruiterReport(
                recruiter=result["_id"],
                total_submissions=result["total_submissions"],
                interviews=result["interviews"],
                offers=result["offers"],
                joined=result["joined"],
                win_rate=round(result["win_rate"], 2)
            ))
        
        return recruiter_reports

    async def get_funnel_report(self, filters: Optional[SubmissionFilters] = None) -> List[FunnelReport]:
        """Get pipeline funnel report"""
        db = await get_database()
        
        # Build match query
        match_query = {}
        if filters:
            if filters.consultant_id:
                match_query["consultant_id"] = filters.consultant_id
            if filters.recruiter:
                match_query["recruiter"] = {"$regex": filters.recruiter, "$options": "i"}
            if filters.client_or_job:
                match_query["client_or_job"] = {"$regex": filters.client_or_job, "$options": "i"}
            if filters.date_from or filters.date_to:
                date_query = {}
                if filters.date_from:
                    date_query["$gte"] = filters.date_from
                if filters.date_to:
                    date_query["$lte"] = filters.date_to
                match_query["submitted_on"] = date_query

        pipeline = [
            {"$match": match_query},
            {"$group": {"_id": "$status", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]
        
        cursor = db[self.submissions_collection].aggregate(pipeline)
        results = await cursor.to_list(length=None)
        
        # Define funnel stages in order
        funnel_stages = [
            SubmissionStatus.SUBMITTED,
            SubmissionStatus.INTERVIEW,
            SubmissionStatus.OFFER,
            SubmissionStatus.JOINED
        ]
        
        stage_counts = {result["_id"]: result["count"] for result in results}
        total_submissions = sum(stage_counts.values())
        
        funnel_reports = []
        previous_count = total_submissions
        
        for stage in funnel_stages:
            count = stage_counts.get(stage, 0)
            conversion_rate = (count / previous_count * 100) if previous_count > 0 else 0
            
            funnel_reports.append(FunnelReport(
                stage=stage,
                count=count,
                conversion_rate=round(conversion_rate, 2)
            ))
            
            previous_count = count
        
        return funnel_reports

    async def get_time_to_stage_report(self, filters: Optional[SubmissionFilters] = None) -> List[TimeToStageReport]:
        """Get average time between stages"""
        db = await get_database()
        
        # Build match query for status history
        match_query = {}
        if filters:
            if filters.date_from or filters.date_to:
                date_query = {}
                if filters.date_from:
                    date_query["$gte"] = filters.date_from
                if filters.date_to:
                    date_query["$lte"] = filters.date_to
                match_query["changed_at"] = date_query

        pipeline = [
            {"$match": match_query},
            {
                "$lookup": {
                    "from": self.submissions_collection,
                    "localField": "submission_id",
                    "foreignField": "_id",
                    "as": "submission"
                }
            },
            {"$unwind": "$submission"},
            {
                "$match": {
                    "$and": [
                        {"old_status": {"$ne": None}},
                        {"new_status": {"$ne": None}}
                    ]
                }
            },
            {
                "$group": {
                    "_id": {
                        "from_stage": "$old_status",
                        "to_stage": "$new_status"
                    },
                    "avg_days": {"$avg": "$days_between"},
                    "count": {"$sum": 1}
                }
            },
            {"$sort": {"count": -1}}
        ]
        
        # Calculate days between status changes
        cursor = db[self.history_collection].find(match_query).sort("changed_at", 1)
        stage_transitions = {}
        
        async for entry in cursor:
            submission_id = entry["submission_id"]
            if submission_id not in stage_transitions:
                stage_transitions[submission_id] = []
            
            stage_transitions[submission_id].append({
                "status": entry["new_status"],
                "date": entry["changed_at"]
            })
        
        # Calculate average days between stages
        stage_stats = {}
        for submission_id, transitions in stage_transitions.items():
            for i in range(1, len(transitions)):
                prev_transition = transitions[i-1]
                curr_transition = transitions[i]
                
                days_diff = (curr_transition["date"] - prev_transition["date"]).days
                key = f"{prev_transition['status']}->{curr_transition['status']}"
                
                if key not in stage_stats:
                    stage_stats[key] = {"total_days": 0, "count": 0}
                
                stage_stats[key]["total_days"] += days_diff
                stage_stats[key]["count"] += 1
        
        time_reports = []
        for key, stats in stage_stats.items():
            from_stage, to_stage = key.split("->")
            avg_days = stats["total_days"] / stats["count"] if stats["count"] > 0 else 0
            
            time_reports.append(TimeToStageReport(
                from_stage=from_stage,
                to_stage=to_stage,
                avg_days=round(avg_days, 2),
                count=stats["count"]
            ))
        
        return sorted(time_reports, key=lambda x: x.count, reverse=True)
