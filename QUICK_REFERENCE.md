# Quick Reference Guide - Consultant Tracker

## 🚀 Quick Start Commands

### Start Development Servers
```bash
# Backend
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Frontend (in new terminal)
cd frontend
npm start
```

### Access Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

---

## 📁 Where to Find Things

| What You Need | Location |
|---------------|----------|
| **Configuration** | `backend/app/config.py` & `frontend/src/config.js` |
| **API Endpoints** | `backend/app/routers/` |
| **Database Operations** | `backend/app/repositories/` |
| **React Components** | `frontend/src/components/` |
| **UI Components** | `frontend/src/components/ui/` |
| **Styling** | `frontend/src/index.css` & `tailwind.config.js` |
| **Authentication** | `backend/app/auth.py` |
| **Routing** | `frontend/src/App.js` |

---

## 🔧 Common Tasks

### Add a New API Endpoint
```python
# backend/app/routers/your_router.py
@router.get("/endpoint")
async def your_endpoint(user = Depends(get_current_user)):
    return {"data": "value"}
```

### Add a New Page
```javascript
// 1. Create: frontend/src/components/pages/NewPage.js
// 2. Add route in frontend/src/App.js:
<Route path="/new" element={<NewPage />} />
```

### Add a New UI Component
```javascript
// frontend/src/components/ui/new-component.jsx
import { cn } from "../../utils/cn"

export const NewComponent = ({ className, ...props }) => (
  <div className={cn("base-styles", className)} {...props} />
)
```

### Update Configuration
```python
# Backend: backend/app/config.py
NEW_SETTING: str = os.getenv("NEW_SETTING", "default")
```
```javascript
// Frontend: frontend/src/config.js
export const NEW_CONFIG = { SETTING: 'value' };
```

---

## 🎨 Styling Quick Reference

### Tailwind Classes
```javascript
// Common patterns
<div className="flex items-center justify-between">
<div className="bg-slate-900 text-white p-4 rounded-lg">
<button className="hover:bg-slate-100 transition-colors">
```

### Using UI Components
```javascript
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card } from './components/ui/card';

<Button variant="default">Click me</Button>
<Input placeholder="Enter text" />
<Card>Content</Card>
```

---

## 🔐 Authentication

### Protect a Backend Route
```python
from app.auth import get_current_user, require_role

@router.get("/protected")
async def protected(user = Depends(get_current_user)):
    return {"user": user.email}

@router.get("/admin")
async def admin_only(user = Depends(require_role(UserRole.ADMIN))):
    return {"message": "Admin"}
```

### Protect a Frontend Route
```javascript
<Route path="/protected" element={
  <ProtectedRoute requiredRole="ADMIN">
    <ProtectedPage />
  </ProtectedRoute>
} />
```

---

## 📦 Dependencies

### Install New Package
```bash
# Backend
pip install package-name
pip freeze > requirements.txt

# Frontend
npm install package-name
```

---

## 🐛 Troubleshooting

### Frontend not loading styles?
1. Check `src/index.js` imports `./index.css`
2. Restart dev server: `npm start`
3. Clear browser cache (Ctrl+Shift+R)

### Backend connection error?
1. Check backend is running on port 8000
2. Check MongoDB is running
3. Verify `.env` file exists with correct settings

### CORS errors?
1. Check `backend/app/config.py` CORS settings
2. Ensure frontend URL is in allowed origins

---

## 📝 File Structure at a Glance

```
Consultant--Tracker/
├── backend/
│   └── app/
│       ├── config.py          ⭐ Backend config
│       ├── main.py            ⭐ App entry
│       ├── routers/           ⭐ API endpoints
│       └── repositories/      ⭐ Database ops
│
└── frontend/
    └── src/
        ├── config.js          ⭐ Frontend config
        ├── App.js             ⭐ Routing
        ├── components/
        │   └── ui/            ⭐ UI components
        └── index.css          ⭐ Styles
```

---

## 🎯 Key Concepts

### Backend (FastAPI)
- **Routers** = API endpoints (like `/api/users`)
- **Repositories** = Database operations (CRUD)
- **Models** = Data validation (Pydantic)
- **Config** = All settings in one place

### Frontend (React)
- **Components** = Reusable UI pieces
- **Contexts** = Global state (like auth)
- **Config** = All settings in one place
- **Tailwind** = Utility-first CSS

---

## 🔄 Git Workflow

```bash
# Check current branch
git branch

# Create new branch
git checkout -b feature-name

# Commit changes
git add .
git commit -m "Description"

# Push to remote
git push origin branch-name
```

---

## 📚 Important Links

- **Full Documentation:** `CODEBASE_STRUCTURE.md`
- **UI Updates:** `UI_MODERNIZATION.md`
- **Project Info:** `README.md`

---

**Need more help?** Check `CODEBASE_STRUCTURE.md` for detailed explanations!
