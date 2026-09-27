from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.question import Question, QuestionOption
from backend.app.models.bookmark import Bookmark
from backend.app.models.mistake import UserMistake
from backend.app.models.user import User
from backend.app.schemas.question import QuestionOut, PracticeSubmitIn, PracticeResultOut
from backend.app.api.deps import get_current_user

router = APIRouter(prefix="/practice", tags=["Practice"])

@router.get("/questions", response_model=List[QuestionOut])
def get_practice_questions(
    topic_id: int = Query(...),
    difficulty: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Question).filter(Question.topic_id == topic_id, Question.is_active == True)
    if difficulty and difficulty.upper() in ("EASY", "MEDIUM", "HARD"):
        query = query.filter(Question.difficulty == difficulty.upper())

    questions = query.all()
    
    # Check bookmarks for the student
    bookmarked_qids = set(
        row[0] for row in db.query(Bookmark.question_id).filter(Bookmark.user_id == current_user.id).all()
    )

    results = []
    for q in questions:
        q_dict = {
            "id": q.id,
            "topic_id": q.topic_id,
            "question_text": q.question_text,
            "question_type": q.question_type,
            "difficulty": q.difficulty,
            "explanation": q.explanation,
            "image_url": q.image_url,
            "source": q.source,
            "year": q.year,
            "is_bookmarked": q.id in bookmarked_qids,
            "options": [
                {
                    "id": opt.id,
                    "option_key": opt.option_key,
                    "option_text": opt.option_text,
                    "image_url": opt.image_url
                } for opt in q.options
            ]
        }
        results.append(q_dict)

    return results

@router.post("/submit-answer", response_model=PracticeResultOut)
def submit_practice_answer(
    data: PracticeSubmitIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    question = db.query(Question).filter(Question.id == data.question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    correct_opt = None
    user_opt = None
    for opt in question.options:
        if opt.is_correct:
            correct_opt = opt
        if opt.id == data.selected_option_id:
            user_opt = opt

    if not correct_opt:
        raise HTTPException(status_code=500, detail="Corrupted question: no correct option set")

    is_correct = (user_opt and user_opt.is_correct) or False

    # If wrong answer in practice, also auto-register in UserMistakes
    if not is_correct:
        mistake = db.query(UserMistake).filter(
            UserMistake.user_id == current_user.id,
            UserMistake.question_id == question.id
        ).first()

        if mistake:
            mistake.failure_count += 1
            mistake.last_selected_option_id = data.selected_option_id
            mistake.is_resolved = False
            mistake.last_attempted_at = datetime.now(timezone.utc)
        else:
            db.add(UserMistake(
                user_id=current_user.id,
                question_id=question.id,
                failure_count=1,
                last_selected_option_id=data.selected_option_id,
                is_resolved=False,
                last_attempted_at=datetime.now(timezone.utc)
            ))
        db.commit()

    return PracticeResultOut(
        is_correct=is_correct,
        correct_option_id=correct_opt.id,
        correct_option_key=correct_opt.option_key,
        explanation=question.explanation
    )
