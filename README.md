# Consultant Tracker (RecruitOps) - Authentication System
A comprehensive, full-stack Recruitment and Applicant Tracking System (ATS) built with a modular FastAPI backend and a responsive React frontend, backed by a robust PostgreSQL relational database architecture.

## Tech Stack

### Backend
- **FastAPI** - Python web framework
- **PostgreSQ** - Open-source relational database.
- **SQLAlchemy** - Python SQL Toolkit and ORM.
- **Alembic** - Token-based authentication
- **Bcrypt** - Password hashing
- **Pydantic** - Data validation and settings management.

### Frontend
- **React** - UI library
- **Tailwind CSS** - Utility-first CSS framework for styling.
- **Lucide React** - Modern icon set.
- **React Router** - Routing
- **Axios** - HTTP client

## Features

- Role-Based Access Control (RBAC) - Admin, Talent Manager, and Candidate roles.
- Secure Authentication - JWT (JSON Web Tokens) with Bcrypt password hashing.
- Job Management - Managers can post, edit, and close job listings.
- Application Tracking - Candidates can apply to jobs and track status (Applied, Interview, Offer, etc.).
- Dashboard Analytics - Real-time visualization of pipeline data and activity.
- Resume Management - Upload and manage resume links.
- Mock ATS Scoring - Simulated AI scoring for resume-to-job matching.

## Project Structure

```
Consultant--Tracker
├── README.md
├── backend
│   ├── Dockerfile
│   ├── app
│   │   ├── auth.py
│   │   ├── db.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── repositories
│   │   │   ├── consultants.py
│   │   │   ├── jobs.py
│   │   │   ├── submissions.py
│   │   │   └── users.py
│   │   └── routers
│   │       ├── auth.py
│   │       ├── consultants.py
│   │       ├── jobs.py
│   │       └── submissions.py
│   ├── requirements.txt
│   └── uploads
├── docker-compose.yml
├── frontend
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── robots.txt
│   └── src
│       ├── App.js
│       ├── api.js
│       ├── components
│       │   ├── auth
│       │   │   ├── ForgotPassword.js
│       │   │   ├── Login.js
│       │   │   ├── ProtectedRoute.js
│       │   │   ├── Register.js
│       │   │   └── ResetPassword.js
│       │   ├── consultant
│       │   │   ├── ConsultantApplications.js
│       │   │   ├── ConsultantDashboard.js
│       │   │   ├── ConsultantJobs.js
│       │   │   └── ConsultantProfile.js
│       │   └── recruiter
│       │       ├── ConsultantList.js
│       │       ├── JobManager.js
│       │       ├── RecruiterDashboard.js
│       │       └── SubmissionBoard.js
│       ├── contexts
│       │   └── AuthContext.js
│       └── index.js
└── mongo-init
    └── init-db.js
```

## Setup Instructions

### Backend Setup

1. **Navigate to backend directory:**
   ```
   cd backend
   ```

2. **Create virtual environment:**
   ```
   python -m venv .venv
   ```

3. **Activate virtual environment:**
   - Windows:
     ```
     .venv\Scripts\activate
     ```
   - Linux/Mac:
     ```
     source .venv/bin/activate
     ```

4. **Install dependencies:**
   ```
   pip install -r requirements.txt
   ```

5. **Configure Environment:**
   - Create a .env file inside backend/ and add your database connection
   ```
   - DATABASE_URL=postgresql://recruit_user:recruit_password@localhost:5432/recruitops_db
   ```

6. **Run Database Migrations**
   - This creates the tables in PostgreSQL
   ```
   - alembic upgrade head
   ```

7. **Run the backend:**
   ```
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```
   cd frontend
   ```

2. **Install dependencies:**
   ```h
   npm install
   ```

3. **Start the frontend:**
   ```
   npm start
   ```

The frontend will run on `http://localhost:3000` (or next available port).

## API Endpoints

### Authentication
   - `POST /auth/login` - Login (returns JWT)
   - `POST /auth/register` - New User Registration

### Jobs
   - `GET /api/jobs/` - List all open jobs
   - `POST /api/jobs/` - Create a job (Manager only)
   - `GET /api/jobs/my-jobs` - List jobs created by current manager

### Submissions (Applications)
   - `POST /api/submissions/apply` - Apply for a job (Candidate)
   - `GET /api/submissions/my-applications` - Track application history
   - `GET /api/submissions/job/{id}` - View applicants for a job (Manager)
   - `PUT /api/submissions/{id}/status` - Update status (Interview, Offer, etc.)

### Users (Admin)
   - `GET /api/users/` - List all system users
   - `POST /api/users/` - Manually create users
   - `DELETE /api/users/{id}` - Delete a user


## User Roles

1. **ADMIN** - Full system access, user management
2. **RECRUITER** - Post jobs, review submissions, manage candidates
3. **CANDIDATE** - View jobs, apply, track application status.

## Environment Variables

### Backend

- `DATABASE_URL` - Postgres Connection String (default: `postgresql://user:pass@localhost:5432/db`)
- `SECRET_KEY` - JWT secret key (default: `your-secret-key-change-this-in-production`)

### Frontend

- `REACT_APP_API_URL` - Backend API URL (default: `http://localhost:8000`)


