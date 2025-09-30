import pytest
import pytest_asyncio
from httpx import AsyncClient
from app.main import app
from app.db import init_db
from app.repositories.submissions import SubmissionRepository
from app.repositories.consultants import ConsultantRepository
from app.models import ConsultantCreate, SubmissionCreate
from datetime import datetime, timedelta

@pytest_asyncio.fixture
async def client():
    """Create test client"""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

@pytest_asyncio.fixture
async def setup_test_db():
    """Setup test database"""
    await init_db()
    yield

@pytest_asyncio.fixture
async def sample_consultant():
    """Create a sample consultant for testing"""
    consultant_repo = ConsultantRepository()
    consultant_data = ConsultantCreate(
        name="Test Consultant",
        experience_years=5,
        tech_stack=["Python", "FastAPI"],
        available=True,
        location="Test City",
        visa_status="CITIZEN",
        rating="GOOD",
        email="test@example.com",
        phone="+1-555-0123",
        notes="Test consultant for unit tests"
    )
    consultant = await consultant_repo.create(consultant_data)
    return consultant

class TestSubmissions:
    """Test cases for submission endpoints"""
    
    async def test_create_submission(self, client: AsyncClient, setup_test_db, sample_consultant):
        """Test creating a new submission"""
        submission_data = {
            "consultant_id": sample_consultant.id,
            "client_or_job": "Test Company - Developer",
            "recruiter": "Test Recruiter",
            "submitted_on": datetime.now().isoformat(),
            "status": "SUBMITTED",
            "comments": "Test submission"
        }
        
        response = await client.post("/api/submissions/", json=submission_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data["client_or_job"] == submission_data["client_or_job"]
        assert data["consultant_id"] == submission_data["consultant_id"]
    
    async def test_get_submissions(self, client: AsyncClient, setup_test_db, sample_consultant):
        """Test getting all submissions"""
        # First create a submission
        submission_repo = SubmissionRepository()
        submission_data = SubmissionCreate(
            consultant_id=sample_consultant.id,
            client_or_job="Test Company - Developer",
            recruiter="Test Recruiter",
            submitted_on=datetime.now(),
            status="SUBMITTED",
            comments="Test submission"
        )
        await submission_repo.create(submission_data)
        
        response = await client.get("/api/submissions/")
        assert response.status_code == 200
        
        data = response.json()
        assert len(data) >= 1
    
    async def test_update_submission_status(self, client: AsyncClient, setup_test_db, sample_consultant):
        """Test updating submission status"""
        # First create a submission
        submission_repo = SubmissionRepository()
        submission_data = SubmissionCreate(
            consultant_id=sample_consultant.id,
            client_or_job="Test Company - Developer",
            recruiter="Test Recruiter",
            submitted_on=datetime.now(),
            status="SUBMITTED",
            comments="Test submission"
        )
        submission = await submission_repo.create(submission_data)
        
        # Update status
        status_update = {
            "status": "INTERVIEW",
            "comments": "Status updated to interview"
        }
        
        response = await client.put(
            f"/api/submissions/{submission.id}/status",
            json=status_update,
            params={"changed_by": "Test User"}
        )
        assert response.status_code == 200
        
        data = response.json()
        assert data["status"] == status_update["status"]
    
    async def test_get_submissions_by_consultant(self, client: AsyncClient, setup_test_db, sample_consultant):
        """Test getting submissions by consultant"""
        # Create multiple submissions for the consultant
        submission_repo = SubmissionRepository()
        
        submissions_data = [
            SubmissionCreate(
                consultant_id=sample_consultant.id,
                client_or_job="Company A - Developer",
                recruiter="Recruiter A",
                submitted_on=datetime.now(),
                status="SUBMITTED",
                comments="Test submission 1"
            ),
            SubmissionCreate(
                consultant_id=sample_consultant.id,
                client_or_job="Company B - Developer",
                recruiter="Recruiter B",
                submitted_on=datetime.now(),
                status="INTERVIEW",
                comments="Test submission 2"
            )
        ]
        
        for submission_data in submissions_data:
            await submission_repo.create(submission_data)
        
        response = await client.get(f"/api/submissions/consultant/{sample_consultant.id}")
        assert response.status_code == 200
        
        data = response.json()
        assert len(data) >= 2
        
        # All submissions should belong to the same consultant
        for submission in data:
            assert submission["consultant_id"] == sample_consultant.id
    
    async def test_delete_submission(self, client: AsyncClient, setup_test_db, sample_consultant):
        """Test deleting a submission"""
        # First create a submission
        submission_repo = SubmissionRepository()
        submission_data = SubmissionCreate(
            consultant_id=sample_consultant.id,
            client_or_job="Test Company - Developer",
            recruiter="Test Recruiter",
            submitted_on=datetime.now(),
            status="SUBMITTED",
            comments="Test submission"
        )
        submission = await submission_repo.create(submission_data)
        
        # Delete the submission
        response = await client.delete(f"/api/submissions/{submission.id}")
        assert response.status_code == 200
        
        # Verify submission is deleted
        response = await client.get(f"/api/submissions/{submission.id}")
        assert response.status_code == 404

if __name__ == "__main__":
    pytest.main([__file__])
