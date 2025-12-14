from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import auth, jobs, submissions, users

app = FastAPI(title=settings.PROJECT_NAME)

# CORS
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(auth.router) # /auth
app.include_router(jobs.router, prefix="/api/jobs", tags=["jobs"])
app.include_router(submissions.router, prefix="/api/submissions", tags=["submissions"])
app.include_router(users.router, prefix="/api/users", tags=["users"])

@app.get("/")
def root():
    return {"message": "Consultant Tracker API is running"}