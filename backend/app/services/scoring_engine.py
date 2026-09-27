from datetime import datetime, timezone
from sqlalchemy.orm import Session
from backend.app.models.attempt import TestAttempt, AttemptAnswer
from backend.app.models.question import Question, QuestionOption
from backend.app.models.mistake import UserMistake
from backend.app.models.test import Test
from backend.app.schemas.test import AnswerItem

def evaluate_test_attempt(db: Session, attempt: TestAttempt, answers_data: list[AnswerItem]) -> TestAttempt:
    test: Test = db.query(Test).filter(Test.id == attempt.test_id).first()
    if not test:
        raise ValueError("Associated test not found")

    pos_mark = float(test.positive_marks_per_q)
    neg_mark = float(test.negative_marks_per_q)

    # Map existing or new answers
    total_q = attempt.total_questions or len(test.test_questions)
    attempted_count = 0
    correct_count = 0
    wrong_count = 0
    unattempted_count = 0
    total_score = 0.0
    total_time_spent = 0

    answers_dict = {ans.question_id: ans for ans in answers_data}

    # Fetch all test questions
    for tq in test.test_questions:
        q_id = tq.question_id
        user_ans = answers_dict.get(q_id)
        selected_opt_id = user_ans.selected_option_id if user_ans else None
        is_review = user_ans.is_marked_for_review if user_ans else False
        time_spent = user_ans.time_spent_seconds if user_ans else 0
        total_time_spent += time_spent

        # Find existing AttemptAnswer or create new
        db_answer = db.query(AttemptAnswer).filter(
            AttemptAnswer.attempt_id == attempt.id,
            AttemptAnswer.question_id == q_id
        ).first()

        if not db_answer:
            db_answer = AttemptAnswer(
                attempt_id=attempt.id,
                question_id=q_id
            )
            db.add(db_answer)

        db_answer.selected_option_id = selected_opt_id
        db_answer.is_marked_for_review = is_review
        db_answer.time_spent_seconds = time_spent

        if selected_opt_id:
            attempted_count += 1
            # Check correctness against question_options
            option = db.query(QuestionOption).filter(
                QuestionOption.id == selected_opt_id,
                QuestionOption.question_id == q_id
            ).first()

            if option and option.is_correct:
                db_answer.is_correct = True
                db_answer.marks_obtained = pos_mark
                correct_count += 1
                total_score += pos_mark
            else:
                db_answer.is_correct = False
                db_answer.marks_obtained = -neg_mark
                wrong_count += 1
                total_score -= neg_mark

                # Auto-record in UserMistakes
                mistake = db.query(UserMistake).filter(
                    UserMistake.user_id == attempt.user_id,
                    UserMistake.question_id == q_id
                ).first()

                if mistake:
                    mistake.failure_count += 1
                    mistake.last_selected_option_id = selected_opt_id
                    mistake.is_resolved = False
                    mistake.last_attempted_at = datetime.now(timezone.utc)
                else:
                    new_mistake = UserMistake(
                        user_id=attempt.user_id,
                        question_id=q_id,
                        failure_count=1,
                        last_selected_option_id=selected_opt_id,
                        is_resolved=False,
                        last_attempted_at=datetime.now(timezone.utc)
                    )
                    db.add(new_mistake)
        else:
            db_answer.is_correct = None
            db_answer.marks_obtained = 0.0
            unattempted_count += 1

    accuracy = (correct_count / attempted_count * 100.0) if attempted_count > 0 else 0.0

    attempt.status = "SUBMITTED"
    attempt.submitted_at = datetime.now(timezone.utc)
    attempt.total_questions = total_q
    attempt.attempted_count = attempted_count
    attempt.correct_count = correct_count
    attempt.wrong_count = wrong_count
    attempt.unattempted_count = unattempted_count
    attempt.total_score = round(total_score, 2)
    attempt.accuracy_percentage = round(accuracy, 2)
    attempt.time_taken_seconds = total_time_spent

    db.commit()
    db.refresh(attempt)
    return attempt
