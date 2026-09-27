from typing import List
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.mistake import UserMistake
from backend.app.models.question import Question, QuestionOption
from backend.app.models.user import User
from backend.app.schemas.analytics import MistakeOut, ResolveMistakeIn, ResolveMistakeOut
from backend.app.api.deps import get_current_user

router = APIRouter(prefix="/mistakes", tags=["My Mistakes Remediation"])

@router.get("", response_model=List[MistakeOut])
def list_my_mistakes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    mistakes = db.query(UserMistake).filter(
        UserMistake.user_id == current_user.id
    ).order_by(UserMistake.is_resolved.asc(), UserMistake.last_attempted_at.desc()).all()

    results = []
    for m in mistakes:
        q = m.question
        if not q:
            continue
        results.append(MistakeOut(
            id=m.id,
            question_id=m.question_id,
            failure_count=m.failure_count,
            is_resolved=m.is_resolved,
            last_attempted_at=m.last_attempted_at,
            question={
                "id": q.id,
                "topic_id": q.topic_id,
                "question_text": q.question_text,
                "question_type": q.question_type,
                "difficulty": q.difficulty,
                "explanation": q.explanation,
                "image_url": q.image_url,
                "source": q.source,
                "year": q.year,
                "is_bookmarked": False,
                "options": [
                    {
                        "id": opt.id,
                        "option_key": opt.option_key,
                        "option_text": opt.option_text,
                        "image_url": opt.image_url
                    } for opt in q.options
                ]
            }
        ))
    return results

@router.post("/{question_id}/resolve", response_model=ResolveMistakeOut)
def retry_and_resolve_mistake(
    question_id: str,
    data: ResolveMistakeIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    mistake = db.query(UserMistake).filter(
        UserMistake.user_id == current_user.id,
        UserMistake.question_id == question_id
    ).first()

    if not mistake:
        raise HTTPException(status_code=404, detail="Mistake record not found for this question")

    question = mistake.question
    correct_opt = None
    user_opt = None
    for opt in question.options:
        if opt.is_correct:
            correct_opt = opt
        if opt.id == data.selected_option_id:
            user_opt = opt

    is_correct = (user_opt and user_opt.is_correct) or False

    mistake.last_attempted_at = datetime.now(timezone.utc)
    mistake.last_selected_option_id = data.selected_option_id

    if is_correct:
        mistake.is_resolved = True
    else:
        mistake.failure_count += 1
        mistake.is_resolved = False

    db.commit()

    return ResolveMistakeOut(
        is_correct=is_correct,
        is_resolved=mistake.is_resolved,
        correct_option_id=correct_opt.id if correct_opt else "",
        correct_option_key=correct_opt.option_key if correct_opt else "",
        explanation=question.explanation
    )
