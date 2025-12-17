# Consultant Tracker
A comprehensive full-stack Recruitment & Applicant Tracking System (ATS) built with a modular FastAPI backend and a responsive React frontend, powered by a PostgreSQL relational database. The system manages consultants, recruiters, job postings, and job submissions using a clean, scalable architecture that supports role-based access control (RBAC).

## Features

### Core Features
- Role-Based Access Control (RBAC) - Admin, Talent Manager, and Candidate roles.
- Secure Authentication - JWT (JSON Web Tokens) with Bcrypt password hashing.
- Job Management - Managers can post, edit, and close job listings.
- Application Tracking - Candidates can apply to jobs and track status (Applied, Interview, Offer, etc.).
- Dashboard Analytics - Real-time visualization of pipeline data and activity.
- Resume Management - Upload and manage resume links.
- Mock ATS Scoring - Simulated AI scoring for resume-to-job matching.

### User Roles

1. **ADMIN** - Full system access, user management
2. **MANAGER** - Post jobs, review submissions, manage candidates.
3. **CANDIDATE** - View jobs, apply, track application status.

---

## 🛠 Tech Stack

### Backend
- **FastAPI**     - High-performance Python web framework
- **PostgreSQL**  - Open-source relational database
- **SQLAlchemy**  - Python SQL Toolkit and ORM
- **Alembic**     - Database migration tool
- **JWT**         - Data validation and settings management
- **Bcrypt**      - Password hashing (passlib)
- **Python 3.8+** - Programming language

### Frontend
- **React 18**        - UI library
- **Tailwind CSS**    - Utility-first CSS framework for styling.
- **TanStack Query**  - Server state management and caching.
- **React Router v6** - Client-side routing.
- **Lucide React**    - Modern icon set.
- **Axios**           - HTTP client.

---

## 📁 Project Structure

```
Consultant-Tracker
├── README.md
├── RecruitOps.session.sql
├── backend
│   ├── Dockerfile
│   ├── app
│   │   ├── core
│   │   │   ├── __init__.py
│   │   │   ├── config.py
│   │   │   └── security.py
│   │   ├── db
│   │   │   ├── base.py
│   │   │   └── session.py
│   │   ├── dependencies.py
│   │   ├── main.py
│   │   ├── models
│   │   │   ├── __init__.py
│   │   │   ├── jobs.py
│   │   │   ├── submissions.py
│   │   │   └── users.py
│   │   ├── repositories
│   │   │   ├── jobs.py
│   │   │   ├── submissions.py
│   │   │   └── users.py
│   │   ├── routers
│   │   │   ├── auth.py
│   │   │   ├── jobs.py
│   │   │   ├── submissions.py
│   │   │   └── users.py
│   │   ├── schemas
│   │   │   ├── common.py
│   │   │   ├── jobs.py
│   │   │   ├── submissions.py
│   │   │   └── users.py
│   │   └── services
│   │       └── ats_service.py
│   ├── requirements.txt
│   └── seed.py
├── docker-compose.yml
├── frontend
│   ├── Dockerfile
│   ├── jsconfig.json
│   ├── nginx.conf
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   │   ├── index.html
│   │   ├── manifest.json
│   │   ├── placeholder.svg
│   │   └── robots.txt
│   ├── src
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── api
│   │   │   ├── auth.js
│   │   │   ├── candidates.js
│   │   │   ├── client.js
│   │   │   ├── jobs.js
│   │   │   └── submissions.js
│   │   ├── components
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── layout
│   │   │   │   ├── Layout.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   └── ui
│   │   │       ├── button.jsx
│   │   │       ├── card.jsx
│   │   │       ├── checkbox.jsx
│   │   │       ├── dialog.jsx
│   │   │       ├── dropdown-menu.jsx
│   │   │       ├── input.jsx
│   │   │       ├── label.jsx
│   │   │       ├── select.jsx
│   │   │       ├── table.jsx
│   │   │       ├── toaster.jsx
│   │   │       └── use-toast.js
│   │   ├── contexts
│   │   │   └── AuthContext.js
│   │   ├── hooks
│   │   │   └── useAuth.js
│   │   ├── index.css
│   │   ├── index.js
│   │   ├── lib
│   │   │   └── utils.js
│   │   └── pages
│   │       ├── Availability.jsx
│   │       ├── Landing.jsx
│   │       ├── NotFound.jsx
│   │       ├── Reports.jsx
│   │       ├── admin
│   │       │   └── UserManagement.jsx
│   │       ├── auth
│   │       │   ├── Login.jsx
│   │       │   └── Register.jsx
│   │       ├── candidates
│   │       │   ├── CandidateDetails.jsx
│   │       │   ├── CandidateJobs.jsx
│   │       │   ├── CandidateResume.jsx
│   │       │   ├── CandidateTracker.jsx
│   │       │   └── Candidates.jsx
│   │       ├── dashboard
│   │       │   └── Dashboard.jsx
│   │       └── submissions
│   │           ├── SubmissionDetails.jsx
│   │           └── Submissions.jsx
│   └── tailwind.config.js
├── package-lock.json
└── package.json
```

## Getting Started

### Prerequisites

- **Python 3.8+**
- **Node.js 16+** 
- **PostgreSQL(Local installation OR Docker Desktop)**


### Backend Setup

1. **Navigate to backend directory:**
   ```
   cd backend
   ```

2. **Create and activate virtual environment:**
   ```
   # Windows
   python -m venv .venv
   .venv\Scripts\activate

   # Linux/Mac
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. **Install dependencies:**
   ```
   pip install -r requirements.txt
   ```

4. **Configure environment variables:(Create a .env file inside the backend/ directory)**
   ```
   # Update user/password/db to match your local Postgres setup
   DATABASE_URL=postgresql://recruit_user:recruit_password@localhost:5432/recruitops_db
   SECRET_KEY=your_secret_key_here
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

5. **Run Database Migrations**
   ```
   alembic upgrade head
   ```

6. **Run the backend:**
   ```
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```
   The API will be available at:
   - Docs: `http://localhost:8000/docs` 


### Frontend Setup

1. **Navigate to frontend directory:**
   ```
   cd frontend
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Start the frontend:**
   ```
   npm start
   ```
   The frontend will run on `http://localhost:3000`.

---

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/login` | Register a new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user info | Yes |
| POST | `/api/auth/refresh` | Refresh access token | Yes |
| POST | `/api/auth/logout` | Logout user | Yes |
| GET | `/api/auth/users` | List all users | Admin |
| POST | `/api/auth/users` | Create user | Admin |
| PUT | `/api/auth/users/{id}` | Update user | Admin |
| DELETE | `/api/auth/users/{id}` | Delete user | Admin |

### Consultants (`/api/consultants`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/consultants` | List consultants | Yes |
| GET | `/api/consultants/{id}` | Get consultant profile | Yes |
| POST | `/api/consultants` | Create consultant profile | Consultant |
| PUT | `/api/consultants/{id}` | Update consultant profile | Consultant/Owner |
| DELETE | `/api/consultants/{id}` | Delete consultant profile | Consultant/Owner |
| POST | `/api/consultants/{id}/resume` | Upload resume | Consultant/Owner |
| GET | `/api/consultants/{id}/resume` | Download resume | Yes |
| GET | `/api/consultants/{id}/stats` | Get application statistics | Consultant/Owner |

### Recruiters (`/api/recruiters`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/recruiters` | List recruiters | Yes |
| GET | `/api/recruiters/{id}` | Get recruiter profile | Yes |
| POST | `/api/recruiters` | Create recruiter profile | Recruiter |
| PUT | `/api/recruiters/{id}` | Update recruiter profile | Recruiter/Owner |
| DELETE | `/api/recruiters/{id}` | Delete recruiter profile | Recruiter/Owner |

### Jobs (`/api/jobs`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/jobs` | List jobs | Yes |
| GET | `/api/jobs/{id}` | Get job details | Yes |
| POST | `/api/jobs` | Create job | Recruiter/Admin |
| PUT | `/api/jobs/{id}` | Update job | Recruiter/Admin |
| DELETE | `/api/jobs/{id}` | Delete job | Recruiter/Admin |

### Submissions (`/api/submissions`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/submissions` | List submissions | Yes |
| GET | `/api/submissions/{id}` | Get submission details | Yes |
| POST | `/api/submissions` | Create submission | Consultant |
| PUT | `/api/submissions/{id}` | Update submission | Consultant/Owner |
| DELETE | `/api/submissions/{id}` | Delete submission | Consultant/Owner |
| PUT | `/api/submissions/{id}/status` | Update submission status | Recruiter/Admin |

### Health & Info

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | API information | No |
| GET | `/health` | Health check | No |

---

## 🔐 Authentication

### Register a User

```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "password123",
  "role": "CONSULTANT"
}
```

**Roles**: `ADMIN`, `RECRUITER`, `CONSULTANT`

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### Using the Token

Include the token in the `Authorization` header:

```bash
Authorization: Bearer <access_token>
```

---


