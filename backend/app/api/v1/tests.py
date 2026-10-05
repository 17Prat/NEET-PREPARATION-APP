import uuid
from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.test import Test, TestQuestion
from backend.app.models.attempt import TestAttempt
from backend.app.models.user import User
from backend.app.schemas.test import TestOut, StartAttemptOut
from backend.app.api.deps import get_current_user, get_approved_student

router = APIRouter(prefix="/tests", tags=["Test Engine"])

@router.get("", response_model=List[TestOut])
def list_tests(
    test_type: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Test).filter(Test.is_published == True)
    if test_type and test_type.upper() in ("CHAPTER", "SUBJECT", "PART", "FULL_MOCK"):
        query = query.filter(Test.test_type == test_type.upper())
    
    tests = query.all()
    results = []
    for t in tests:
        results.append(TestOut(
            id=t.id,
            title=t.title,
            description=t.description,
            test_type=t.test_type,
            duration_minutes=t.duration_minutes,
            total_marks=t.total_marks,
            positive_marks_per_q=float(t.positive_marks_per_q),
            negative_marks_per_q=float(t.negative_marks_per_q),
            question_count=len(t.test_questions),
            is_published=t.is_published
        ))
    return results

@router.get("/{test_id}", response_model=TestOut)
def get_test(test_id: str, db: Session = Depends(get_db)):
    t = db.query(Test).filter(Test.id == test_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Test not found")
    return TestOut(
        id=t.id,
        title=t.title,
        description=t.description,
        test_type=t.test_type,
        duration_minutes=t.duration_minutes,
        total_marks=t.total_marks,
        positive_marks_per_q=float(t.positive_marks_per_q),
        negative_marks_per_q=float(t.negative_marks_per_q),
        question_count=len(t.test_questions),
        is_published=t.is_published
    )

@router.post("/{test_id}/attempts", response_model=StartAttemptOut)
def start_test_attempt(
    test_id: str,
    current_user: User = Depends(get_approved_student),
    db: Session = Depends(get_db)
):
    test = db.query(Test).filter(Test.id == test_id, Test.is_published == True).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found or unavailable")

    # Create new attempt session
    attempt = TestAttempt(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        test_id=test.id,
        started_at=datetime.now(timezone.utc),
        status="IN_PROGRESS",
        total_questions=len(test.test_questions)
    )
    db.add(attempt)
    db.commit()

    # Deliver questions with options MASKED (is_correct & explanation omitted strictly)
    questions_payload = []
    for tq in test.test_questions:
        q = tq.question
        if not q or not q.is_active:
            continue

        questions_payload.append({
            "id": q.id,
            "topic_id": q.topic_id,
            "question_text": q.question_text,
            "question_type": q.question_type,
            "difficulty": q.difficulty,
            "image_url": q.image_url,
            "section_name": tq.section_name,
            "order_index": tq.order_index,
            "options": [
                {
                    "id": opt.id,
                    "option_key": opt.option_key,
                    "option_text": opt.option_text,
                    "image_url": opt.image_url
                } for opt in q.options
            ]
        })

    return StartAttemptOut(
        attempt_id=attempt.id,
        test_id=test.id,
        title=test.title,
        duration_minutes=test.duration_minutes,
        started_at=attempt.started_at,
        total_questions=len(questions_payload),
        questions=questions_payload
    )
