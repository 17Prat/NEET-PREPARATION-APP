from typing import List, Optional
from pydantic import BaseModel

class TopicOut(BaseModel):
    id: int
    name: str
    slug: str
    display_order: int
    question_count: Optional[int] = 0

    class Config:
        from_attributes = True

class ChapterOut(BaseModel):
    id: int
    subject_id: int
    name: str
    slug: str
    display_order: int
    topics: List[TopicOut] = []

    class Config:
        from_attributes = True

class SubjectOut(BaseModel):
    id: int
    name: str
    slug: str
    icon: Optional[str] = "atom"
    display_order: int
    chapters: List[ChapterOut] = []

    class Config:
        from_attributes = True
