# Consultant Tracker - Complete Application Structure

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Backend Structure](#backend-structure)
4. [Frontend Structure](#frontend-structure)
5. [Database Structure](#database-structure)
6. [Data Flow](#data-flow)
7. [File-by-File Breakdown](#file-by-file-breakdown)

---

## Overview

**Consultant Tracker** is a full-stack web application for managing consultants, recruiters, and job submissions. It follows a **3-tier architecture**:

- **Frontend**: React-based SPA (Single Page Application)
- **Backend**: FastAPI REST API
- **Database**: MongoDB (NoSQL)

### Tech Stack
- **Backend**: FastAPI, Motor (async MongoDB), Pydantic, JWT, Bcrypt
- **Frontend**: React, React Router, Axios, Material-UI, Tailwind CSS
- **Database**: MongoDB with separate collections per user type

---

## Architecture

### High-Level Architecture

```
┌─────────────────┐
│   React Frontend │  (Port 3000)
│   - Components   │
│   - Contexts     │
│   - API Client   │
└────────┬─────────┘
         │ HTTP/REST
         │ (JWT Auth)
         ▼
┌─────────────────┐
│  FastAPI Backend │  (Port 8000)
│   - Routers      │
│   - Repositories │
│   - Auth         │
└────────┬─────────┘
         │ Motor (async)
         ▼
┌─────────────────┐
│    MongoDB      │  (Port 27017)
│   - Collections  │
│   - Indexes      │
└─────────────────┘
```

### Request Flow

1. **User Action** → Frontend Component
2. **API Call** → `api.js` (Axios client)
3. **HTTP Request** → FastAPI Router
4. **Authentication** → `auth.py` (JWT validation)
5. **Business Logic** → Repository Layer
6. **Database Query** → MongoDB via Motor
7. **Response** → Back through layers to Frontend

---

## Backend Structure

### Directory Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app entry point
│   ├── config.py            # Configuration settings
│   ├── db.py                # Database connection & indexes
│   ├── auth.py              # JWT & password hashing
│   ├── models.py            # Pydantic data models
│   ├── logging_config.py    # Logging setup
│   │
│   ├── routers/             # API endpoints (URL routes)
│   │   ├── auth.py          # /api/auth/* endpoints
│   │   ├── consultants.py  # /api/consultants/* endpoints
│   │   ├── jobs.py          # /api/jobs/* endpoints
│   │   ├── recruiters.py    # /api/recruiters/* endpoints
│   │   └── submissions.py   # /api/submissions/* endpoints
│   │
│   ├── repositories/       # Data access layer (database operations)
│   │   ├── consultants.py   # Consultant profile operations
│   │   ├── consultants_user.py  # Consultant user operations
│   │   ├── recruiters.py    # Recruiter operations
│   │   ├── admins.py        # Admin operations
│   │   ├── jobs.py          # Job operations
│   │   └── submissions.py   # Submission operations
│   │
│   └── schemas/             # MongoDB collection schemas & indexes
│       ├── base.py          # Abstract CollectionSchema class
│       ├── __init__.py      # Schema registry
│       ├── consultants.py   # consultant_profiles collection
│       ├── consultants_user.py  # consultants collection
│       ├── recruiters.py     # recruiters collection
│       ├── admins.py         # admins collection
│       ├── jobs.py           # jobs collection
│       └── submissions.py   # submissions collection
│
├── logs/                    # Application logs
│   ├── app.log              # All application logs
│   ├── errors.log           # Error logs only
│   └── access.log          # API access logs
│
├── uploads/                 # File uploads (resumes)
│   └── resumes/             # Consultant resumes
│
├── tests/                   # Unit tests
├── requirements.txt         # Python dependencies
└── LOGGING.md              # Logging documentation
```

### Backend Layers

#### 1. **Routers Layer** (`app/routers/`)
- **Purpose**: Define HTTP endpoints and handle requests
- **Responsibilities**:
  - Accept HTTP requests
  - Validate authentication (via `auth.py` dependencies)
  - Call repository methods
  - Return HTTP responses
- **Files**:
  - `auth.py`: Registration, login, token refresh
  - `consultants.py`: Consultant profile management
  - `jobs.py`: Job posting management
  - `recruiters.py`: Recruiter profile management
  - `submissions.py`: Job application submissions

**Example Flow**:
```python
# router receives request
@router.get("/consultants/me")
async def get_my_profile(current_user: User = Depends(get_current_user)):
    # calls repository
    profile = await repo.get_by_user_id(current_user.id)
    # returns response
    return profile
```

#### 2. **Repository Layer** (`app/repositories/`)
- **Purpose**: Abstract database operations
- **Responsibilities**:
  - CRUD operations (Create, Read, Update, Delete)
  - Data transformation (MongoDB → Pydantic models)
  - Business logic for data access
- **Files**:
  - Each entity has its own repository
  - Repositories use `get_database()` from `db.py`

**Example**:
```python
class ConsultantRepository:
    async def get_by_user_id(self, user_id: str):
        db = await get_database()
        profile_data = await db.consultant_profiles.find_one(...)
        return ConsultantProfile(**profile_data)
```

#### 3. **Schema Layer** (`app/schemas/`)
- **Purpose**: Define MongoDB collection structure and indexes
- **Responsibilities**:
  - Define collection names
  - Create database indexes (for performance)
  - Register schemas in the schema registry
- **Files**:
  - `base.py`: Abstract `CollectionSchema` class
  - Each collection has its own schema file
  - `__init__.py`: Auto-registers all schemas

**Example**:
```python
class ConsultantsSchema(CollectionSchema):
    @staticmethod
    def get_collection_name():
        return "consultant_profiles"
    
    @staticmethod
    async def create_indexes(db):
        await db.consultant_profiles.create_index("consultant_id")
```

#### 4. **Models Layer** (`app/models.py`)
- **Purpose**: Pydantic models for data validation and serialization
- **Responsibilities**:
  - Define data structures
  - Validate input/output data
  - Type safety
- **Key Models**:
  - `User`, `UserCreate`, `UserLogin`, `UserResponse`
  - `ConsultantProfile`, `ConsultantProfileUpdate`
  - `RecruiterProfile`, `RecruiterProfileUpdate`
  - `JobDescription`, `JobDescriptionCreate`
  - `Submission`, `SubmissionCreate`, `SubmissionUpdate`

#### 5. **Authentication Layer** (`app/auth.py`)
- **Purpose**: JWT token management and password hashing
- **Key Functions**:
  - `get_password_hash()`: Hash passwords with bcrypt
  - `verify_password()`: Verify password against hash
  - `create_access_token()`: Generate JWT tokens
  - `get_current_user()`: Validate JWT and get user
  - `require_role()`, `require_admin()`, etc.: Role-based access control

#### 6. **Database Layer** (`app/db.py`)
- **Purpose**: MongoDB connection and initialization
- **Key Functions**:
  - `init_db()`: Connect to MongoDB, create indexes
  - `get_database()`: Get database instance
  - `close_db()`: Close connection on shutdown
  - `create_indexes()`: Auto-create indexes from schemas

#### 7. **Configuration** (`app/config.py`)
- **Purpose**: Centralized configuration
- **Settings**:
  - Database URL, name
  - JWT secret key, expiration
  - CORS origins
  - File upload limits
  - Logging levels

#### 8. **Main Application** (`app/main.py`)
- **Purpose**: FastAPI app initialization
- **Responsibilities**:
  - Create FastAPI instance
  - Setup CORS middleware
  - Register routers
  - Setup request logging middleware
  - Handle application lifespan (startup/shutdown)

---

## Frontend Structure

### Directory Structure

```
frontend/
├── public/
│   ├── index.html           # HTML template
│   └── manifest.json        # PWA manifest
│
├── src/
│   ├── index.js             # React entry point
│   ├── App.js               # Main app component & routing
│   ├── index.css            # Global styles
│   │
│   ├── api.js               # Axios API client
│   ├── config.js            # Frontend configuration
│   │
│   ├── contexts/
│   │   └── AuthContext.js   # Authentication state management
│   │
│   ├── components/
│   │   ├── auth/
│   │   │   ├── Login.js     # Login page
│   │   │   ├── Register.js  # Registration page
│   │   │   └── ProtectedRoute.js  # Route protection
│   │   │
│   │   ├── consultant/
│   │   │   ├── ConsultantDashboard.js    # Consultant home
│   │   │   ├── ConsultantProfile.js      # Profile management
│   │   │   ├── ConsultantJobs.js         # Browse jobs
│   │   │   └── ConsultantApplications.js # View applications
│   │   │
│   │   ├── recruiter/
│   │   │   ├── RecruiterDashboard.js     # Recruiter home
│   │   │   ├── RecruiterProfile.js        # Profile management
│   │   │   ├── JobManager.js              # Manage job postings
│   │   │   ├── ConsultantList.js          # View consultants
│   │   │   └── SubmissionBoard.js         # Manage submissions
│   │   │
│   │   └── ui/               # Reusable UI components
│   │       ├── button.jsx
│   │       ├── card.jsx
│   │       ├── dialog.jsx
│   │       └── ...
│   │
│   └── utils/
│       └── cn.js             # Utility functions (classnames)
│
├── package.json              # Dependencies & scripts
├── tailwind.config.js        # Tailwind CSS config
└── postcss.config.js         # PostCSS config
```

### Frontend Layers

#### 1. **Entry Point** (`src/index.js`)
- Renders React app
- Wraps app with `AuthProvider`

#### 2. **Main App** (`src/App.js`)
- **Purpose**: Main routing and layout
- **Responsibilities**:
  - Define all routes
  - Show navigation bar
  - Handle authentication state
  - Redirect based on user role

**Route Structure**:
```
/ → Home (redirects based on role)
/login → Login page (public)
/register → Register page (public)
/consultant/dashboard → Consultant dashboard (protected)
/recruiter/dashboard → Recruiter dashboard (protected)
```

#### 3. **API Client** (`src/api.js`)
- **Purpose**: Axios instance with interceptors
- **Features**:
  - Automatic JWT token injection
  - Automatic 401 handling (logout on token expiry)
  - Base URL configuration
  - API method exports (`authAPI`, `consultantAPI`, etc.)

**Example**:
```javascript
export const consultantAPI = {
  getProfile: () => api.get('/consultants/me'),
  updateProfile: (data) => api.put('/consultants/me', data),
  uploadResume: (file) => api.post('/consultants/me/resume', formData)
};
```

#### 4. **Context Layer** (`src/contexts/AuthContext.js`)
- **Purpose**: Global authentication state
- **State**:
  - `user`: Current user object
  - `token`: JWT token
  - `loading`: Loading state
  - `isAuthenticated`: Boolean flag
- **Methods**:
  - `login(email, password)`: Authenticate user
  - `register(userData)`: Register new user
  - `logout()`: Clear auth state
  - `refreshToken()`: Refresh JWT token

#### 5. **Component Layer** (`src/components/`)
- **Auth Components**: Login, Register, ProtectedRoute
- **Consultant Components**: Dashboard, Profile, Jobs, Applications
- **Recruiter Components**: Dashboard, Profile, Job Manager, Submissions
- **UI Components**: Reusable components (buttons, cards, dialogs)

#### 6. **Configuration** (`src/config.js`)
- **Purpose**: Centralized frontend configuration
- **Settings**:
  - API base URL
  - Authentication config
  - Route paths
  - File upload limits
  - UI constants

---

## Database Structure

### MongoDB Collections

The application uses **separate collections** for different user types:

1. **`consultants`** - Consultant user accounts
   - Fields: `_id`, `email`, `name`, `hashed_password`, `role`, `is_active`, `created_at`, `updated_at`, `phone`
   - Indexes: `email` (unique)

2. **`recruiters`** - Recruiter user accounts
   - Fields: `_id`, `email`, `name`, `hashed_password`, `role`, `is_active`, `created_at`, `updated_at`
   - Indexes: `email` (unique)

3. **`admins`** - Admin user accounts
   - Fields: `_id`, `email`, `name`, `hashed_password`, `role`, `is_active`, `created_at`, `updated_at`
   - Indexes: `email` (unique)

4. **`consultant_profiles`** - Consultant profile data
   - Fields: `_id`, `consultant_id`, `experience_years`, `tech_stack`, `available`, `location`, `visa_status`, `professional_summary`, `linkedin_url`, `github_url`, `portfolio_url`, `education`, `certifications`, `phone`, `resume_path`, `tech_stack_proficiency`, `rating`, `notes`
   - Indexes: `consultant_id` (unique)

5. **`recruiter_profiles`** - Recruiter profile data
   - Fields: `_id`, `recruiter_id`, `company_name`, `phone`, `linkedin_url`, `bio`, `location`
   - Indexes: `recruiter_id` (unique)

6. **`jobs`** - Job postings
   - Fields: `_id`, `recruiter_id`, `title`, `description`, `experience_required`, `tech_required`, `location`, `visa_required`, `status`, `notes`, `created_at`, `updated_at`
   - Indexes: `recruiter_id`, `status`

7. **`submissions`** - Job applications
   - Fields: `_id`, `consultant_id`, `recruiter_id`, `jd_id`, `resume_path`, `status`, `comments`, `recruiter_read`, `created_at`, `updated_at`
   - Indexes: `consultant_id`, `recruiter_id`, `jd_id`, `status`

### Database Initialization

1. **On Startup** (`app/main.py` → `lifespan`):
   - Calls `init_db()` from `db.py`
   - Connects to MongoDB
   - Calls `create_indexes()` which:
     - Gets all registered schemas from `schemas/__init__.py`
     - Calls `create_indexes()` on each schema
     - Creates all indexes automatically

2. **Schema Registration** (`app/schemas/__init__.py`):
   - Imports all schema classes
   - Auto-registers them in `_registry`
   - Used by `db.py` to create indexes

---

## Data Flow

### Example: Consultant Updates Profile

```
1. User Action
   └─> ConsultantProfile.js: User fills form and clicks "Save"

2. Frontend API Call
   └─> api.js: consultantAPI.updateProfile(profileData)
       └─> Axios POST /api/consultants/me
           └─> Headers: Authorization: Bearer <token>

3. Backend Router
   └─> routers/consultants.py: update_my_profile()
       └─> Depends(get_current_user) → auth.py
           └─> Validates JWT token
           └─> Returns User object
       └─> Calls repository

4. Repository Layer
   └─> repositories/consultants.py: create_or_update()
       └─> Gets database: await get_database()
       └─> Updates MongoDB: db.consultant_profiles.update_one()
       └─> Returns ConsultantProfile model

5. Response
   └─> Router returns ConsultantProfile
   └─> Frontend receives response
   └─> Component updates UI
```

### Example: Consultant Applies to Job

```
1. User Action
   └─> ConsultantJobs.js: User clicks "Apply" on a job

2. Frontend API Call
   └─> api.js: submissionAPI.create({ jd_id, resume })
       └─> Axios POST /api/submissions/
           └─> FormData with resume file

3. Backend Router
   └─> routers/submissions.py: create_submission()
       └─> Validates user (consultant)
       └─> Saves resume file to uploads/
       └─> Calls repository

4. Repository Layer
   └─> repositories/submissions.py: create()
       └─> Inserts submission into MongoDB
       └─> Returns Submission model

5. Response
   └─> Router returns Submission
   └─> Frontend shows success message
```

---

## File-by-File Breakdown

### Backend Core Files

#### `backend/app/main.py`
- **Purpose**: FastAPI application entry point
- **Key Features**:
  - Creates FastAPI app instance
  - Sets up CORS middleware
  - Registers all routers
  - Adds request logging middleware
  - Handles startup/shutdown lifecycle
- **Links To**:
  - Imports routers from `app/routers/`
  - Uses `app.config.settings`
  - Uses `app.db.init_db()` and `close_db()`
  - Uses `app.logging_config.setup_logging()`

#### `backend/app/config.py`
- **Purpose**: Centralized configuration
- **Key Settings**:
  - `MONGODB_URL`: Database connection string
  - `SECRET_KEY`: JWT secret key
  - `CORS_ORIGINS`: Allowed frontend origins
  - `UPLOAD_DIR`: File upload directory
- **Links To**:
  - Used by `app/db.py` for MongoDB connection
  - Used by `app/auth.py` for JWT settings
  - Used by routers for file uploads

#### `backend/app/db.py`
- **Purpose**: Database connection and index management
- **Key Functions**:
  - `init_db()`: Initialize MongoDB connection
  - `get_database()`: Get database instance
  - `create_indexes()`: Create indexes from schemas
  - `close_db()`: Close connection
- **Links To**:
  - Uses `app.config.settings` for connection
  - Uses `app.schemas.get_all_schemas()` for indexes
  - Called by `app/main.py` on startup

#### `backend/app/auth.py`
- **Purpose**: Authentication and authorization
- **Key Functions**:
  - `get_password_hash()`: Hash passwords
  - `verify_password()`: Verify passwords
  - `create_access_token()`: Generate JWT tokens
  - `get_current_user()`: Validate JWT and get user
  - `require_role()`, `require_admin()`, etc.: Role checks
- **Links To**:
  - Used by all routers via `Depends(get_current_user)`
  - Uses `app.db.get_database()` to fetch users
  - Uses `app.config.settings` for JWT settings

#### `backend/app/models.py`
- **Purpose**: Pydantic data models
- **Key Models**:
  - `User`, `UserCreate`, `UserLogin`, `UserResponse`
  - `ConsultantProfile`, `ConsultantProfileUpdate`
  - `RecruiterProfile`, `RecruiterProfileUpdate`
  - `JobDescription`, `JobDescriptionCreate`
  - `Submission`, `SubmissionCreate`, `SubmissionUpdate`
- **Links To**:
  - Used by routers for request/response validation
  - Used by repositories to convert MongoDB docs to models

### Backend Routers

#### `backend/app/routers/auth.py`
- **Purpose**: Authentication endpoints
- **Endpoints**:
  - `POST /api/auth/register`: Register new user
  - `POST /api/auth/login`: Login user
  - `GET /api/auth/me`: Get current user
  - `POST /api/auth/refresh`: Refresh token
  - `POST /api/auth/logout`: Logout
  - `GET /api/auth/users`: Get all users (admin)
  - `POST /api/auth/users`: Create user (admin)
- **Links To**:
  - Uses `app.auth` for authentication
  - Uses repositories (`RecruiterRepository`, `ConsultantUserRepository`, `AdminRepository`)

#### `backend/app/routers/consultants.py`
- **Purpose**: Consultant profile endpoints
- **Endpoints**:
  - `GET /api/consultants/me`: Get own profile
  - `PUT /api/consultants/me`: Update own profile
  - `GET /api/consultants/`: Get all consultants (recruiter/admin)
  - `GET /api/consultants/{user_id}`: Get specific consultant
  - `POST /api/consultants/me/resume`: Upload resume
  - `GET /api/consultants/me/resume`: Download resume
  - `GET /api/consultants/me/stats`: Get application statistics
- **Links To**:
  - Uses `ConsultantRepository` from `app/repositories/consultants.py`
  - Uses `app.auth.require_recruiter_or_admin` for authorization

#### `backend/app/routers/jobs.py`
- **Purpose**: Job posting endpoints
- **Endpoints**:
  - `GET /api/jobs/`: Get all jobs
  - `POST /api/jobs/`: Create job (recruiter/admin)
  - `GET /api/jobs/{id}`: Get specific job
  - `PUT /api/jobs/{id}`: Update job (recruiter/admin)
  - `DELETE /api/jobs/{id}`: Delete job (recruiter/admin)
- **Links To**:
  - Uses `JobRepository` from `app/repositories/jobs.py`

#### `backend/app/routers/submissions.py`
- **Purpose**: Job application endpoints
- **Endpoints**:
  - `GET /api/submissions/`: Get all submissions
  - `POST /api/submissions/`: Create submission (consultant)
  - `GET /api/submissions/{id}`: Get specific submission
  - `PUT /api/submissions/{id}`: Update submission status
- **Links To**:
  - Uses `SubmissionRepository` from `app/repositories/submissions.py`

#### `backend/app/routers/recruiters.py`
- **Purpose**: Recruiter profile endpoints
- **Endpoints**:
  - `GET /api/recruiters/me`: Get own profile
  - `PUT /api/recruiters/me`: Update own profile
- **Links To**:
  - Uses `RecruiterRepository` from `app/repositories/recruiters.py`

### Backend Repositories

#### `backend/app/repositories/consultants.py`
- **Purpose**: Consultant profile database operations
- **Key Methods**:
  - `get_by_user_id()`: Get profile by consultant ID
  - `get_all()`: Get all profiles
  - `create_or_update()`: Create or update profile
- **Links To**:
  - Uses `app.db.get_database()`
  - Returns `ConsultantProfile` from `app.models`

#### `backend/app/repositories/consultants_user.py`
- **Purpose**: Consultant user account operations
- **Key Methods**:
  - `create()`: Create consultant user
  - `get_by_email()`: Get user by email
  - `get_all()`: Get all consultant users
- **Links To**:
  - Uses `app.db.get_database()`
  - Uses `app.auth.get_password_hash()`

#### `backend/app/repositories/recruiters.py`
- **Purpose**: Recruiter user and profile operations
- **Key Methods**:
  - `create()`: Create recruiter user
  - `get_by_email()`: Get user by email
  - `get_profile()`: Get recruiter profile
  - `update_profile()`: Update recruiter profile
- **Links To**:
  - Uses `app.db.get_database()`
  - Uses `app.auth.get_password_hash()`

#### `backend/app/repositories/jobs.py`
- **Purpose**: Job posting operations
- **Key Methods**:
  - `create()`: Create job posting
  - `get_all()`: Get all jobs
  - `get_by_id()`: Get job by ID
  - `update()`: Update job
  - `delete()`: Delete job
- **Links To**:
  - Uses `app.db.get_database()`
  - Returns `JobDescription` from `app.models`

#### `backend/app/repositories/submissions.py`
- **Purpose**: Submission operations
- **Key Methods**:
  - `create()`: Create submission
  - `get_all()`: Get all submissions
  - `get_by_id()`: Get submission by ID
  - `update()`: Update submission status
- **Links To**:
  - Uses `app.db.get_database()`
  - Returns `Submission` from `app.models`

### Backend Schemas

#### `backend/app/schemas/base.py`
- **Purpose**: Abstract base class for collection schemas
- **Key Methods**:
  - `get_collection_name()`: Return collection name
  - `create_indexes()`: Create indexes
- **Links To**:
  - Inherited by all schema classes

#### `backend/app/schemas/__init__.py`
- **Purpose**: Schema registry
- **Key Features**:
  - Imports all schema classes
  - Auto-registers them
  - Provides `get_all_schemas()` function
- **Links To**:
  - Used by `app/db.py` to create indexes

#### `backend/app/schemas/consultants.py`
- **Purpose**: `consultant_profiles` collection schema
- **Key Features**:
  - Defines collection name
  - Creates indexes on `consultant_id`
- **Links To**:
  - Registered in `app/schemas/__init__.py`

### Frontend Core Files

#### `frontend/src/index.js`
- **Purpose**: React entry point
- **Key Features**:
  - Renders `App` component
  - Wraps with `AuthProvider`
- **Links To**:
  - Imports `App.js`
  - Imports `AuthContext.js`

#### `frontend/src/App.js`
- **Purpose**: Main app component and routing
- **Key Features**:
  - Defines all routes
  - Shows navigation bar
  - Handles authentication state
- **Links To**:
  - Uses `AuthContext` via `useAuth()`
  - Imports all component pages
  - Uses `ProtectedRoute` for auth

#### `frontend/src/api.js`
- **Purpose**: Axios API client
- **Key Features**:
  - Automatic JWT injection
  - 401 error handling
  - API method exports
- **Links To**:
  - Uses `config.js` for base URL
  - Used by all components

#### `frontend/src/contexts/AuthContext.js`
- **Purpose**: Global authentication state
- **Key Features**:
  - Manages user state
  - Manages JWT token
  - Provides auth methods
- **Links To**:
  - Uses `api.js` for API calls
  - Used by `App.js` and all components

#### `frontend/src/config.js`
- **Purpose**: Frontend configuration
- **Key Features**:
  - API base URL
  - Route paths
  - File upload limits
  - UI constants
- **Links To**:
  - Used by `api.js`
  - Used by components

### Frontend Components

#### `frontend/src/components/auth/Login.js`
- **Purpose**: Login page
- **Links To**:
  - Uses `AuthContext.login()`
  - Uses `api.js` via context

#### `frontend/src/components/auth/Register.js`
- **Purpose**: Registration page
- **Links To**:
  - Uses `AuthContext.register()`

#### `frontend/src/components/consultant/ConsultantDashboard.js`
- **Purpose**: Consultant home page
- **Links To**:
  - Uses `consultantAPI` from `api.js`
  - Shows profile, jobs, applications

#### `frontend/src/components/recruiter/RecruiterDashboard.js`
- **Purpose**: Recruiter home page
- **Links To**:
  - Uses `recruiterAPI`, `jobAPI`, `submissionAPI`
  - Shows jobs, consultants, submissions

---

## Key Connections Summary

### Authentication Flow
```
Frontend (Login.js)
  → api.js (authAPI.login)
    → Backend (routers/auth.py: login)
      → auth.py (authenticate_user)
        → repositories (get user by email)
          → MongoDB (consultants/recruiters/admins)
      → auth.py (create_access_token)
    → Frontend (stores token in localStorage)
```

### Data Access Flow
```
Frontend Component
  → api.js (API method)
    → Backend Router
      → auth.py (get_current_user - validates JWT)
      → Repository
        → db.py (get_database)
          → MongoDB
      → Repository (returns Pydantic model)
    → Router (returns JSON)
  → Frontend (updates UI)
```

### Database Initialization Flow
```
main.py (startup)
  → db.py (init_db)
    → MongoDB (connect)
    → db.py (create_indexes)
      → schemas/__init__.py (get_all_schemas)
        → Each schema (create_indexes)
          → MongoDB (create indexes)
```

---

## Environment Variables

### Backend
- `MONGODB_URL`: MongoDB connection string
- `SECRET_KEY`: JWT secret key
- `CORS_ORIGINS`: Comma-separated allowed origins
- `DATABASE_NAME`: Database name (default: `consultant_tracker`)
- `LOG_LEVEL`: Logging level (default: `INFO`)

### Frontend
- `REACT_APP_API_URL`: Backend API URL (default: `http://localhost:8000/api`)
- `REACT_APP_API_TIMEOUT`: API timeout in ms (default: `30000`)

---

## Summary

This application follows a **clean architecture** with clear separation of concerns:

1. **Frontend**: React SPA with context-based state management
2. **Backend**: FastAPI with router → repository → database layers
3. **Database**: MongoDB with schema-based index management
4. **Authentication**: JWT-based with role-based access control

Each layer has a specific responsibility and communicates through well-defined interfaces, making the codebase maintainable and scalable.

