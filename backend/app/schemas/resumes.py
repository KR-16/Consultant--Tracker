from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class ResumeBase(BaseModel):
    file_name: str
    is_primary: bool = False

class ResumeCreate(ResumeBase):
    pass

class ResumeResponse(ResumeBase):
    id: int
    user_id: int
    file_url: str
    uploaded_at: datetime

    class Config:
        from_attributes = True