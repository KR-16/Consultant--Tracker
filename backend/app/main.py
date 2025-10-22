from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import motor.motor_asyncio
from app.db import init_db
from app.routers import consultants, submissions, reports, auth, job_descriptions, applications

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    yield
    # Shutdown
    pass

app = FastAPI(
    title="Consultant Tracker API",
    description="API for managing consultants and job submissions",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://frontend:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api", tags=["authentication"])
app.include_router(consultants.router, prefix="/api/consultants", tags=["consultants"])
app.include_router(submissions.router, prefix="/api/submissions", tags=["submissions"])
app.include_router(reports.router, prefix="/api/reports", tags=["reports"])
app.include_router(job_descriptions.router, prefix="/api", tags=["job-descriptions"])
app.include_router(applications.router, prefix="/api", tags=["applications"])

@app.get("/")
async def root():
    return {"message": "Consultant Tracker API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
