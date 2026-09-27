from typing import List, Optional
from pydantic import BaseModel

class OptionOut(BaseModel):
    id: str
    option_key: str
    option_text: str
    image_url: Optional[str] = None

    class Config:
        from_attributes = True

class OptionWithCorrectOut(BaseModel):
    id: str
    option_key: str
    option_text: str
    is_correct: bool
    image_url: Optional[str] = None

    class Config:
        from_attributes = True

class QuestionOut(BaseModel):
    id: str
    topic_id: int
    question_text: str
    question_type: str
    difficulty: str
    explanation: str
    image_url: Optional[str] = None
    source: Optional[str] = None
    year: Optional[int] = None
    options: List[OptionOut]
    is_bookmarked: Optional[bool] = False

    class Config:
        from_attributes = True

class QuestionForTestOut(BaseModel):
    id: str
    topic_id: int
    question_text: str
    question_type: str
    difficulty: str
    image_url: Optional[str] = None
    section_name: Optional[str] = "Section A"
    order_index: Optional[int] = 0
    options: List[OptionOut]

    class Config:
        from_attributes = True

class PracticeSubmitIn(BaseModel):
    question_id: str
    selected_option_id: str

class PracticeResultOut(BaseModel):
    is_correct: bool
    correct_option_id: str
    correct_option_key: str
    explanation: str
