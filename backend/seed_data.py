import asyncio
from datetime import datetime, timedelta
from app.db import init_db, get_database
from app.repositories.consultants import ConsultantRepository
from app.repositories.submissions import SubmissionRepository
from app.models import ConsultantCreate, SubmissionCreate

async def seed_data():
    """Seed the database with sample data"""
    await init_db()
    
    consultant_repo = ConsultantRepository()
    submission_repo = SubmissionRepository()
    
    # Sample consultants
    consultants_data = [
        {
            "name": "John Smith",
            "experience_years": 5,
            "tech_stack": ["React", "Node.js", "MongoDB", "AWS"],
            "available": True,
            "location": "San Francisco, CA",
            "visa_status": "H1B",
            "rating": "EXCELLENT",
            "email": "john.smith@email.com",
            "phone": "+1555010101",
            "notes": "Strong full-stack developer with excellent communication skills"
        },
        {
            "name": "Sarah Johnson",
            "experience_years": 3,
            "tech_stack": ["Python", "Django", "PostgreSQL", "Docker"],
            "available": True,
            "location": "Austin, TX",
            "visa_status": "GREEN_CARD",
            "rating": "GOOD",
            "email": "sarah.johnson@email.com",
            "phone": "+1555010102",
            "notes": "Backend specialist with DevOps experience"
        },
        {
            "name": "Mike Chen",
            "experience_years": 7,
            "tech_stack": ["Java", "Spring Boot", "Kubernetes", "Azure"],
            "available": False,
            "location": "Seattle, WA",
            "visa_status": "CITIZEN",
            "rating": "EXCELLENT",
            "email": "mike.chen@email.com",
            "phone": "+1555010103",
            "notes": "Senior Java developer, currently on assignment"
        },
        {
            "name": "Emily Davis",
            "experience_years": 2,
            "tech_stack": ["Vue.js", "PHP", "MySQL", "AWS"],
            "available": True,
            "location": "Denver, CO",
            "visa_status": "OTHER",
            "rating": "AVERAGE",
            "email": "emily.davis@email.com",
            "phone": "+1555010104",
            "notes": "Junior developer, eager to learn and grow"
        },
        {
            "name": "David Wilson",
            "experience_years": 8,
            "tech_stack": ["Angular", "C#", ".NET", "Azure", "Docker"],
            "available": True,
            "location": "Chicago, IL",
            "visa_status": "H1B",
            "rating": "EXCELLENT",
            "email": "david.wilson@email.com",
            "phone": "+1555010105",
            "notes": "Enterprise architect with strong leadership skills"
        }
    ]
    
    # Create consultants
    created_consultants = []
    for consultant_data in consultants_data:
        consultant = await consultant_repo.create(ConsultantCreate(**consultant_data))
        created_consultants.append(consultant)
        print(f"Created consultant: {consultant.name}")
    
    # Sample submissions
    submissions_data = [
        {
            "consultant_id": created_consultants[0].id,
            "client_or_job": "TechCorp - Senior React Developer",
            "recruiter": "Alice Brown",
            "submitted_on": datetime.now() - timedelta(days=10),
            "status": "INTERVIEW",
            "comments": "Initial screening completed, technical interview scheduled"
        },
        {
            "consultant_id": created_consultants[0].id,
            "client_or_job": "StartupXYZ - Full Stack Developer",
            "recruiter": "Bob Green",
            "submitted_on": datetime.now() - timedelta(days=5),
            "status": "SUBMITTED",
            "comments": "Recently submitted, waiting for client response"
        },
        {
            "consultant_id": created_consultants[1].id,
            "client_or_job": "DataFlow Inc - Python Developer",
            "recruiter": "Alice Brown",
            "submitted_on": datetime.now() - timedelta(days=15),
            "status": "OFFER",
            "comments": "Client is preparing offer letter"
        },
        {
            "consultant_id": created_consultants[1].id,
            "client_or_job": "CloudTech - DevOps Engineer",
            "recruiter": "Carol White",
            "submitted_on": datetime.now() - timedelta(days=20),
            "status": "JOINED",
            "comments": "Successfully placed and started work"
        },
        {
            "consultant_id": created_consultants[2].id,
            "client_or_job": "Enterprise Solutions - Java Architect",
            "recruiter": "David Black",
            "submitted_on": datetime.now() - timedelta(days=30),
            "status": "JOINED",
            "comments": "Currently working on this assignment"
        },
        {
            "consultant_id": created_consultants[3].id,
            "client_or_job": "WebDev Co - Frontend Developer",
            "recruiter": "Alice Brown",
            "submitted_on": datetime.now() - timedelta(days=7),
            "status": "REJECTED",
            "comments": "Client decided to go with internal candidate"
        },
        {
            "consultant_id": created_consultants[4].id,
            "client_or_job": "FinanceApp - .NET Developer",
            "recruiter": "Bob Green",
            "submitted_on": datetime.now() - timedelta(days=12),
            "status": "INTERVIEW",
            "comments": "Technical interview completed, waiting for feedback"
        },
        {
            "consultant_id": created_consultants[4].id,
            "client_or_job": "Healthcare Corp - Senior Developer",
            "recruiter": "Carol White",
            "submitted_on": datetime.now() - timedelta(days=25),
            "status": "ON_HOLD",
            "comments": "Project temporarily on hold due to budget constraints"
        }
    ]
    
    # Create submissions
    for submission_data in submissions_data:
        submission = await submission_repo.create(SubmissionCreate(**submission_data))
        print(f"Created submission: {submission.client_or_job} for {submission.consultant_id}")
    
    print("\nSeed data creation completed successfully!")
    print(f"Created {len(created_consultants)} consultants and {len(submissions_data)} submissions")

if __name__ == "__main__":
    asyncio.run(seed_data())
