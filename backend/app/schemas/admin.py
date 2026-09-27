from typing import List, Optional
from pydantic import BaseModel

class OptionCreate(BaseModel):
    option_key: str  # 'A', 'B', 'C', 'D'
    option_text: str
    is_correct: bool
    image_url: Optional[str] = None

class QuestionCreate(BaseModel):
    topic_id: int
    question_text: str
    difficulty: str = "MEDIUM"  # EASY, MEDIUM, HARD
    explanation: str
    image_url: Optional[str] = None
    source: Optional[str] = None
    year: Optional[int] = None
    options: List[OptionCreate]

class TestCreate(BaseModel):
    title: str
    description: Optional[str] = None
    test_type: str  # CHAPTER, SUBJECT, PART, FULL_MOCK
    duration_minutes: int = 60
    positive_marks_per_q: float = 4.0
    negative_marks_per_q: float = 1.0
    question_ids: List[str]
