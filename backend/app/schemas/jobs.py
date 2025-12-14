from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class JobBase(BaseModel):
    title: str
    description: str
    location: Optional[str] = None
    requirements: Optional[str] = None
    is_active: bool = True

class JobCreate(JobBase):
    pass

class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    requirements: Optional[str] = None
    is_active: Optional[bool] = None

class JobResponse(JobBase):
    id: int
    manager_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)