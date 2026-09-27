import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, SmallInteger
from backend.app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(150), nullable=False)
    target_year = Column(SmallInteger, default=2026, nullable=False)
    student_grade = Column(String(20), default="CLASS_12", nullable=False)  # CLASS_11, CLASS_12, REPEATER
    role = Column(String(20), default="STUDENT", nullable=False)            # STUDENT, ADMIN
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
