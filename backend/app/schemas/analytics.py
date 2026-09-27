from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
from backend.app.schemas.question import QuestionOut

class ChapterPerformance(BaseModel):
    chapter_id: int
    chapter_name: str
    subject_name: str
    attempted_count: int
    correct_count: int
    accuracy_percentage: float
    status: str  # WEAK, NEEDS_PRACTICE, STRONG, INSUFFICIENT_DATA

class SubjectPerformance(BaseModel):
    subject_id: int
    subject_name: str
    attempted_count: int
    correct_count: int
    accuracy_percentage: float

class RecentAttemptOut(BaseModel):
    attempt_id: str
    test_title: str
    test_type: str
    total_score: float
    accuracy_percentage: float
    submitted_at: datetime

class DashboardStatsOut(BaseModel):
    total_questions_solved: int
    overall_accuracy: float
    tests_completed: int
    unresolved_mistakes_count: int
    bookmarks_count: int
    subject_performances: List[SubjectPerformance]
    areas_to_practice: List[ChapterPerformance]
    recent_attempts: List[RecentAttemptOut]

class MistakeOut(BaseModel):
    id: str
    question_id: str
    failure_count: int
    is_resolved: bool
    last_attempted_at: datetime
    question: QuestionOut

class ResolveMistakeIn(BaseModel):
    selected_option_id: str

class ResolveMistakeOut(BaseModel):
    is_correct: bool
    is_resolved: bool
    correct_option_id: str
    correct_option_key: str
    explanation: str

class BookmarkOut(BaseModel):
    id: str
    question_id: str
    created_at: datetime
    question: QuestionOut
