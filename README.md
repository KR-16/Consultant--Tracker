# Consultant Tracker - Authentication System

A simple authentication system with registration and login functionality for three user roles: **Admin**, **Recruiter**, and **Consultant**.

## Tech Stack

### Backend
- **FastAPI** - Python web framework
- **MongoDB** - NoSQL database
- **Motor** - Async MongoDB driver
- **JWT** - Token-based authentication
- **Bcrypt** - Password hashing
- **Pydantic** - Data validation

### Frontend
- **React** - UI library
- **Material-UI (MUI)** - Component library
- **React Router** - Routing
- **Axios** - HTTP client

## Features

- ✅ User Registration
- ✅ User Login
- ✅ JWT Token Authentication
- ✅ Role-Based Access Control (Admin, Recruiter, Consultant)
- ✅ Password Hashing (Bcrypt)
- ✅ Protected Routes
- ✅ User Profile Management

## Project Structure

```
consultant-tracker/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI application
│   │   ├── db.py                   # Database configuration
│   │   ├── models.py               # Pydantic models
│   │   ├── repositories/           # Data access layer
│   │   │   ├── consultants.py
│   │   │   ├── submissions.py
│   │   │   └── reports.py
│   │   └── routers/                # API routes
│   │       ├── consultants.py
│   │       ├── submissions.py
│   │       └── reports.py
│   ├── tests/                      # Unit tests
│   ├── requirements.txt
│   ├── Dockerfile
│   └── seed_data.py               # Sample data
├── frontend/
│   ├── src/
│   │   ├── components/            # Reusable components
│   │   ├── pages/                 # Page components
│   │   │   ├── Consultants.js
│   │   │   ├── Submissions.js
│   │   │   ├── PerConsultant.js
│   │   │   ├── Availability.js
│   │   │   └── Reports.js
│   │   ├── App.js                 # Main app component
│   │   ├── api.js                 # API client
│   │   └── index.js               # Entry point
│   ├── package.json
│   └── Dockerfile
├── mongo-init/                    # MongoDB initialization
├── docker-compose.yml
└── README.md
```

## Setup Instructions

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv .venv
   ```

3. **Activate virtual environment:**
   - Windows:
     ```bash
     .venv\Scripts\activate
     ```
   - Linux/Mac:
     ```bash
     source .venv/bin/activate
     ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Start MongoDB:**
   - Make sure MongoDB is running on `localhost:27017`
   - Or set `MONGODB_URL` environment variable

6. **Run the backend:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the frontend:**
   ```bash
   npm start
   ```

The frontend will run on `http://localhost:3000` (or next available port).

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  - Body: `{ "email": "user@example.com", "name": "User Name", "password": "password123", "role": "CONSULTANT" }`
  - Roles: `ADMIN`, `RECRUITER`, `CONSULTANT`

- `POST /api/auth/login` - Login user
  - Body: `{ "email": "user@example.com", "password": "password123" }`
  - Returns: `{ "access_token": "...", "token_type": "bearer" }`

- `GET /api/auth/me` - Get current user info (requires authentication)
  - Headers: `Authorization: Bearer <token>`

- `POST /api/auth/refresh` - Refresh access token (requires authentication)

- `POST /api/auth/logout` - Logout user (client should discard token)

### Admin Only

- `GET /api/auth/users` - Get all users (Admin only)
- `POST /api/auth/users` - Create a new user (Admin only)

## User Roles

1. **ADMIN** - Full access to all features
2. **RECRUITER** - Can manage consultants and submissions
3. **CONSULTANT** - Can view own profile and submissions

## Environment Variables

### Backend

- `MONGODB_URL` - MongoDB connection string (default: `mongodb://localhost:27017`)
- `SECRET_KEY` - JWT secret key (default: `your-secret-key-change-this-in-production`)
- `CORS_ORIGINS` - Comma-separated list of allowed CORS origins

### Frontend

- `REACT_APP_API_URL` - Backend API URL (default: `http://localhost:8000/api`)

## Password Requirements

- Minimum 6 characters
- Maximum 72 bytes (bcrypt limitation)
- For ASCII characters, this is approximately 72 characters
- Special characters or emojis use multiple bytes per character

## Testing

1. **Register a new user:**
   - Go to `http://localhost:3000/register`
   - Fill in the form and select a role
   - Submit to create an account

2. **Login:**
   - Go to `http://localhost:3000/login`
   - Enter your email and password
   - You'll be redirected to the dashboard

3. **View Profile:**
   - After login, you'll see your user information on the dashboard

## Notes

- Passwords are hashed using bcrypt
- JWT tokens expire after 30 minutes (configurable)
- CORS is configured for `localhost:3000` and `localhost:3001`
- All API endpoints require proper authentication headers for protected routes
