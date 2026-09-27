import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Numeric, Boolean, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class TestAttempt(Base):
    __tablename__ = "test_attempts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    test_id = Column(String(36), ForeignKey("tests.id", ondelete="CASCADE"), nullable=False, index=True)
    started_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    submitted_at = Column(DateTime, nullable=True)
    status = Column(String(20), default="IN_PROGRESS", nullable=False)  # IN_PROGRESS, SUBMITTED, EXPIRED
    
    total_questions = Column(Integer, default=0, nullable=False)
    attempted_count = Column(Integer, default=0, nullable=False)
    correct_count = Column(Integer, default=0, nullable=False)
    wrong_count = Column(Integer, default=0, nullable=False)
    unattempted_count = Column(Integer, default=0, nullable=False)
    total_score = Column(Numeric(6, 2), default=0.00, nullable=False)
    accuracy_percentage = Column(Numeric(5, 2), default=0.00, nullable=False)
    time_taken_seconds = Column(Integer, default=0, nullable=False)

    user = relationship("User")
    test = relationship("Test", back_populates="attempts")
    answers = relationship("AttemptAnswer", back_populates="attempt", cascade="all, delete-orphan")

class AttemptAnswer(Base):
    __tablename__ = "attempt_answers"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    attempt_id = Column(String(36), ForeignKey("test_attempts.id", ondelete="CASCADE"), nullable=False, index=True)
    question_id = Column(String(36), ForeignKey("questions.id", ondelete="CASCADE"), nullable=False, index=True)
    selected_option_id = Column(String(36), ForeignKey("question_options.id", ondelete="SET NULL"), nullable=True)
    is_marked_for_review = Column(Boolean, default=False, nullable=False)
    is_correct = Column(Boolean, nullable=True)
    marks_obtained = Column(Numeric(4, 2), default=0.00, nullable=False)
    time_spent_seconds = Column(Integer, default=0, nullable=False)

    __table_args__ = (
        UniqueConstraint("attempt_id", "question_id", name="uq_attempt_question"),
    )

    attempt = relationship("TestAttempt", back_populates="answers")
    question = relationship("Question")
    selected_option = relationship("QuestionOption")
