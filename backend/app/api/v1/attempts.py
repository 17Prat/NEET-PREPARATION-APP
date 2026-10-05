from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.attempt import TestAttempt, AttemptAnswer
from backend.app.models.question import QuestionOption
from backend.app.models.user import User
from backend.app.schemas.test import (
    SyncAnswerIn,
    SubmitAttemptIn,
    ResultSummaryOut,
    QuestionReviewOut,
    OptionWithCorrectOut
)
from backend.app.services.scoring_engine import evaluate_test_attempt
from backend.app.api.deps import get_approved_student

router = APIRouter(prefix="/attempts", tags=["Attempts & Results"])

@router.put("/{attempt_id}/sync")
def sync_answers(
    attempt_id: str,
    data: SyncAnswerIn,
    current_user: User = Depends(get_approved_student),
    db: Session = Depends(get_db)
):
    attempt = db.query(TestAttempt).filter(TestAttempt.id == attempt_id, TestAttempt.user_id == current_user.id).first()
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")
    if attempt.status != "IN_PROGRESS":
        raise HTTPException(status_code=400, detail="Cannot sync answers for a submitted or expired attempt")

    for item in data.answers:
        ans = db.query(AttemptAnswer).filter(
            AttemptAnswer.attempt_id == attempt.id,
            AttemptAnswer.question_id == item.question_id
        ).first()

        if not ans:
            ans = AttemptAnswer(
                attempt_id=attempt.id,
                question_id=item.question_id
            )
            db.add(ans)

        ans.selected_option_id = item.selected_option_id
        ans.is_marked_for_review = item.is_marked_for_review
        ans.time_spent_seconds = item.time_spent_seconds

    db.commit()
    return {"status": "synced", "count": len(data.answers)}

@router.post("/{attempt_id}/submit", response_model=ResultSummaryOut)
def submit_attempt(
    attempt_id: str,
    data: SubmitAttemptIn,
    current_user: User = Depends(get_approved_student),
    db: Session = Depends(get_db)
):
    attempt = db.query(TestAttempt).filter(TestAttempt.id == attempt_id, TestAttempt.user_id == current_user.id).first()
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")
    if attempt.status == "SUBMITTED":
        # Already submitted, return existing result
        pass
    else:
        # Perform rigorous server-side evaluation
        attempt = evaluate_test_attempt(db, attempt, data.answers)

    max_score = float(attempt.test.total_marks) if attempt.test else float(attempt.total_questions * 4)

    return ResultSummaryOut(
        attempt_id=attempt.id,
        test_id=attempt.test_id,
        test_title=attempt.test.title if attempt.test else "NEET Test",
        total_questions=attempt.total_questions,
        attempted_count=attempt.attempted_count,
        correct_count=attempt.correct_count,
        wrong_count=attempt.wrong_count,
        unattempted_count=attempt.unattempted_count,
        total_score=float(attempt.total_score),
        max_score=max_score,
        accuracy_percentage=float(attempt.accuracy_percentage),
        time_taken_seconds=attempt.time_taken_seconds,
        submitted_at=attempt.submitted_at or attempt.started_at
    )

@router.get("/{attempt_id}/result", response_model=ResultSummaryOut)
def get_attempt_result(
    attempt_id: str,
    current_user: User = Depends(get_approved_student),
    db: Session = Depends(get_db)
):
    attempt = db.query(TestAttempt).filter(TestAttempt.id == attempt_id, TestAttempt.user_id == current_user.id).first()
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")

    max_score = float(attempt.test.total_marks) if attempt.test else float(attempt.total_questions * 4)

    return ResultSummaryOut(
        attempt_id=attempt.id,
        test_id=attempt.test_id,
        test_title=attempt.test.title if attempt.test else "NEET Test",
        total_questions=attempt.total_questions,
        attempted_count=attempt.attempted_count,
        correct_count=attempt.correct_count,
        wrong_count=attempt.wrong_count,
        unattempted_count=attempt.unattempted_count,
        total_score=float(attempt.total_score),
        max_score=max_score,
        accuracy_percentage=float(attempt.accuracy_percentage),
        time_taken_seconds=attempt.time_taken_seconds,
        submitted_at=attempt.submitted_at or attempt.started_at
    )

@router.get("/{attempt_id}/review", response_model=List[QuestionReviewOut])
def get_attempt_review(
    attempt_id: str,
    current_user: User = Depends(get_approved_student),
    db: Session = Depends(get_db)
):
    attempt = db.query(TestAttempt).filter(TestAttempt.id == attempt_id, TestAttempt.user_id == current_user.id).first()
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")

    results = []
    # Loop through test questions in defined order
    for tq in attempt.test.test_questions:
        q = tq.question
        ans = db.query(AttemptAnswer).filter(
            AttemptAnswer.attempt_id == attempt.id,
            AttemptAnswer.question_id == q.id
        ).first()

        selected_opt_id = ans.selected_option_id if ans else None
        is_correct = ans.is_correct if ans else None
        marks = float(ans.marks_obtained) if ans else 0.0
        time_spent = ans.time_spent_seconds if ans else 0
        is_review = ans.is_marked_for_review if ans else False

        # Include is_correct flag only in solution review
        options_out = [
            OptionWithCorrectOut(
                id=opt.id,
                option_key=opt.option_key,
                option_text=opt.option_text,
                is_correct=opt.is_correct,
                image_url=opt.image_url
            ) for opt in q.options
        ]

        results.append(QuestionReviewOut(
            question_id=q.id,
            question_text=q.question_text,
            difficulty=q.difficulty,
            section_name=tq.section_name,
            options=options_out,
            selected_option_id=selected_opt_id,
            is_correct=is_correct,
            marks_obtained=marks,
            time_spent_seconds=time_spent,
            explanation=q.explanation,
            is_marked_for_review=is_review
        ))

    return results
