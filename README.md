# Talentra

A role-based Applicant Tracking System (ATS) designed to streamline job applications, candidate management, and recruitment workflows. The platform enables candidates to apply and track job applications, recruiters to manage assigned candidates and update hiring stages, and administrators to oversee the entire system. Enhanced with AI-powered resume building, role-based access control, real-time application tracking, and downloadable reports, the system provides a structured and scalable solution for modern recruitment processes.

## 🌟 Features & Roles

### 1. Candidate (Job Seeker)
* **Job Discovery & Application:** View full job details and apply by selecting an existing resume or uploading a new one.
* **Application Tracking:** Read-only view of application status through stages: *Applied → Online Assessment → Interview → Offer → Rejected*.
* **Profile Management:** Manage personal details (Visa Status, City, Skills) and Experience Level (Fresher, 1–3 yrs, 3–5 yrs, 5+ yrs).
* **Resume Management:** Upload and manage a maximum of **2 resumes**. Download or replace them as needed.
* **AI Resume Builder:** A dedicated sidebar tool to generate, improve, and export resumes using AI.
* **Candidate Dashboard:** Quick access to My Jobs, Application Tracker, Profile, and Resume Manager.

### 2. Recruiter (Hiring Manager)
* **Candidate Assignment:** **(Exclusive)** Recruiters can only access and manage candidates explicitly assigned to them by the Admin.
* **Job Posting & Management:** Create, edit, and close job postings with AI-suggested skills, experience levels, and locations.
* **Application Tracker Management:** Update candidate stages (Assessment, Interview, etc.) and add remarks/notes.
* **Submissions Management:** Review profiles and resumes of candidates who applied to posted jobs.
* **Reports & Export:** Download CSV reports containing Company Name, Job Title, Candidate Name, Status, and Recruiter Name.
* **Recruiter Dashboard:** Overview of assigned candidates, status counts, and recent activity.

### 3. Admin (System Admin)
* **Candidate-Recruiter Assignment:** The core authority to assign specific candidates to recruiters and reassign them if needed.
* **User Management:** Create, update, and deactivate users. Manage RBAC roles (Admin / Recruiter / Candidate).
* **System Oversight:** Full access to all jobs, trackers, and submissions with override rights.
* **Global Dashboard:** High-level metrics: Total Candidates, Total Recruiters, Active Jobs, and Application Status breakdown.
* **Reports & Analytics:** Access full system data and export global performance metrics.

---

## 🛠 Tech Stack

### Backend
- **FastAPI** - High-performance Python web framework
- **PostgreSQL** - Open-source relational database
- **SQLAlchemy** - Python SQL Toolkit and ORM
- **Alembic** - Database migration tool
- **JWT** - Secure authentication and session management
- **Bcrypt** - Password hashing
- **Python 3.8+** - Core logic

### Frontend
- **React 18** - UI library
- **Tailwind CSS** - Utility-first styling
- **TanStack Query** - State management and caching
- **React Router v6** - Client-side routing
- **Lucide React** - Modern iconography
- **Axios** - HTTP client

---

## 📁 Project Structure

```text
Consultant-Tracker
├── README.md
├── RecruitOps.session.sql
├── backend
│   ├── app
│   │   ├── core          # Config, Security
│   │   ├── db            # Database sessions
│   │   ├── models        # DB Tables (Jobs, Users, Submissions, Assignments)
│   │   ├── routers       # API Endpoints (Auth, Candidates, Recruiters, Reports)
│   │   ├── schemas       # Pydantic Models
│   │   └── services      # Business Logic (ATS, AI Resume Builder)
│   ├── main.py
│   └── requirements.txt
├── frontend
│   ├── src
│   │   ├── api           # API connections
│   │   ├── components    # UI Components
│   │   ├── contexts      # Auth Context
│   │   ├── pages         # Role-specific pages (Admin, Recruiter, Candidate)
│   │   └── App.js
└── docker-compose.yml
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
   python -m venv .venv
   # Windows: .venv\Scripts\activate
   # Mac/Linux: source .venv/bin/activate
   ```

3. **Install dependencies:**
   ```
   pip install -r requirements.txt
   ```

4. **Configure environment variables:(Create a .env file inside the backend/ directory)**
   ```
   DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database_name>
   SECRET_KEY=your_secret_key
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

5. **Run Database Migrations**
   ```
   alembic upgrade head
   ```

6. **Run the backend:**
   ```
   uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```


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

---

### Authentication (`/api/auth`)

| Method | Endpoint             | Description              | Auth Required |
| ------ | -------------------- | ------------------------ | ------------- |
| POST   | `/api/auth/register` | Register a new user      | No            |
| POST   | `/api/auth/login`    | Login user (returns JWT) | No            |
| GET    | `/api/auth/me`       | Get current user info    | Yes           |
| POST   | `/api/auth/refresh`  | Refresh access token     | Yes           |
| POST   | `/api/auth/logout`   | Logout user              | Yes           |


### Users(Admin only) (`/api/admin`)

| Method | Endpoint                       | Description                                  | Auth Required |
| ------ | ------------------------------ | -------------------------------------------- | ------------- |
| GET    | `/api/admin/users`             | List all system users                        | Admin         |
| POST   | `/api/admin/users`             | Create specific user (Recruiter / Candidate) | Admin         |
| PUT    | `/api/admin/users/{id}/status` | Activate / Deactivate user                   | Admin         |
| POST   | `/api/admin/assign`            | Assign Candidate to Recruiter                | Admin         |
| PUT    | `/api/admin/reassign`          | Reassign Candidate to different Recruiter    | Admin         |
| GET    | `/api/reports/system`          | Export Global System Report (CSV)            | Admin         |


### Candidates (`/api/candidates`)

| Method | Endpoint                       | Description                               | Auth Required |
| ------ | ------------------------------ | ----------------------------------------- | ------------- |
| PUT    | `/api/candidates/profile`      | Update profile (Visa, Experience, Skills) | Candidate     |
| GET    | `/api/candidates/resumes`      | List uploaded resumes                     | Candidate     |
| POST   | `/api/candidates/resumes`      | Upload resume (Max 2)                     | Candidate     |
| DELETE | `/api/candidates/resumes/{id}` | Delete a resume                           | Candidate     |
| POST   | `/api/candidates/ai-resume`    | Generate / Improve Resume with AI         | Candidate     |
| GET    | `/api/candidates/stats`        | Get application tracking stats            | Candidate     |



### Recruiters (`/api/recruiters`)

| Method | Endpoint                        | Description                             | Auth Required |
| ------ | ------------------------------- | --------------------------------------- | ------------- |
| GET    | `/api/recruiters/my-candidates` | List only assigned candidates           | Recruiter     |
| GET    | `/api/recruiters/dashboard`     | Get dashboard stats (assigned / active) | Recruiter     |
| GET    | `/api/reports/recruiter`        | Export Recruiter Report (CSV)           | Recruiter     |



### Jobs (`/api/jobs`)

| Method | Endpoint         | Description        | Auth Required     |
| ------ | ---------------- | ------------------ | ----------------- |
| GET    | `/api/jobs`      | List all open jobs | Yes               |
| GET    | `/api/jobs/{id}` | Get job details    | Yes               |
| POST   | `/api/jobs`      | Post a new job     | Recruiter / Admin |
| PUT    | `/api/jobs/{id}` | Edit job details   | Recruiter / Admin |
| DELETE | `/api/jobs/{id}` | Close / Delete job | Recruiter / Admin |



### Submissions (`/api/submissions`)

| Method | Endpoint                           | Description                                       | Auth Required |
| ------ | ---------------------------------- | ------------------------------------------------- | ------------- |
| POST   | `/api/submissions/apply`           | Apply to job (Select Resume)                      | Candidate     |
| GET    | `/api/submissions/my-applications` | Track status (Applied / Interview / Offer / etc.) | Candidate     |
| GET    | `/api/submissions/job/{id}`        | View applicants for a specific job                | Recruiter     |
| PUT    | `/api/submissions/{id}/stage`      | Update stage (Interview / Offer / Reject)         | Recruiter     |
| PUT    | `/api/submissions/{id}/remarks`    | Add notes / remarks to application                | Recruiter     |






