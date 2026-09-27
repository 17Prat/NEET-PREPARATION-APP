import uuid
from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.question import Question, QuestionOption
from backend.app.models.test import Test, TestQuestion
from backend.app.models.attempt import TestAttempt
from backend.app.models.taxonomy import Topic
from backend.app.schemas.admin import QuestionCreate, TestCreate
from backend.app.schemas.test import TestOut
from backend.app.api.deps import get_current_admin

router = APIRouter(prefix="/admin", tags=["Admin Portal"])

@router.post("/questions")
def create_question(
    data: QuestionCreate,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    topic = db.query(Topic).filter(Topic.id == data.topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic does not exist")

    # Validate that at least one option is marked correct
    has_correct = any(opt.is_correct for opt in data.options)
    if not has_correct:
        raise HTTPException(status_code=400, detail="At least one option must be marked as correct")

    q = Question(
        id=str(uuid.uuid4()),
        topic_id=data.topic_id,
        question_text=data.question_text,
        question_type="SINGLE_CHOICE",
        difficulty=data.difficulty.upper(),
        explanation=data.explanation,
        image_url=data.image_url,
        source=data.source,
        year=data.year,
        is_active=True
    )
    db.add(q)
    db.flush()

    for opt_data in data.options:
        opt = QuestionOption(
            id=str(uuid.uuid4()),
            question_id=q.id,
            option_key=opt_data.option_key.upper(),
            option_text=opt_data.option_text,
            is_correct=opt_data.is_correct,
            image_url=opt_data.image_url
        )
        db.add(opt)

    db.commit()
    db.refresh(q)
    return {"status": "created", "question_id": q.id, "message": "Question successfully added to question bank"}

@router.get("/questions")
def list_admin_questions(
    topic_id: Optional[int] = Query(None),
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    query = db.query(Question)
    if topic_id:
        query = query.filter(Question.topic_id == topic_id)
    questions = query.order_by(Question.created_at.desc()).all()

    return [
        {
            "id": q.id,
            "topic_id": q.topic_id,
            "topic_name": q.topic.name if q.topic else None,
            "question_text": q.question_text,
            "difficulty": q.difficulty,
            "source": q.source,
            "year": q.year,
            "options_count": len(q.options),
            "created_at": q.created_at
        } for q in questions
    ]

@router.post("/tests", response_model=TestOut)
def create_test(
    data: TestCreate,
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    if not data.question_ids:
        raise HTTPException(status_code=400, detail="A test must contain at least one question")

    total_marks = int(len(data.question_ids) * data.positive_marks_per_q)

    test = Test(
        id=str(uuid.uuid4()),
        title=data.title,
        description=data.description,
        test_type=data.test_type.upper(),
        duration_minutes=data.duration_minutes,
        total_marks=total_marks,
        positive_marks_per_q=data.positive_marks_per_q,
        negative_marks_per_q=data.negative_marks_per_q,
        is_published=True
    )
    db.add(test)
    db.flush()

    for idx, qid in enumerate(data.question_ids, 1):
        tq = TestQuestion(
            id=str(uuid.uuid4()),
            test_id=test.id,
            question_id=qid,
            section_name="Section A",
            order_index=idx
        )
        db.add(tq)

    db.commit()
    db.refresh(test)

    return TestOut(
        id=test.id,
        title=test.title,
        description=test.description,
        test_type=test.test_type,
        duration_minutes=test.duration_minutes,
        total_marks=test.total_marks,
        positive_marks_per_q=float(test.positive_marks_per_q),
        negative_marks_per_q=float(test.negative_marks_per_q),
        question_count=len(data.question_ids),
        is_published=test.is_published
    )

@router.get("/attempts")
def list_student_attempts(
    current_admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    attempts = db.query(TestAttempt).order_by(TestAttempt.started_at.desc()).limit(20).all()
    return [
        {
            "attempt_id": att.id,
            "student_name": att.user.full_name if att.user else "Anonymous",
            "student_email": att.user.email if att.user else "N/A",
            "test_title": att.test.title if att.test else "Custom",
            "status": att.status,
            "score": float(att.total_score),
            "accuracy": float(att.accuracy_percentage),
            "started_at": att.started_at,
            "submitted_at": att.submitted_at
        } for att in attempts
    ]
