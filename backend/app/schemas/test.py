from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
from backend.app.schemas.question import QuestionForTestOut, OptionWithCorrectOut

class TestOut(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    test_type: str
    duration_minutes: int
    total_marks: int
    positive_marks_per_q: float
    negative_marks_per_q: float
    question_count: int = 0
    is_published: bool

    class Config:
        from_attributes = True

class StartAttemptOut(BaseModel):
    attempt_id: str
    test_id: str
    title: str
    duration_minutes: int
    started_at: datetime
    total_questions: int
    questions: List[QuestionForTestOut]

class AnswerItem(BaseModel):
    question_id: str
    selected_option_id: Optional[str] = None
    is_marked_for_review: bool = False
    time_spent_seconds: int = 0

class SyncAnswerIn(BaseModel):
    answers: List[AnswerItem]

class SubmitAttemptIn(BaseModel):
    answers: List[AnswerItem]

class ResultSummaryOut(BaseModel):
    attempt_id: str
    test_id: str
    test_title: str
    total_questions: int
    attempted_count: int
    correct_count: int
    wrong_count: int
    unattempted_count: int
    total_score: float
    max_score: float
    accuracy_percentage: float
    time_taken_seconds: int
    submitted_at: datetime

    class Config:
        from_attributes = True

class QuestionReviewOut(BaseModel):
    question_id: str
    question_text: str
    difficulty: str
    section_name: str
    options: List[OptionWithCorrectOut]
    selected_option_id: Optional[str] = None
    is_correct: Optional[bool] = None
    marks_obtained: float
    time_spent_seconds: int
    explanation: str
    is_marked_for_review: bool = False
