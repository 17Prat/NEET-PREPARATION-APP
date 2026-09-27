from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class UserSignup(BaseModel):
    email: str
    password: str
    full_name: str
    target_year: int = 2026
    student_grade: str = "CLASS_12"

class UserLogin(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    id: str
    email: str
    full_name: str
    target_year: int
    student_grade: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    target_year: Optional[int] = None
    student_grade: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
