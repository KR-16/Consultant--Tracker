
# Script to restart the backend server

Write-Host "Stopping existing uvicorn processes..." -ForegroundColor Yellow

# Find and stop uvicorn processes
Get-Process | Where-Object {$_.ProcessName -eq "uvicorn"} | Stop-Process -Force -ErrorAction SilentlyContinue

Start-Sleep -Seconds 2

Write-Host "Installing dependencies..." -ForegroundColor Yellow

# Navigate to backend and install dependencies
Set-Location backend

# Check if virtual environment exists
if (Test-Path ".venv\Scripts\python.exe") {
    Write-Host "Using virtual environment..." -ForegroundColor Green
    .venv\Scripts\python.exe -m pip install -r ..\requirements.txt --quiet
    $pythonPath = ".venv\Scripts\python.exe"
} elseif (Test-Path "..\.venv\Scripts\python.exe") {
    Write-Host "Using root virtual environment..." -ForegroundColor Green
    ..\.venv\Scripts\python.exe -m pip install -r ..\requirements.txt --quiet
    $pythonPath = "..\.venv\Scripts\python.exe"
} else {
    Write-Host "Using system Python..." -ForegroundColor Yellow
    python -m pip install -r ..\requirements.txt --quiet
    $pythonPath = "python"
}

Write-Host "Starting backend server..." -ForegroundColor Green
Write-Host "Server will run on http://localhost:8000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start uvicorn
if ($pythonPath -like "*venv*") {
    & $pythonPath -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
} else {
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
}