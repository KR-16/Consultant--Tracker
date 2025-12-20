from pydantic import BaseModel
from typing import Optional, TypeVar

T = TypeVar('T')

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None