# Consultant Tracker

A comprehensive full-stack Recruitment & Applicant Tracking System (ATS) built with a modular FastAPI backend and a responsive React frontend, powered by a PostgreSQL relational database. The system manages consultants, recruiters, job postings, and job submissions using a clean, scalable architecture that supports role-based access control (RBAC) and dynamic module registration.

## 🚀 Features

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

---

## 🏗 Architecture

The application follows a **modular architecture** pattern:

- **Core Layer**: Shared infrastructure (config, database, auth, logging)
- **Modules Layer**: Self-contained business modules
- **Dynamic Registration**: Modules are automatically discovered and registered

Each module contains:
- `router.py` - API endpoints
- `repository.py` - Business logic & data access
- `models.py` - Pydantic models
- `schema.py` - MongoDB collection schema
- `module.py` - Module class implementing BaseModule

For detailed architecture documentation, see [CODEBASE_STRUCTURE.md](./CODEBASE_STRUCTURE.md).

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.8+**
- **Node.js 16+** and npm


### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   # Windows
   python -m venv .venv
   .venv\Scripts\activate

   # Linux/Mac
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

   Or using `uv` (recommended):
   ```bash
   uv pip install -r requirements.txt
   ```

4. **Configure environment variables** (optional):
   ```bash
   # Create .env file or set environment variables
   export MONGODB_URL="mongodb://localhost:27017"
   export DATABASE_NAME="consultant_tracker"
   export SECRET_KEY="your-secret-key-here"
   export ACCESS_TOKEN_EXPIRE_MINUTES=30
   export CORS_ORIGINS="http://localhost:3000,http://localhost:3001"
   ```

5. **Start MongoDB:**
   - Make sure MongoDB is running on `localhost:27017`
   - Or update `MONGODB_URL` to point to your MongoDB instance

6. **Run the backend:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

   The API will be available at:
   - API: `http://localhost:8000/api`
   - Docs: `http://localhost:8000/docs` (Swagger UI)
   - ReDoc: `http://localhost:8000/redoc`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API URL** (if needed):
   - Default: `http://localhost:8000/api`
   - Update in `src/config.js` or set `REACT_APP_API_URL` environment variable

4. **Start the frontend:**
   ```bash
   npm start
   ```

   The frontend will run on `http://localhost:3000` (or next available port).

---

## 📡 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register a new user | No |
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

## ⚙️ Environment Variables

### Backend

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URL` | MongoDB connection string | `mongodb://localhost:27017` |
| `DATABASE_NAME` | Database name | `consultant_tracker` |
| `SECRET_KEY` | JWT secret key | `your-secret-key-change-this-in-production` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration (minutes) | `30` |
| `CORS_ORIGINS` | Comma-separated allowed origins | `http://localhost:3000,http://localhost:3001` |
| `API_PREFIX` | API route prefix | `/api` |

### Frontend

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:8000/api` |

---

## 📊 Database Schema

### Collections

**User Collections:**
- `admins` - Admin user accounts
- `consultants` - Consultant user accounts
- `recruiters` - Recruiter user accounts

**Profile Collections:**
- `consultant_profiles` - Consultant professional profiles
- `recruiter_profiles` - Recruiter profiles

**Business Collections:**
- `job_descriptions` - Job postings
- `submissions` - Job applications

### Indexes

Each collection has optimized indexes:
- User collections: `email` (unique), `is_active`
- Profile collections: `user_id` (unique), `email`
- Business collections: Various indexes for query optimization

---


## 📚 Documentation

- **[CODEBASE_STRUCTURE.md](./CODEBASE_STRUCTURE.md)** - Detailed architecture documentation
- **[TEST_CASES.md](./TEST_CASES.md)** - Test cases and scenarios
- **API Documentation**: Available at `http://localhost:8000/docs` (Swagger UI)

---

## 🔧 Development

### Logging

Logs are stored in `backend/logs/`:
- `app.log` - General application logs
- `errors.log` - Error logs only
- `access.log` - API access logs

### File Uploads

Uploaded files (resumes) are stored in `backend/uploads/`.

### Code Structure

- **Core**: Shared infrastructure in `app/core/`
- **Modules**: Business logic in `app/modules/`
- **Repository Pattern**: Data access abstraction
- **Dependency Injection**: FastAPI's dependency system

---

