#!/usr/bin/env python3
"""
Test Resume Upload Functionality
"""
import asyncio
import os
import sys
from io import BytesIO

# Add the backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from app.db import init_db, get_database
from app.services.file_upload import file_upload_service
from app.models import UserCreate, UserRole, JobDescriptionCreate, ApplicationCreate
from app.repositories.users import UserRepository
from app.repositories.job_descriptions import JobDescriptionRepository
from app.repositories.applications import ApplicationRepository

async def test_resume_upload():
    """Test resume upload functionality"""
    print("🧪 Testing Resume Upload Functionality...")
    
    try:
        # Initialize database
        await init_db()
        print("✅ Database initialized")
        
        # Create test users
        user_repo = UserRepository()
        job_repo = JobDescriptionRepository()
        app_repo = ApplicationRepository()
        
        # Create test recruiter
        recruiter_data = UserCreate(
            email="test_recruiter@example.com",
            name="Test Recruiter",
            role=UserRole.RECRUITER,
            password="password123"
        )
        recruiter = await user_repo.create(recruiter_data)
        print(f"✅ Test recruiter created: {recruiter.email}")
        
        # Create test consultant
        consultant_data = UserCreate(
            email="test_consultant@example.com",
            name="Test Consultant",
            role=UserRole.CONSULTANT,
            password="password123"
        )
        consultant = await user_repo.create(consultant_data)
        print(f"✅ Test consultant created: {consultant.email}")
        
        # Create test job
        job_data = JobDescriptionCreate(
            title="Test Developer Position",
            company="Test Company",
            location="Test City",
            description="A test job for resume upload testing",
            requirements=["Python", "FastAPI"],
            tech_stack=["Python", "FastAPI", "MongoDB"],
            experience_years=3,
            salary_range="$80,000 - $100,000",
            employment_type="FULL_TIME",
            recruiter_id=str(recruiter.id)
        )
        job = await job_repo.create(job_data)
        print(f"✅ Test job created: {job.title}")
        
        # Create test application
        application_data = ApplicationCreate(
            job_id=str(job.id),
            consultant_id=str(consultant.id),
            cover_letter="This is a test application for resume upload testing."
        )
        application = await app_repo.create(application_data)
        print(f"✅ Test application created: {application.id}")
        
        # Test file upload service
        print("\n📁 Testing file upload service...")
        
        # Create a mock PDF file
        mock_pdf_content = b"%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n>>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \ntrailer\n<<\n/Size 4\n/Root 1 0 R\n>>\nstartxref\n174\n%%EOF"
        
        # Create mock upload file
        class MockUploadFile:
            def __init__(self, content, filename):
                self.content = content
                self.filename = filename
                self.size = len(content)
                self.content_type = 'application/pdf'
            
            async def read(self):
                return self.content
        
        mock_file = MockUploadFile(mock_pdf_content, "test_resume.pdf")
        
        # Test upload
        file_path = await file_upload_service.upload_resume(mock_file, str(consultant.id), str(application.id))
        print(f"✅ Resume uploaded successfully: {file_path}")
        
        # Test file info
        resume_info = await file_upload_service.get_resume_info(file_path)
        print(f"✅ Resume info retrieved: {resume_info}")
        
        # Test file path
        full_path = await file_upload_service.get_resume_path(file_path)
        print(f"✅ Full path generated: {full_path}")
        
        # Verify file exists
        if os.path.exists(full_path):
            print("✅ File exists on disk")
            file_size = os.path.getsize(full_path)
            print(f"✅ File size: {file_size} bytes")
        else:
            print("❌ File not found on disk")
        
        # Test delete
        deleted = await file_upload_service.delete_resume(file_path)
        if deleted:
            print("✅ Resume deleted successfully")
        else:
            print("❌ Failed to delete resume")
        
        print("\n🎉 Resume upload functionality test completed successfully!")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_resume_upload())
