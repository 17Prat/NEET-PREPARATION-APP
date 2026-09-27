import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class UserMistake(Base):
    __tablename__ = "user_mistakes"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    question_id = Column(String(36), ForeignKey("questions.id", ondelete="CASCADE"), nullable=False, index=True)
    failure_count = Column(Integer, default=1, nullable=False)
    last_selected_option_id = Column(String(36), ForeignKey("question_options.id", ondelete="SET NULL"), nullable=True)
    is_resolved = Column(Boolean, default=False, nullable=False)
    last_attempted_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    __table_args__ = (
        UniqueConstraint("user_id", "question_id", name="uq_user_mistake"),
    )

    user = relationship("User")
    question = relationship("Question")
    last_selected_option = relationship("QuestionOption")
