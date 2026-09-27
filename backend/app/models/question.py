import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Boolean, Integer, SmallInteger, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class Question(Base):
    __tablename__ = "questions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    topic_id = Column(Integer, ForeignKey("topics.id", ondelete="CASCADE"), nullable=False, index=True)
    question_text = Column(Text, nullable=False)
    question_type = Column(String(30), default="SINGLE_CHOICE", nullable=False)
    difficulty = Column(String(20), default="MEDIUM", nullable=False)  # EASY, MEDIUM, HARD
    explanation = Column(Text, nullable=False)
    image_url = Column(String(500), nullable=True)
    source = Column(String(100), nullable=True)  # e.g., NEET_2023, NCERT_EXEMPLAR
    year = Column(SmallInteger, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    topic = relationship("Topic", back_populates="questions")
    options = relationship("QuestionOption", back_populates="question", cascade="all, delete-orphan", order_by="QuestionOption.option_key")

class QuestionOption(Base):
    __tablename__ = "question_options"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    question_id = Column(String(36), ForeignKey("questions.id", ondelete="CASCADE"), nullable=False, index=True)
    option_key = Column(String(2), nullable=False)  # 'A', 'B', 'C', 'D'
    option_text = Column(Text, nullable=False)
    is_correct = Column(Boolean, default=False, nullable=False)
    image_url = Column(String(500), nullable=True)

    question = relationship("Question", back_populates="options")
