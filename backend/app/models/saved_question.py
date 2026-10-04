import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class SavedQuestion(Base):
    __tablename__ = "saved_questions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Chapter-wise and exam organization
    exam_level = Column(String(50), default="NEET UG", nullable=False, index=True)  # "Class 11", "Class 12", "NEET UG", "NEET PG", etc.
    subject = Column(String(100), nullable=False, index=True)                       # "Biology", "Physics", "Chemistry", etc.
    chapter = Column(String(150), nullable=False, index=True)                       # Chapter name specified by user
    
    # Complete question content
    question_text = Column(Text, nullable=False)
    difficulty = Column(String(20), default="MEDIUM", nullable=False)               # EASY, MEDIUM, HARD
    explanation = Column(Text, nullable=False)
    image_url = Column(Text, nullable=True)                                         # Question diagram/image
    explanation_image_url = Column(Text, nullable=True)                             # Solution diagram/image
    
    # Privacy & Sharing control (private until explicitly shared)
    is_shared = Column(Boolean, default=False, nullable=False, index=True)
    share_token = Column(String(64), unique=True, index=True, nullable=False, default=lambda: str(uuid.uuid4()))
    
    # Timestamps
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    user = relationship("User")
    options = relationship("SavedQuestionOption", back_populates="saved_question", cascade="all, delete-orphan", order_by="SavedQuestionOption.option_key")


class SavedQuestionOption(Base):
    __tablename__ = "saved_question_options"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    saved_question_id = Column(String(36), ForeignKey("saved_questions.id", ondelete="CASCADE"), nullable=False, index=True)
    option_key = Column(String(10), nullable=False)  # 'A', 'B', 'C', 'D'
    option_text = Column(Text, nullable=False)
    is_correct = Column(Boolean, default=False, nullable=False)
    image_url = Column(Text, nullable=True)

    saved_question = relationship("SavedQuestion", back_populates="options")
