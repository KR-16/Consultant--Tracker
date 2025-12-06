# Architecture Overview - Consultant Tracker

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                     (http://localhost:3000)                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP Requests
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    REACT FRONTEND                                │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Login/     │  │  Consultant  │  │  Recruiter   │         │
│  │   Register   │  │  Dashboard   │  │  Dashboard   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────────────────────────────────────────┐          │
│  │         UI Components (Tailwind CSS)             │          │
│  │  Button | Input | Card | Label | etc.            │          │
│  └──────────────────────────────────────────────────┘          │
│                                                                  │
│  ┌──────────────────────────────────────────────────┐          │
│  │         State Management (React Context)          │          │
│  │  - AuthContext (user, login, logout)             │          │
│  └──────────────────────────────────────────────────┘          │
│                                                                  │
│  ┌──────────────────────────────────────────────────┐          │
│  │         Configuration (config.js)                 │          │
│  │  - API URLs, Routes, Constants                   │          │
│  └──────────────────────────────────────────────────┘          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ API Calls (Axios)
                             │ /api/auth/*, /api/jobs/*, etc.
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FASTAPI BACKEND                               │
│                  (http://localhost:8000)                         │
│                                                                  │
│  ┌──────────────────────────────────────────────────┐          │
│  │         API Routers (Endpoints)                   │          │
│  │  /api/auth/*  |  /api/consultants/*              │          │
│  │  /api/jobs/*  |  /api/submissions/*              │          │
│  └──────────────────────────────────────────────────┘          │
│                             │                                    │
│                             ▼                                    │
│  ┌──────────────────────────────────────────────────┐          │
│  │         Authentication (auth.py)                  │          │
│  │  - JWT Token validation                          │          │
│  │  - Password hashing (bcrypt)                     │          │
│  │  - Role-based access control                     │          │
│  └──────────────────────────────────────────────────┘          │
│                             │                                    │
│                             ▼                                    │
│  ┌──────────────────────────────────────────────────┐          │
│  │         Repositories (Database Layer)             │          │
│  │  - users.py  | consultants.py                    │          │
│  │  - jobs.py   | submissions.py                    │          │
│  └──────────────────────────────────────────────────┘          │
│                             │                                    │
│                             ▼                                    │
│  ┌──────────────────────────────────────────────────┐          │
│  │         Configuration (config.py)                 │          │
│  │  - Database, Security, CORS settings             │          │
│  └──────────────────────────────────────────────────┘          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ Database Queries
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MONGODB DATABASE                              │
│                  (mongodb://localhost:27017)                     │
│                                                                  │
│  Collections:                                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  users   │  │consultants│  │   jobs   │  │submissions│      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Request Flow Example: User Login

```
1. USER enters email/password in Login form
   │
   ▼
2. FRONTEND (Login.js)
   - Validates input
   - Calls login() from AuthContext
   │
   ▼
3. FRONTEND (AuthContext.js)
   - Calls authAPI.login(email, password)
   │
   ▼
4. FRONTEND (api.js)
   - Makes POST request to /api/auth/login
   │
   ▼
5. BACKEND (routers/auth.py)
   - Receives login request
   - Calls authenticate_user()
   │
   ▼
6. BACKEND (auth.py)
   - Hashes password
   - Queries database for user
   │
   ▼
7. DATABASE (MongoDB)
   - Returns user document
   │
   ▼
8. BACKEND (auth.py)
   - Verifies password
   - Creates JWT token
   - Returns token to frontend
   │
   ▼
9. FRONTEND (AuthContext.js)
   - Stores token in localStorage
   - Updates user state
   - Redirects to dashboard
   │
   ▼
10. USER sees their dashboard
```

---

## 📊 Data Flow Diagram

```
┌──────────────┐
│   Browser    │
└──────┬───────┘
       │
       │ 1. User Action (click, type, etc.)
       ▼
┌──────────────┐
│ React        │
│ Component    │◄─────┐
└──────┬───────┘      │
       │              │ 7. Update UI
       │ 2. Call API  │
       ▼              │
┌──────────────┐      │
│   api.js     │      │
│  (Axios)     │      │
└──────┬───────┘      │
       │              │
       │ 3. HTTP Request
       ▼              │
┌──────────────┐      │
│   Router     │      │
│  (FastAPI)   │      │
└──────┬───────┘      │
       │              │
       │ 4. Process   │
       ▼              │
┌──────────────┐      │
│ Repository   │      │
│ (Database)   │      │
└──────┬───────┘      │
       │              │
       │ 5. Query     │
       ▼              │
┌──────────────┐      │
│   MongoDB    │      │
└──────┬───────┘      │
       │              │
       │ 6. Return Data
       └──────────────┘
```

---

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────────┐
│                    AUTHENTICATION                        │
└─────────────────────────────────────────────────────────┘

Registration:
User → Frontend → POST /api/auth/register → Backend
                                           ↓
                                    Hash Password
                                           ↓
                                    Save to MongoDB
                                           ↓
                                    Return Success

Login:
User → Frontend → POST /api/auth/login → Backend
                                        ↓
                                  Find User in DB
                                        ↓
                                  Verify Password
                                        ↓
                                  Create JWT Token
                                        ↓
                                  Return Token
                                        ↓
Frontend stores token in localStorage

Protected Request:
Frontend → Add "Authorization: Bearer {token}" header
        ↓
Backend → Verify JWT token
        ↓
Backend → Extract user from token
        ↓
Backend → Check user role
        ↓
Backend → Allow/Deny request
```

---

## 🎨 Frontend Component Hierarchy

```
App.js (Main Router)
│
├── Login.js
│   ├── Button (UI)
│   ├── Input (UI)
│   └── Label (UI)
│
├── Register.js
│   ├── Button (UI)
│   ├── Input (UI)
│   └── Label (UI)
│
├── ConsultantDashboard.js
│   ├── ConsultantProfile.js
│   ├── ConsultantJobs.js
│   └── ConsultantApplications.js
│
└── RecruiterDashboard.js
    ├── ConsultantList.js
    ├── JobManagement.js
    └── SubmissionTracking.js

UI Components (Reusable):
├── button.jsx
├── input.jsx
├── label.jsx
└── card.jsx
```

---

## 🗄️ Database Schema

```
users Collection:
{
  _id: ObjectId,
  email: String (unique),
  name: String,
  hashed_password: String,
  role: String (ADMIN | RECRUITER | CONSULTANT),
  created_at: DateTime
}

consultants Collection:
{
  _id: ObjectId,
  user_id: String (ref: users),
  skills: [String],
  experience: Number,
  resume_path: String,
  availability: String,
  created_at: DateTime
}

jobs Collection:
{
  _id: ObjectId,
  title: String,
  description: String,
  requirements: [String],
  location: String,
  status: String (OPEN | CLOSED | ON_HOLD),
  created_by: String (ref: users),
  created_at: DateTime
}

submissions Collection:
{
  _id: ObjectId,
  job_id: String (ref: jobs),
  consultant_id: String (ref: consultants),
  status: String (SUBMITTED | UNDER_REVIEW | ...),
  submitted_at: DateTime,
  updated_at: DateTime
}
```

---

## 🔧 Configuration Flow

```
Environment Variables (.env)
        │
        ▼
Backend: config.py
- Reads from os.getenv()
- Provides settings object
        │
        ▼
Used throughout backend:
- main.py (CORS, API prefix)
- auth.py (SECRET_KEY, JWT)
- db.py (MONGODB_URL)

Frontend: .env
        │
        ▼
Frontend: config.js
- Reads from process.env
- Exports config objects
        │
        ▼
Used throughout frontend:
- api.js (API_BASE_URL)
- Components (ROUTES, USER_ROLES)
```

---

## 📁 File Dependencies

```
Backend Dependencies:
main.py
  ├── imports: config.py
  ├── imports: db.py
  └── imports: routers/*.py
      └── imports: auth.py
          └── imports: models.py

Frontend Dependencies:
index.js
  └── imports: App.js
      ├── imports: config.js
      ├── imports: contexts/AuthContext.js
      │   └── imports: api.js
      └── imports: components/*
          └── imports: components/ui/*
              └── imports: utils/cn.js
```

---

## 🚀 Deployment Architecture (Future)

```
┌──────────────────────────────────────────────┐
│              Production Setup                 │
└──────────────────────────────────────────────┘

Frontend (Static Files):
- Build: npm run build
- Deploy to: Vercel / Netlify / S3
- URL: https://yourapp.com

Backend (API):
- Deploy to: Heroku / AWS / DigitalOcean
- URL: https://api.yourapp.com

Database:
- MongoDB Atlas (Cloud)
- URL: mongodb+srv://...

Flow:
User → Frontend (CDN) → API (Server) → Database (Cloud)
```

---

**This architecture provides:**
- ✅ Clear separation of concerns
- ✅ Scalable structure
- ✅ Easy to maintain
- ✅ Secure authentication
- ✅ Modular components
