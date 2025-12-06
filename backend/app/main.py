from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, candidates, users, jobs, submissions, reports
from app.db import init_db, close_db
import logging

# Set up logging
logger = logging.getLogger(__name__)

# --- LIFESPAN MANAGER (Connects DB on Startup) ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Startup: Connect to Database
    try:
        logger.info("Starting up application...")
        await init_db()
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")
        raise e
    
    yield  # Application runs here
    
    # 2. Shutdown: Close Database
    logger.info("Shutting down application...")
    await close_db()

# --- APP DEFINITION ---
app = FastAPI(
    title="RecruitOps API", 
    lifespan=lifespan  # <--- THIS IS THE KEY FIX
)

# --- CORS CONFIGURATION ---
origins = [
    "http://localhost:3000", 
    "http://localhost"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ROUTERS ---
app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(candidates.router, prefix="/api")
app.include_router(jobs.router, prefix="/api")
app.include_router(submissions.router, prefix="/api")
app.include_router(reports.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to RecruitOps API"}