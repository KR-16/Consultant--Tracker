# Consultant Tracker - Codebase Structure & Update Guide

## 📁 Project Overview

This is a **full-stack web application** with a FastAPI backend and React frontend, using modern technologies and a clean architecture.

```
Consultant--Tracker/
├── backend/              # Python FastAPI backend
├── frontend/             # React frontend with Tailwind CSS
├── .git/                 # Git repository
├── .gitignore           # Git ignore rules
├── README.md            # Project documentation
└── UI_MODERNIZATION.md  # UI update documentation
```

---

## 🔧 Backend Structure (Python/FastAPI)

### Directory Layout

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry point
│   ├── config.py            # ⭐ Centralized configuration
│   ├── db.py                # Database connection & initialization
│   ├── auth.py              # Authentication utilities (JWT, passwords)
│   ├── models.py            # Pydantic models (data validation)
│   │
│   ├── repositories/        # Database operations (CRUD)
│   │   ├── users.py
│   │   ├── consultants.py
│   │   ├── jobs.py
│   │   └── submissions.py
│   │
│   ├── routers/            # API endpoints (routes)
│   │   ├── auth.py         # /api/auth/* endpoints
│   │   ├── consultants.py  # /api/consultants/* endpoints
│   │   ├── jobs.py         # /api/jobs/* endpoints
│   │   └── submissions.py  # /api/submissions/* endpoints
│   │
│   └── schemas/            # Database schema definitions
│       └── users.py
│
├── tests/                  # Unit tests
├── uploads/                # File uploads (resumes, etc.)
├── .env.example           # Environment variables template
└── requirements.txt       # Python dependencies
```

### Key Backend Files

#### 1. **`app/config.py`** ⭐ MOST IMPORTANT
**Purpose:** Centralized configuration for the entire backend

**What it contains:**
- Database settings (MongoDB URL, database name)
- Security settings (SECRET_KEY, JWT config)
- CORS configuration
- API settings
- File upload settings
- Environment variables

**How to update:**
```python
# To add a new configuration:
class Settings:
    # Add your new setting here
    NEW_SETTING: str = os.getenv("NEW_SETTING", "default_value")
```

#### 2. **`app/main.py`**
**Purpose:** FastAPI application entry point

**What it contains:**
- App initialization
- CORS middleware setup
- Router registration
- Startup/shutdown events

**How to add a new router:**
```python
from app.routers import new_router

app.include_router(new_router.router, prefix=settings.API_PREFIX, tags=["new_feature"])
```

#### 3. **`app/models.py`**
**Purpose:** Pydantic models for data validation

**How to add a new model:**
```python
class NewModel(BaseModel):
    id: Optional[str] = None
    name: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

#### 4. **`app/repositories/`**
**Purpose:** Database operations (CRUD)

**How to create a new repository:**
```python
# app/repositories/new_feature.py
from app.db import get_database

async def create_item(item_data: dict):
    db = await get_database()
    result = await db.collection_name.insert_one(item_data)
    return result.inserted_id
```

#### 5. **`app/routers/`**
**Purpose:** API endpoints

**How to create a new router:**
```python
# app/routers/new_feature.py
from fastapi import APIRouter, Depends
from app.auth import get_current_user

router = APIRouter()

@router.get("/items")
async def get_items(current_user = Depends(get_current_user)):
    # Your logic here
    return {"items": []}
```

---

## 🎨 Frontend Structure (React/Tailwind CSS)

### Directory Layout

```
frontend/
├── public/                 # Static files
│   ├── index.html
│   └── favicon.ico
│
├── src/
│   ├── index.js           # React app entry point
│   ├── index.css          # ⭐ Tailwind CSS & global styles
│   ├── App.js             # Main app component with routing
│   ├── api.js             # API client (Axios)
│   ├── config.js          # ⭐ Centralized frontend configuration
│   │
│   ├── components/        # Reusable components
│   │   ├── auth/          # Authentication components
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── ProtectedRoute.js
│   │   │
│   │   ├── consultant/    # Consultant-specific components
│   │   │   ├── ConsultantDashboard.js
│   │   │   ├── ConsultantProfile.js
│   │   │   ├── ConsultantJobs.js
│   │   │   └── ConsultantApplications.js
│   │   │
│   │   ├── recruiter/     # Recruiter-specific components
│   │   │   ├── RecruiterDashboard.js
│   │   │   ├── ConsultantList.js
│   │   │   ├── JobManagement.js
│   │   │   └── SubmissionTracking.js
│   │   │
│   │   └── ui/            # ⭐ Reusable UI components
│   │       ├── button.jsx
│   │       ├── input.jsx
│   │       ├── label.jsx
│   │       └── card.jsx
│   │
│   ├── contexts/          # React Context (state management)
│   │   └── AuthContext.js
│   │
│   └── utils/             # Utility functions
│       └── cn.js          # Tailwind class merger
│
├── .env.example           # Environment variables template
├── package.json           # Dependencies & scripts
├── tailwind.config.js     # ⭐ Tailwind CSS configuration
└── postcss.config.js      # PostCSS configuration
```

### Key Frontend Files

#### 1. **`src/config.js`** ⭐ MOST IMPORTANT
**Purpose:** Centralized configuration for the entire frontend

**What it contains:**
- API configuration
- Authentication settings
- Route definitions
- User roles
- File upload settings
- UI configuration
- Status constants
- Validation rules

**How to update:**
```javascript
// To add a new configuration:
export const NEW_CONFIG = {
  SETTING_1: 'value1',
  SETTING_2: 'value2',
};
```

#### 2. **`src/App.js`**
**Purpose:** Main application component with routing

**How to add a new route:**
```javascript
<Route path="/new-page" element={
  <ProtectedRoute requiredRole="ADMIN">
    <NewPage />
  </ProtectedRoute>
} />
```

#### 3. **`src/components/ui/`** ⭐ UI Component Library
**Purpose:** Reusable UI components with consistent styling

**Available components:**
- `Button` - Multiple variants (default, outline, ghost, etc.)
- `Input` - Form input fields
- `Label` - Form labels
- `Card` - Card containers with header, content, footer

**How to create a new UI component:**
```javascript
// src/components/ui/new-component.jsx
import * as React from "react"
import { cn } from "../../utils/cn"

const NewComponent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "base-styles-here",
      className
    )}
    {...props}
  />
))
NewComponent.displayName = "NewComponent"

export { NewComponent }
```

#### 4. **`src/index.css`**
**Purpose:** Global styles and Tailwind CSS setup

**Structure:**
```css
@tailwind base;      /* Tailwind base styles */
@tailwind components; /* Tailwind components */
@tailwind utilities;  /* Tailwind utilities */

@layer base {
  :root {
    /* CSS variables for theming */
  }
}
```

#### 5. **`tailwind.config.js`**
**Purpose:** Tailwind CSS configuration

**How to customize:**
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'custom-blue': '#1234ff',
      },
    }
  }
}
```

---

## 🔄 How to Make Future Updates

### Adding a New Feature (Full Stack)

#### Example: Adding a "Projects" feature

**1. Backend (FastAPI)**

```bash
# Step 1: Create model in app/models.py
class Project(BaseModel):
    id: Optional[str] = None
    name: str
    description: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Step 2: Create repository in app/repositories/projects.py
async def create_project(project_data: dict):
    db = await get_database()
    result = await db.projects.insert_one(project_data)
    return result.inserted_id

# Step 3: Create router in app/routers/projects.py
from fastapi import APIRouter, Depends
from app.auth import get_current_user

router = APIRouter()

@router.post("/")
async def create_project(project: Project, user = Depends(get_current_user)):
    # Logic here
    pass

# Step 4: Register router in app/main.py
from app.routers import projects
app.include_router(projects.router, prefix=f"{settings.API_PREFIX}/projects", tags=["projects"])
```

**2. Frontend (React)**

```bash
# Step 1: Add API functions in src/api.js
export const projectAPI = {
  getAll: () => api.get('/projects/'),
  create: (data) => api.post('/projects/', data),
};

# Step 2: Create component in src/components/projects/ProjectList.js
import React from 'react';
import { Card } from '../ui/card';

const ProjectList = () => {
  // Component logic
  return <Card>Projects</Card>;
};

# Step 3: Add route in src/App.js
<Route path="/projects" element={
  <ProtectedRoute>
    <ProjectList />
  </ProtectedRoute>
} />
```

---

### Updating the UI/Styling

#### To change colors:
```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: '#your-color',
    }
  }
}
```

#### To add a new UI component:
```bash
# Create file: src/components/ui/new-component.jsx
# Follow the pattern from button.jsx or input.jsx
# Use the cn() utility for className merging
```

---

### Updating Configuration

#### Backend Configuration:
```python
# backend/app/config.py
class Settings:
    NEW_SETTING: str = os.getenv("NEW_SETTING", "default")

# Then use it anywhere:
from app.config import settings
value = settings.NEW_SETTING
```

#### Frontend Configuration:
```javascript
// frontend/src/config.js
export const NEW_CONFIG = {
  SETTING: 'value'
};

// Then use it:
import { NEW_CONFIG } from './config';
const value = NEW_CONFIG.SETTING;
```

---

### Adding Environment Variables

#### Backend:
```bash
# 1. Add to backend/.env.example
NEW_VARIABLE=default_value

# 2. Add to backend/app/config.py
NEW_VARIABLE: str = os.getenv("NEW_VARIABLE", "default")

# 3. Create/update backend/.env
NEW_VARIABLE=actual_value
```

#### Frontend:
```bash
# 1. Add to frontend/.env.example
REACT_APP_NEW_VARIABLE=default_value

# 2. Add to frontend/src/config.js
export const NEW_CONFIG = {
  VARIABLE: process.env.REACT_APP_NEW_VARIABLE || 'default'
};

# 3. Create/update frontend/.env
REACT_APP_NEW_VARIABLE=actual_value
```

---

## 🛠️ Common Update Scenarios

### 1. Adding a New Page

**Frontend:**
```javascript
// 1. Create component: src/components/pages/NewPage.js
// 2. Add route in src/App.js:
<Route path="/new-page" element={<NewPage />} />
```

### 2. Adding a New API Endpoint

**Backend:**
```python
# 1. Add function in appropriate router file
@router.get("/new-endpoint")
async def new_endpoint():
    return {"message": "Hello"}
```

**Frontend:**
```javascript
// 2. Add to src/api.js
export const newAPI = {
  getData: () => api.get('/new-endpoint'),
};
```

### 3. Updating Styles

**Global styles:**
```css
/* src/index.css */
@layer base {
  /* Add global styles */
}
```

**Component styles:**
```javascript
// Use Tailwind classes directly
<div className="bg-blue-500 text-white p-4 rounded-lg">
```

### 4. Adding Authentication to a Route

**Backend:**
```python
from app.auth import get_current_user, require_role

@router.get("/protected")
async def protected_route(user = Depends(get_current_user)):
    return {"user": user.email}

@router.get("/admin-only")
async def admin_route(user = Depends(require_role(UserRole.ADMIN))):
    return {"message": "Admin access"}
```

**Frontend:**
```javascript
<Route path="/protected" element={
  <ProtectedRoute requiredRole="ADMIN">
    <ProtectedPage />
  </ProtectedRoute>
} />
```

---

## 📚 Technology Stack Reference

### Backend
- **FastAPI** - Web framework
- **MongoDB** - Database
- **Motor** - Async MongoDB driver
- **Pydantic** - Data validation
- **JWT** - Authentication
- **Bcrypt** - Password hashing

### Frontend
- **React** - UI library
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP client
- **lucide-react** - Icons

---

## 🔍 File Naming Conventions

### Backend (Python)
- **Files:** `snake_case.py` (e.g., `user_repository.py`)
- **Classes:** `PascalCase` (e.g., `UserRepository`)
- **Functions:** `snake_case` (e.g., `get_user_by_id`)
- **Constants:** `UPPER_SNAKE_CASE` (e.g., `SECRET_KEY`)

### Frontend (JavaScript/React)
- **Components:** `PascalCase.js` (e.g., `UserProfile.js`)
- **UI Components:** `kebab-case.jsx` (e.g., `button.jsx`)
- **Utilities:** `camelCase.js` (e.g., `formatDate.js`)
- **Constants:** `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`)

---

## 🚀 Development Workflow

### Starting Development

```bash
# 1. Backend
cd backend
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 2. Frontend
cd frontend
npm start
```

### Making Changes

1. **Update code** in appropriate files
2. **Test locally** - changes auto-reload
3. **Commit changes** to Git
4. **Push to repository**

### Adding Dependencies

```bash
# Backend
cd backend
pip install new-package
pip freeze > requirements.txt

# Frontend
cd frontend
npm install new-package
```

---

## 📖 Important Notes

### ⭐ Key Files to Remember

**Backend:**
- `app/config.py` - All configuration
- `app/main.py` - App entry point
- `app/routers/` - API endpoints

**Frontend:**
- `src/config.js` - All configuration
- `src/App.js` - Routing
- `src/components/ui/` - Reusable components

### 🔒 Security Best Practices

1. **Never commit `.env` files** - They contain secrets
2. **Always use `settings` or `config`** - Don't hardcode values
3. **Use environment variables** for sensitive data
4. **Keep dependencies updated** - Run `npm audit` and `pip list --outdated`

### 🎨 UI/UX Best Practices

1. **Use UI components** from `src/components/ui/`
2. **Follow Tailwind conventions** - Use utility classes
3. **Keep components small** - One responsibility per component
4. **Use the `cn()` utility** for className merging

---

## 📞 Getting Help

### Documentation
- **FastAPI:** https://fastapi.tiangolo.com/
- **React:** https://react.dev/
- **Tailwind CSS:** https://tailwindcss.com/
- **MongoDB:** https://www.mongodb.com/docs/

### Project Documentation
- `README.md` - Project overview
- `UI_MODERNIZATION.md` - UI update details
- This file - Codebase structure

---

**Last Updated:** 2025-12-06
**Version:** 1.0.0
**Branch:** addingfeatures
