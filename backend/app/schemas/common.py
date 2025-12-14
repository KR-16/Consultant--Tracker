from pydantic import BaseModel, ConfigDict
from typing import Optional, Generic, TypeVar, List

T = TypeVar('T')

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None