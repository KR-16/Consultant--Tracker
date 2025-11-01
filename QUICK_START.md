# Quick Start Guide - Consultant Tracker

## Prerequisites Check
- Python 3.11+ installed
- Node.js 18+ installed
- MongoDB running locally (or connection string)

## Step-by-Step Execution

### Option 1: Local Development (Recommended for Windows)

#### Step 1: Start MongoDB
Make sure MongoDB is running on your system:
```powershell
# If MongoDB is installed as a service, it should be running automatically
# Or start it manually if needed
mongod
```

#### Step 2: Set Up Backend

1. **Navigate to backend directory:**
   ```powershell
   cd backend
   ```

2. **Create virtual environment (if not exists):**
   ```powershell
   python -m venv venv
   ```

3. **Activate virtual environment:**
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```

4. **Install dependencies:**
   ```powershell
   pip install -r ..\requirements.txt
   ```
   
   Or if using uv (since uv.lock exists):
   ```powershell
   uv pip install -r ..\requirements.txt
   ```

5. **Set environment variable (optional - defaults to localhost):**
   ```powershell
   $env:MONGODB_URL="mongodb://localhost:27017/consultant_tracker"
   ```

6. **Run the backend server:**
   ```powershell
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

   Backend will be available at: http://localhost:8000
   API docs at: http://localhost:8000/docs

#### Step 3: Set Up Frontend

Open a **new terminal/PowerShell window**:

1. **Navigate to frontend directory:**
   ```powershell
   cd frontend
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Set environment variable (optional - defaults to localhost:8000):**
   ```powershell
   $env:REACT_APP_API_URL="http://localhost:8000/api"
   ```

4. **Start the frontend:**
   ```powershell
   npm start
   ```

   Frontend will open automatically at: http://localhost:3000

#### Step 4: Seed Database (Optional)

In a new terminal, from the backend directory:
```powershell
cd backend
.\venv\Scripts\Activate.ps1
python seed_data.py
```

### Option 2: Using Docker (If you have Docker installed)

1. **Create docker-compose.yml** (if it doesn't exist)
2. **Run:**
   ```powershell
   docker-compose up -d
   ```

## Access Points

- **Frontend UI**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod --version`
- Check connection string matches your MongoDB setup
- Default: `mongodb://localhost:27017`

### Port Already in Use
- Backend (8000): Change port in uvicorn command or kill process using port 8000
- Frontend (3000): React will prompt to use a different port automatically

### Python Dependencies
- If `pip install` fails, try: `python -m pip install -r requirements.txt`
- Ensure you're in the virtual environment

### Node Dependencies
- If `npm install` fails, try: `npm install --legacy-peer-deps`
- Delete `node_modules` and `package-lock.json` then reinstall

## First Time Setup Checklist

- [ ] MongoDB is installed and running
- [ ] Python 3.11+ is installed
- [ ] Node.js 18+ is installed
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Backend server running on port 8000
- [ ] Frontend server running on port 3000
- [ ] Database seeded with sample data (optional)

## Creating Admin User

To create an admin user:
```powershell
cd backend
.\venv\Scripts\Activate.ps1
python create_admin.py
```

