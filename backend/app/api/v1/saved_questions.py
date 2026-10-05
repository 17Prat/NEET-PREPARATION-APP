import uuid
from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session, selectinload, joinedload

from backend.app.core.database import get_db
from backend.app.models.user import User
from backend.app.models.saved_question import SavedQuestion, SavedQuestionOption
from backend.app.schemas.saved_question import (
    SavedQuestionCreate,
    SavedQuestionUpdate,
    SavedQuestionOut,
    SavedOptionOut,
    ShareStatusResponse,
    SavedQuestionsSummaryOut,
)
from backend.app.api.deps import get_current_user, get_approved_student

router = APIRouter(prefix="/saved-questions", tags=["Saved Questions"])

def _format_question_out(q: SavedQuestion, user_name: Optional[str] = None) -> SavedQuestionOut:
    return SavedQuestionOut(
        id=q.id,
        user_id=q.user_id,
        user_name=user_name or (q.user.full_name if q.user else "Aspirant"),
        exam_level=q.exam_level,
        subject=q.subject,
        chapter=q.chapter,
        question_text=q.question_text,
        difficulty=q.difficulty,
        explanation=q.explanation,
        image_url=q.image_url,
        explanation_image_url=q.explanation_image_url,
        is_shared=q.is_shared,
        share_token=q.share_token,
        share_url=f"/#shared={q.share_token}",
        created_at=q.created_at,
        options=[
            SavedOptionOut(
                id=opt.id,
                option_key=opt.option_key,
                option_text=opt.option_text,
                is_correct=opt.is_correct,
                image_url=opt.image_url
            ) for opt in q.options
        ]
    )

@router.get("", response_model=SavedQuestionsSummaryOut)
def list_saved_questions(
    exam_level: Optional[str] = Query(None),
    subject: Optional[str] = Query(None),
    chapter: Optional[str] = Query(None),
    current_user: User = Depends(get_approved_student),
    db: Session = Depends(get_db)
):
    # Query user's own saved questions PLUS all shared/admin-published questions
    base_filter = or_(SavedQuestion.user_id == current_user.id, SavedQuestion.is_shared == True)
    query = (
        db.query(SavedQuestion)
        .options(selectinload(SavedQuestion.options), joinedload(SavedQuestion.user))
        .filter(base_filter)
    )
    
    if exam_level and exam_level.lower() != 'all':
        query = query.filter(SavedQuestion.exam_level == exam_level)
    if subject and subject.lower() != 'all':
        query = query.filter(SavedQuestion.subject == subject)
    if chapter and chapter.lower() != 'all':
        query = query.filter(SavedQuestion.chapter == chapter)

    questions = query.order_by(SavedQuestion.created_at.desc()).all()
    
    # Extract distinct filter options
    distinct_levels = sorted(list(set(q.exam_level for q in questions if q.exam_level)))
    distinct_subjects = sorted(list(set(q.subject for q in questions if q.subject)))
    distinct_chapters = sorted(list(set(q.chapter for q in questions if q.chapter)))

    formatted = [_format_question_out(q, q.user.full_name if q.user else "Faculty") for q in questions]

    return SavedQuestionsSummaryOut(
        total_saved=len(questions),
        exam_levels=distinct_levels,
        subjects=distinct_subjects,
        chapters=distinct_chapters,
        questions=formatted
    )

@router.post("", response_model=SavedQuestionOut, status_code=status.HTTP_201_CREATED)
def create_saved_question(
    data: SavedQuestionCreate,
    current_user: User = Depends(get_approved_student),
    db: Session = Depends(get_db)
):
    if not data.question_text.strip():
        raise HTTPException(status_code=400, detail="Question statement cannot be empty")
    if not data.options or len(data.options) < 2:
        raise HTTPException(status_code=400, detail="At least 2 options must be provided")

    has_correct = any(opt.is_correct for opt in data.options)
    if not has_correct:
        # Default to first option if none explicitly marked
        data.options[0].is_correct = True

    new_q = SavedQuestion(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        exam_level=data.exam_level.strip() if data.exam_level else "NEET UG",
        subject=data.subject.strip(),
        chapter=data.chapter.strip(),
        question_text=data.question_text.strip(),
        difficulty=data.difficulty.upper() if data.difficulty else "MEDIUM",
        explanation=data.explanation.strip(),
        image_url=data.image_url,
        explanation_image_url=data.explanation_image_url,
        is_shared=data.is_shared,
        share_token=str(uuid.uuid4())
    )
    db.add(new_q)
    db.flush()

    for opt_data in data.options:
        opt = SavedQuestionOption(
            id=str(uuid.uuid4()),
            saved_question_id=new_q.id,
            option_key=opt_data.option_key.strip().upper(),
            option_text=opt_data.option_text.strip(),
            is_correct=opt_data.is_correct,
            image_url=opt_data.image_url
        )
        db.add(opt)

    db.commit()
    db.refresh(new_q)

    return _format_question_out(new_q, current_user.full_name)

@router.get("/{question_id}", response_model=SavedQuestionOut)
def get_saved_question(
    question_id: str,
    current_user: User = Depends(get_approved_student),
    db: Session = Depends(get_db)
):
    q = db.query(SavedQuestion).filter(
        SavedQuestion.id == question_id,
        SavedQuestion.user_id == current_user.id
    ).first()
    if not q:
        raise HTTPException(status_code=404, detail="Saved question not found")
    return _format_question_out(q, current_user.full_name)

@router.put("/{question_id}", response_model=SavedQuestionOut)
def update_saved_question(
    question_id: str,
    data: SavedQuestionUpdate,
    current_user: User = Depends(get_approved_student),
    db: Session = Depends(get_db)
):
    q = db.query(SavedQuestion).filter(
        SavedQuestion.id == question_id,
        SavedQuestion.user_id == current_user.id
    ).first()
    if not q:
        raise HTTPException(status_code=404, detail="Saved question not found")

    if data.exam_level is not None:
        q.exam_level = data.exam_level.strip()
    if data.subject is not None:
        q.subject = data.subject.strip()
    if data.chapter is not None:
        q.chapter = data.chapter.strip()
    if data.question_text is not None:
        q.question_text = data.question_text.strip()
    if data.difficulty is not None:
        q.difficulty = data.difficulty.upper()
    if data.explanation is not None:
        q.explanation = data.explanation.strip()
    if data.image_url is not None:
        q.image_url = data.image_url
    if data.explanation_image_url is not None:
        q.explanation_image_url = data.explanation_image_url
    if data.is_shared is not None:
        q.is_shared = data.is_shared

    if data.options is not None:
        db.query(SavedQuestionOption).filter(SavedQuestionOption.saved_question_id == q.id).delete()
        for opt_data in data.options:
            opt = SavedQuestionOption(
                id=str(uuid.uuid4()),
                saved_question_id=q.id,
                option_key=opt_data.option_key.strip().upper(),
                option_text=opt_data.option_text.strip(),
                is_correct=opt_data.is_correct,
                image_url=opt_data.image_url
            )
            db.add(opt)

    db.commit()
    db.refresh(q)
    return _format_question_out(q, current_user.full_name)

@router.delete("/{question_id}")
def delete_saved_question(
    question_id: str,
    current_user: User = Depends(get_approved_student),
    db: Session = Depends(get_db)
):
    q = db.query(SavedQuestion).filter(
        SavedQuestion.id == question_id,
        SavedQuestion.user_id == current_user.id
    ).first()
    if not q:
        raise HTTPException(status_code=404, detail="Saved question not found")
    
    db.delete(q)
    db.commit()
    return {"status": "deleted", "question_id": question_id}

@router.post("/{question_id}/share", response_model=ShareStatusResponse)
def toggle_share_saved_question(
    question_id: str,
    is_shared: Optional[bool] = Query(None),
    current_user: User = Depends(get_approved_student),
    db: Session = Depends(get_db)
):
    q = db.query(SavedQuestion).filter(
        SavedQuestion.id == question_id,
        SavedQuestion.user_id == current_user.id
    ).first()
    if not q:
        raise HTTPException(status_code=404, detail="Saved question not found")

    if is_shared is not None:
        q.is_shared = is_shared
    else:
        q.is_shared = not q.is_shared

    db.commit()
    db.refresh(q)

    share_url = f"/#shared={q.share_token}"
    msg = "Question is now shared and accessible via link." if q.is_shared else "Question is now private."
    return ShareStatusResponse(
        id=q.id,
        is_shared=q.is_shared,
        share_token=q.share_token,
        share_url=share_url,
        message=msg
    )

@router.get("/shared/{share_token}", response_model=SavedQuestionOut)
def get_shared_question(
    share_token: str,
    db: Session = Depends(get_db)
):
    q = db.query(SavedQuestion).filter(SavedQuestion.share_token == share_token).first()
    if not q:
        raise HTTPException(status_code=404, detail="Shared question not found")
    
    if not q.is_shared:
        raise HTTPException(
            status_code=403,
            detail="This question is private. The author has not enabled sharing for it."
        )

    author_name = q.user.full_name if q.user else "Medicqube Aspirant"
    return _format_question_out(q, author_name)
