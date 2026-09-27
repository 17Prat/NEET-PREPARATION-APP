from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    slug = Column(String(50), unique=True, nullable=False)
    icon = Column(String(50), default="atom")
    display_order = Column(Integer, default=0)

    chapters = relationship("Chapter", back_populates="subject", cascade="all, delete-orphan", order_by="Chapter.display_order")

class Chapter(Base):
    __tablename__ = "chapters"

    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(150), nullable=False)
    slug = Column(String(150), nullable=False)
    display_order = Column(Integer, default=0)

    subject = relationship("Subject", back_populates="chapters")
    topics = relationship("Topic", back_populates="chapter", cascade="all, delete-orphan", order_by="Topic.display_order")

class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, index=True)
    chapter_id = Column(Integer, ForeignKey("chapters.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(150), nullable=False)
    slug = Column(String(150), nullable=False)
    display_order = Column(Integer, default=0)

    chapter = relationship("Chapter", back_populates="topics")
    questions = relationship("Question", back_populates="topic")
