import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Numeric, Boolean, DateTime, ForeignKey, UniqueConstraint, Text
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class Test(Base):
    __tablename__ = "tests"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    test_type = Column(String(30), nullable=False)  # CHAPTER, SUBJECT, PART, FULL_MOCK
    duration_minutes = Column(Integer, nullable=False, default=60)
    total_marks = Column(Integer, nullable=False, default=720)
    positive_marks_per_q = Column(Numeric(4, 2), default=4.00, nullable=False)
    negative_marks_per_q = Column(Numeric(4, 2), default=1.00, nullable=False)
    is_published = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    test_questions = relationship("TestQuestion", back_populates="test", cascade="all, delete-orphan", order_by="TestQuestion.order_index")
    attempts = relationship("TestAttempt", back_populates="test", cascade="all, delete-orphan")

class TestQuestion(Base):
    __tablename__ = "test_questions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    test_id = Column(String(36), ForeignKey("tests.id", ondelete="CASCADE"), nullable=False, index=True)
    question_id = Column(String(36), ForeignKey("questions.id", ondelete="CASCADE"), nullable=False, index=True)
    section_name = Column(String(50), default="Section A", nullable=False)
    order_index = Column(Integer, default=0, nullable=False)

    __table_args__ = (
        UniqueConstraint("test_id", "question_id", name="uq_test_question"),
    )

    test = relationship("Test", back_populates="test_questions")
    question = relationship("Question")
