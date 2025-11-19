# Backend Setup Instructions

## Quick Fix for "Cannot connect to server" Error

### Step 1: Install Dependencies

1. **Open a new terminal/PowerShell window**

2. **Navigate to the project root:**
   ```powershell
   cd C:\Users\keert\OneDrive\Desktop\KEERTHIRAJ\PROJECTS\Consultant--Tracker
   ```

3. **Install Python dependencies:**
   ```powershell
   pip install -r requirements.txt
   ```
   
   Or if you're using a virtual environment:
   ```powershell
   cd backend
   .venv\Scripts\activate
   pip install -r ..\requirements.txt
   ```

### Step 2: Stop the Current Backend Server

1. **Find the terminal where uvicorn is running**
2. **Press `Ctrl+C` to stop it**

### Step 3: Restart the Backend Server

1. **Navigate to backend directory:**
   ```powershell
   cd backend
   ```

2. **Activate virtual environment (if using one):**
   ```powershell
   .venv\Scripts\activate
   ```

3. **Start the server:**
   ```powershell
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

4. **You should see:**
   ```
   INFO:     Started server process
   INFO:     Waiting for application startup.
   INFO:     Application startup complete.
   INFO:     Uvicorn running on http://0.0.0.0:8000
   ```

### Step 4: Verify the Backend is Working

1. **Test the root endpoint:**
   ```powershell
   curl http://localhost:8000/
   ```
   Should return: `{"message":"Consultant Tracker API - Authentication Service","version":"1.0.0"}`

2. **Test the health endpoint:**
   ```powershell
   curl http://localhost:8000/health
   ```
   Should return: `{"status":"healthy"}`

3. **Test the auth endpoint (should NOT return 404):**
   ```powershell
   curl http://localhost:8000/api/auth/register -Method OPTIONS
   ```
   Should return CORS headers, not `{"detail":"Not Found"}`

### Step 5: Test Registration from Frontend

1. **Make sure frontend is running:**
   ```powershell
   cd frontend
   npm start
   ```

2. **Go to:** `http://localhost:3000/register` (or whatever port React shows)

3. **Try registering a user**

## Common Issues

### Issue: "ModuleNotFoundError: No module named 'jose'"
**Solution:** Run `pip install -r requirements.txt`

### Issue: "Not Found" when accessing `/api/auth/register`
**Solution:** Restart the backend server after installing dependencies

### Issue: "Cannot connect to server"
**Solution:** 
- Make sure backend is running on port 8000
- Check if MongoDB is running
- Verify no firewall is blocking port 8000

### Issue: CORS errors
**Solution:** The CORS configuration should already include `localhost:3000` and `localhost:3001`. If frontend is on a different port, add it to `allowed_origins` in `backend/app/main.py`

