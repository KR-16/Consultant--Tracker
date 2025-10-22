#!/usr/bin/env python3
"""
Complete Setup Script for Consultant Tracker with MongoDB
"""
import asyncio
import os
import sys
from datetime import datetime

# Add the backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from app.db import init_db, get_database
from app.repositories.users import UserRepository
from app.repositories.job_descriptions import JobDescriptionRepository
from app.repositories.applications import ApplicationRepository
from app.models import UserCreate, UserRole, JobDescriptionCreate, ApplicationCreate, ApplicationStatus

async def setup_database():
    """Complete database setup with sample data"""
    print("🚀 Starting Consultant Tracker Setup...")
    
    try:
        # Initialize database connection
        print("📡 Connecting to MongoDB...")
        await init_db()
        print("✅ Database connection established!")
        
        # Initialize repositories
        user_repo = UserRepository()
        job_repo = JobDescriptionRepository()
        app_repo = ApplicationRepository()
        
        # Create admin user
        print("\n👑 Creating admin user...")
        try:
            admin_data = UserCreate(
                email="admin@consultanttracker.com",
                name="System Administrator",
                role=UserRole.ADMIN,
                password="admin123"
            )
            admin_user = await user_repo.create(admin_data)
            print(f"✅ Admin user created: {admin_user.email}")
        except Exception as e:
            if "already exists" in str(e):
                print("ℹ️  Admin user already exists")
            else:
                print(f"❌ Error creating admin: {e}")
        
        # Create sample recruiter
        print("\n👨‍💼 Creating sample recruiter...")
        try:
            recruiter_data = UserCreate(
                email="recruiter@example.com",
                name="John Recruiter",
                role=UserRole.RECRUITER,
                password="password123"
            )
            recruiter_user = await user_repo.create(recruiter_data)
            print(f"✅ Recruiter created: {recruiter_user.email}")
        except Exception as e:
            if "already exists" in str(e):
                print("ℹ️  Recruiter already exists")
            else:
                print(f"❌ Error creating recruiter: {e}")
        
        # Create sample consultant
        print("\n👨‍💻 Creating sample consultant...")
        try:
            consultant_data = UserCreate(
                email="consultant@example.com",
                name="Jane Consultant",
                role=UserRole.CONSULTANT,
                password="password123"
            )
            consultant_user = await user_repo.create(consultant_data)
            print(f"✅ Consultant created: {consultant_user.email}")
        except Exception as e:
            if "already exists" in str(e):
                print("ℹ️  Consultant already exists")
            else:
                print(f"❌ Error creating consultant: {e}")
        
        # Get users for job creation
        db = await get_database()
        recruiter = await db.users.find_one({"email": "recruiter@example.com"})
        consultant = await db.users.find_one({"email": "consultant@example.com"})
        
        if recruiter:
            # Create sample job descriptions
            print("\n💼 Creating sample job descriptions...")
            sample_jobs = [
                {
                    "title": "Senior React Developer",
                    "company": "TechCorp Inc",
                    "location": "San Francisco, CA",
                    "description": "We are looking for a senior React developer with 5+ years of experience to join our growing team.",
                    "requirements": ["5+ years React experience", "TypeScript knowledge", "Team leadership"],
                    "tech_stack": ["React", "TypeScript", "Node.js", "AWS"],
                    "experience_years": 5,
                    "salary_range": "$120,000 - $150,000",
                    "employment_type": "FULL_TIME",
                    "recruiter_id": str(recruiter["_id"])
                },
                {
                    "title": "Python Backend Developer",
                    "company": "DataFlow Systems",
                    "location": "Austin, TX",
                    "description": "Join our backend team to build scalable Python applications.",
                    "requirements": ["3+ years Python", "Django/FastAPI", "Database design"],
                    "tech_stack": ["Python", "Django", "PostgreSQL", "Docker"],
                    "experience_years": 3,
                    "salary_range": "$90,000 - $120,000",
                    "employment_type": "FULL_TIME",
                    "recruiter_id": str(recruiter["_id"])
                },
                {
                    "title": "Full Stack Developer",
                    "company": "StartupXYZ",
                    "location": "Remote",
                    "description": "Remote full-stack developer position for a fast-growing startup.",
                    "requirements": ["Full-stack experience", "Startup mindset", "Remote work experience"],
                    "tech_stack": ["React", "Node.js", "MongoDB", "AWS"],
                    "experience_years": 4,
                    "salary_range": "$100,000 - $130,000",
                    "employment_type": "FULL_TIME",
                    "recruiter_id": str(recruiter["_id"])
                }
            ]
            
            for job_data in sample_jobs:
                try:
                    job = await job_repo.create(JobDescriptionCreate(**job_data))
                    print(f"✅ Job created: {job.title} at {job.company}")
                except Exception as e:
                    print(f"ℹ️  Job might already exist: {job_data['title']}")
        
        # Create sample applications if consultant exists
        if consultant and recruiter:
            print("\n📝 Creating sample applications...")
            jobs = await job_repo.get_all()
            
            if jobs:
                try:
                    application_data = ApplicationCreate(
                        job_id=jobs[0].id,
                        consultant_id=str(consultant["_id"]),
                        status=ApplicationStatus.APPLIED,
                        cover_letter="I am very interested in this position and believe my skills align well with your requirements."
                    )
                    application = await app_repo.create(application_data)
                    print(f"✅ Application created for: {jobs[0].title}")
                except Exception as e:
                    if "already applied" in str(e):
                        print("ℹ️  Application already exists")
                    else:
                        print(f"❌ Error creating application: {e}")
        
        # Display summary
        print("\n📊 Setup Summary:")
        users_count = await db.users.count_documents({})
        jobs_count = await db.job_descriptions.count_documents({})
        apps_count = await db.applications.count_documents({})
        
        print(f"👥 Total Users: {users_count}")
        print(f"💼 Total Jobs: {jobs_count}")
        print(f"📝 Total Applications: {apps_count}")
        
        print("\n🎉 Setup completed successfully!")
        print("\n🔑 Login Credentials:")
        print("Admin: admin@consultanttracker.com / admin123")
        print("Recruiter: recruiter@example.com / password123")
        print("Consultant: consultant@example.com / password123")
        
        print("\n🚀 Next Steps:")
        print("1. Start backend: cd backend && uv run uvicorn app.main:app --reload")
        print("2. Start frontend: cd frontend && npm start")
        print("3. Visit: http://localhost:3000")
        
    except Exception as e:
        print(f"❌ Setup failed: {e}")
        print("\n🔧 Troubleshooting:")
        print("1. Make sure MongoDB is running")
        print("2. Check MongoDB connection string")
        print("3. Verify Python dependencies are installed")

if __name__ == "__main__":
    asyncio.run(setup_database())
