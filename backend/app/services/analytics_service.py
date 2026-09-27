from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.app.models.attempt import TestAttempt, AttemptAnswer
from backend.app.models.question import Question
from backend.app.models.taxonomy import Subject, Chapter, Topic
from backend.app.models.mistake import UserMistake
from backend.app.models.bookmark import Bookmark
from backend.app.schemas.analytics import (
    DashboardStatsOut,
    SubjectPerformance,
    ChapterPerformance,
    RecentAttemptOut
)
from backend.app.core.config import settings

def get_student_dashboard_analytics(db: Session, user_id: str) -> DashboardStatsOut:
    # 1. Total attempted answers across all tests/practice for this student
    answers_query = db.query(AttemptAnswer).join(TestAttempt).filter(
        TestAttempt.user_id == user_id,
        AttemptAnswer.selected_option_id.isnot(None)
    )

    total_attempted = answers_query.count()
    correct_count = answers_query.filter(AttemptAnswer.is_correct == True).count()
    overall_accuracy = (correct_count / total_attempted * 100.0) if total_attempted > 0 else 0.0

    # 2. Completed tests
    tests_completed = db.query(TestAttempt).filter(
        TestAttempt.user_id == user_id,
        TestAttempt.status == "SUBMITTED"
    ).count()

    # 3. Mistakes and bookmarks
    unresolved_mistakes = db.query(UserMistake).filter(
        UserMistake.user_id == user_id,
        UserMistake.is_resolved == False
    ).count()

    bookmarks_count = db.query(Bookmark).filter(
        Bookmark.user_id == user_id
    ).count()

    # 4. Subject-level performance
    subjects = db.query(Subject).all()
    subject_performances: list[SubjectPerformance] = []

    for sub in subjects:
        sub_answers = db.query(AttemptAnswer).join(TestAttempt).join(Question).join(Topic).join(Chapter).filter(
            TestAttempt.user_id == user_id,
            AttemptAnswer.selected_option_id.isnot(None),
            Chapter.subject_id == sub.id
        )
        sub_attempted = sub_answers.count()
        sub_correct = sub_answers.filter(AttemptAnswer.is_correct == True).count()
        sub_acc = (sub_correct / sub_attempted * 100.0) if sub_attempted > 0 else 0.0

        subject_performances.append(SubjectPerformance(
            subject_id=sub.id,
            subject_name=sub.name,
            attempted_count=sub_attempted,
            correct_count=sub_correct,
            accuracy_percentage=round(sub_acc, 1)
        ))

    # 5. Chapter-level performance & "Areas to Practice"
    chapters = db.query(Chapter).join(Subject).all()
    areas_to_practice: list[ChapterPerformance] = []

    for chap in chapters:
        chap_answers = db.query(AttemptAnswer).join(TestAttempt).join(Question).join(Topic).filter(
            TestAttempt.user_id == user_id,
            AttemptAnswer.selected_option_id.isnot(None),
            Topic.chapter_id == chap.id
        )
        chap_attempted = chap_answers.count()
        chap_correct = chap_answers.filter(AttemptAnswer.is_correct == True).count()
        chap_acc = (chap_correct / chap_attempted * 100.0) if chap_attempted > 0 else 0.0

        if chap_attempted < settings.MIN_ATTEMPTS_FOR_ANALYSIS:
            status = "INSUFFICIENT_DATA"
        elif chap_acc < settings.WEAK_AREA_ACCURACY_THRESHOLD:
            status = "WEAK"
        elif chap_acc <= 75.0:
            status = "NEEDS_PRACTICE"
        else:
            status = "STRONG"

        perf = ChapterPerformance(
            chapter_id=chap.id,
            chapter_name=chap.name,
            subject_name=chap.subject.name if chap.subject else "General",
            attempted_count=chap_attempted,
            correct_count=chap_correct,
            accuracy_percentage=round(chap_acc, 1),
            status=status
        )
        if status in ("WEAK", "NEEDS_PRACTICE"):
            areas_to_practice.append(perf)

    # 6. Recent test attempts
    recent_attempts_db = db.query(TestAttempt).filter(
        TestAttempt.user_id == user_id,
        TestAttempt.status == "SUBMITTED"
    ).order_by(TestAttempt.submitted_at.desc()).limit(5).all()

    recent_attempts = [
        RecentAttemptOut(
            attempt_id=att.id,
            test_title=att.test.title if att.test else "Custom Test",
            test_type=att.test.test_type if att.test else "MOCK",
            total_score=float(att.total_score),
            accuracy_percentage=float(att.accuracy_percentage),
            submitted_at=att.submitted_at
        ) for att in recent_attempts_db
    ]

    return DashboardStatsOut(
        total_questions_solved=total_attempted,
        overall_accuracy=round(overall_accuracy, 1),
        tests_completed=tests_completed,
        unresolved_mistakes_count=unresolved_mistakes,
        bookmarks_count=bookmarks_count,
        subject_performances=subject_performances,
        areas_to_practice=areas_to_practice,
        recent_attempts=recent_attempts
    )
