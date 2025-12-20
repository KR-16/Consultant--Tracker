from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.db.base import Base
from app.db.session import engine
from app.routers import auth, jobs, submissions, candidates, hiring, admin


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables verified/created successfully")
except Exception as e:
    logger.error(f"Error creating database tables: {e}")

app = FastAPI(
    title="Talentra API",  
    description="ATS Platform API",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# --- Router Registration ---
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["Jobs"])
app.include_router(submissions.router, prefix="/api/submissions", tags=["Submissions"])
app.include_router(candidates.router, prefix="/api/candidates", tags=["Candidates"])
app.include_router(hiring.router, prefix="/api/hiring", tags=["Hiring Pipeline"])
app.include_router(admin.router, prefix="/api/admin", tags=["Administration"])

# --- Basic Endpoints ---
@app.get("/")
def read_root():
    return {
        "message": "Welcome to Talentra API",
        "docs": "/api/docs",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "Talentra API"}

# --- Lifecycle Events ---
@app.on_event("startup")
async def startup_event():
    logger.info("Starting Talentra API Server")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down Talentra API Server")