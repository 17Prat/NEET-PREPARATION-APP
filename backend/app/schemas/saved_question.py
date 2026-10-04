from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

class SavedOptionIn(BaseModel):
    option_key: str  # 'A', 'B', 'C', 'D'
    option_text: str
    is_correct: bool = False
    image_url: Optional[str] = None

class SavedOptionOut(BaseModel):
    id: str
    option_key: str
    option_text: str
    is_correct: bool
    image_url: Optional[str] = None

    class Config:
        from_attributes = True

class SavedQuestionCreate(BaseModel):
    exam_level: str = "NEET UG"  # "Class 11", "Class 12", "NEET UG", "NEET PG", etc.
    subject: str
    chapter: str
    question_text: str
    difficulty: str = "MEDIUM"
    explanation: str
    image_url: Optional[str] = None
    explanation_image_url: Optional[str] = None
    is_shared: bool = False
    options: List[SavedOptionIn]

class SavedQuestionUpdate(BaseModel):
    exam_level: Optional[str] = None
    subject: Optional[str] = None
    chapter: Optional[str] = None
    question_text: Optional[str] = None
    difficulty: Optional[str] = None
    explanation: Optional[str] = None
    image_url: Optional[str] = None
    explanation_image_url: Optional[str] = None
    is_shared: Optional[bool] = None
    options: Optional[List[SavedOptionIn]] = None

class SavedQuestionOut(BaseModel):
    id: str
    user_id: str
    user_name: Optional[str] = None
    exam_level: str
    subject: str
    chapter: str
    question_text: str
    difficulty: str
    explanation: str
    image_url: Optional[str] = None
    explanation_image_url: Optional[str] = None
    is_shared: bool
    share_token: str
    share_url: Optional[str] = None
    created_at: datetime
    options: List[SavedOptionOut]

    class Config:
        from_attributes = True

class ShareStatusResponse(BaseModel):
    id: str
    is_shared: bool
    share_token: str
    share_url: str
    message: str

class SavedQuestionsSummaryOut(BaseModel):
    total_saved: int
    exam_levels: List[str]
    subjects: List[str]
    chapters: List[str]
    questions: List[SavedQuestionOut]
