from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

class StudentRegisterIn(BaseModel):
    full_name: str
    email: str
    mobile: Optional[str] = None
    password: str
    confirm_password: Optional[str] = None
    student_grade: str = "CLASS_12"
    target_year: int = 2026
    preferred_language: str = "English"

class UserLogin(BaseModel):
    email: str  # Can be email or mobile
    password: str

class AdminLoginIn(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    id: str
    email: str
    mobile: Optional[str] = None
    full_name: str
    target_year: int
    student_grade: str
    preferred_language: Optional[str] = "English"
    role: str
    status: str
    rejection_reason: Optional[str] = None
    suspension_reason: Optional[str] = None
    created_at: datetime
    approved_at: Optional[datetime] = None
    approved_by: Optional[str] = None
    rejected_at: Optional[datetime] = None
    rejected_by: Optional[str] = None

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    target_year: Optional[int] = None
    student_grade: Optional[str] = None
    mobile: Optional[str] = None
    preferred_language: Optional[str] = None

class AuthResponse(BaseModel):
    status: str  # APPROVED, PENDING, REJECTED, SUSPENDED
    role: Optional[str] = None
    access_token: Optional[str] = None
    token_type: str = "bearer"
    user: Optional[UserOut] = None
    message: str
    rejection_reason: Optional[str] = None
    suspension_reason: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

class StudentStatusOut(BaseModel):
    id: str
    email: str
    full_name: str
    status: str
    rejection_reason: Optional[str] = None
    suspension_reason: Optional[str] = None
    message: str

class AdminStudentActionIn(BaseModel):
    reason: Optional[str] = None

class AdminStatsOut(BaseModel):
    total_students: int
    pending_requests: int
    approved_students: int
    rejected_requests: int
    suspended_students: int
