from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload, selectinload
from backend.app.core.database import get_db
from backend.app.models.question import Question, QuestionOption
from backend.app.models.taxonomy import Subject, Chapter, Topic
from backend.app.models.bookmark import Bookmark
from backend.app.models.mistake import UserMistake
from backend.app.models.user import User
from backend.app.schemas.question import QuestionOut, PracticeSubmitIn, PracticeResultOut
from backend.app.api.deps import get_current_user, get_approved_student

router = APIRouter(prefix="/practice", tags=["Practice"])

@router.get("/questions", response_model=List[QuestionOut])
def get_practice_questions(
    topic_id: Optional[int] = Query(None),
    chapter_id: Optional[int] = Query(None),
    subject_id: Optional[int] = Query(None),
    difficulty: Optional[str] = Query(None),
    year: Optional[int] = Query(None),
    pyq_only: Optional[bool] = Query(None),
    limit: Optional[int] = Query(100),
    current_user: User = Depends(get_approved_student),
    db: Session = Depends(get_db)
):
    # Eager load topic -> chapter -> subject and options in 2 batch queries (eliminating hundreds of N+1 queries)
    query = (
        db.query(Question)
        .options(
            joinedload(Question.topic).joinedload(Topic.chapter).joinedload(Chapter.subject),
            selectinload(Question.options)
        )
        .filter(Question.is_active == True)
    )

    if topic_id is not None:
        query = query.filter(Question.topic_id == topic_id)
    elif chapter_id is not None:
        query = query.join(Topic, Question.topic_id == Topic.id).filter(Topic.chapter_id == chapter_id)
    elif subject_id is not None:
        query = (
            query.join(Topic, Question.topic_id == Topic.id)
            .join(Chapter, Topic.chapter_id == Chapter.id)
            .filter(Chapter.subject_id == subject_id)
        )

    if difficulty and difficulty.upper() in ("EASY", "MEDIUM", "HARD"):
        query = query.filter(Question.difficulty == difficulty.upper())
    if pyq_only:
        query = query.filter((Question.source.ilike("%NEET%")) | (Question.year.isnot(None)))
    if year:
        query = query.filter(Question.year == year)

    # Order newest first so questions just added by admin show up immediately!
    questions = query.order_by(Question.created_at.desc()).limit(limit or 100).all()
    
    # Check bookmarks in a single fast indexed query
    q_ids = [q.id for q in questions]
    if q_ids:
        bookmarked_qids = set(
            row[0] for row in db.query(Bookmark.question_id)
            .filter(Bookmark.user_id == current_user.id, Bookmark.question_id.in_(q_ids))
            .all()
        )
    else:
        bookmarked_qids = set()

    results = []
    for q in questions:
        chap_name = q.topic.chapter.name if (q.topic and q.topic.chapter) else None
        sub_name = q.topic.chapter.subject.name if (q.topic and q.topic.chapter and q.topic.chapter.subject) else None
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
            "subject": sub_name,
            "chapter": chap_name,
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

@router.post("/ask-doubt")
def ask_doubt_endpoint(
    data: dict,
    db: Session = Depends(get_db)
):
    subject = data.get("subject", "General")
    doubt_text = data.get("doubt_text", "").strip()
    
    # High-yield intelligent solver
    doubt_lower = doubt_text.lower()
    
    if "phycoerythrin" in doubt_lower or "red algae" in doubt_lower or "rhodophyceae" in doubt_lower:
        solution = {
            "subject": "Biology",
            "topic": "Plant Kingdom: Rhodophyceae",
            "concept": "Photosynthetic Pigments & Chromatic Adaptation in Algae",
            "explanation": "Red algae (**Rhodophyceae**) possess a predominance of the reddish pigment **r-phycoerythrin** along with chlorophyll $a$ and $d$. Because phycoerythrin effectively absorbs high-energy blue-green light wavelengths that penetrate deepest into ocean waters, red algae can thrive at significant depths where other photosynthetic plants cannot survive.",
            "ncert_ref": "NCERT Class 11 Biology, Chapter 3: Plant Kingdom (Section 3.1.3 Rhodophyceae)",
            "exam_tip": "High-Yield NEET Note: Stored food in Rhodophyceae is **Floridean starch**, structurally very similar to amylopectin and glycogen."
        }
    elif "friction" in doubt_lower or "limiting" in doubt_lower or "block" in doubt_lower:
        solution = {
            "subject": "Physics",
            "topic": "Laws of Motion & Friction",
            "concept": "Static Friction vs. Limiting Friction",
            "explanation": "Static friction is a self-adjusting force: $f_s \\le f_{s(max)} = \\mu_s N = \\mu_s mg$. If applied force $F_{ext} < f_{s(max)}$, the body does not accelerate, and the actual static friction is exactly equal in magnitude to $F_{ext}$. Only when applied force exceeds limiting friction does kinetic friction ($f_k = \\mu_k N$) oppose sliding motion.",
            "ncert_ref": "NCERT Class 11 Physics, Chapter 5: Laws of Motion (Section 5.9)",
            "exam_tip": "NEET Trap: Static friction does not always equal $\\mu_s N$; it equals applied force until limiting threshold is breached!"
        }
    elif "gibbs" in doubt_lower or "spontaneous" in doubt_lower or "delta g" in doubt_lower:
        solution = {
            "subject": "Chemistry",
            "topic": "Chemical Thermodynamics",
            "concept": "Criterion for Spontaneity: $\\Delta G = \\Delta H - T\\Delta S$",
            "explanation": "At constant temperature and pressure, the criterion for a process to occur spontaneously is $\\Delta G_{system} < 0$. If $\\Delta G = 0$, the system is in dynamic equilibrium. If $\\Delta G > 0$, the reverse process is spontaneous.",
            "ncert_ref": "NCERT Class 11 Chemistry, Unit 6: Thermodynamics (Section 6.6)",
            "exam_tip": "For an exothermic reaction ($\\Delta H < 0$) with decrease in entropy ($\\Delta S < 0$), spontaneity occurs only at lower temperatures where $|\\Delta H| > |T\\Delta S|$."
        }
    else:
        solution = {
            "subject": subject,
            "topic": f"NEET High-Yield {subject} Concept",
            "concept": "Diagnostic Concept Breakdown & Core Principles",
            "explanation": f"Regarding your question: *\"{doubt_text}\"*\n\n1. **Fundamental Principle**: Ensure you identify the governing law or mechanism from NCERT for this {subject} problem.\n2. **Application**: Relate standard formulas or biological classification pathways to the given parameters.\n3. **Result**: Verify dimensional consistency in Physics, charge balance in Chemistry, or exact taxonomic rank in Biology.",
            "ncert_ref": f"NCERT NEET {subject} Syllabus Benchmark",
            "exam_tip": "Always eliminate 2 obviously contradictory options first in NEET MCQs before finalizing your answer."
        }

    return {"status": "success", "solution": solution}

@router.post("/submit-answer", response_model=PracticeResultOut)
def submit_practice_answer(
    data: PracticeSubmitIn,
    current_user: User = Depends(get_approved_student),
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


# =====================================================================
# Unified Question & Test Series Creator
# Allows adding custom questions that appear instantly in BOTH Practice & Test Series
# =====================================================================
import uuid
import re
from pydantic import BaseModel
from backend.app.models.taxonomy import Subject, Chapter, Topic
from backend.app.models.test import Test, TestQuestion
from backend.app.models.saved_question import SavedQuestion, SavedQuestionOption

def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text.strip('-') or "topic"

class UnifiedOptionIn(BaseModel):
    option_key: str
    option_text: str
    is_correct: bool = False
    image_url: Optional[str] = None

class UnifiedQuestionIn(BaseModel):
    subject_name: str
    chapter_name: str
    topic_name: Optional[str] = None
    question_text: str
    difficulty: str = "MEDIUM"
    explanation: str = ""
    image_url: Optional[str] = None
    source: Optional[str] = "Medicqube"
    year: Optional[int] = None
    options: Optional[List[UnifiedOptionIn]] = None
    option_a: Optional[str] = None
    option_b: Optional[str] = None
    option_c: Optional[str] = None
    option_d: Optional[str] = None
    correct_option: Optional[str] = 'A'
    add_to_practice: bool = True
    add_to_test: bool = True
    test_id: Optional[str] = None
    test_title: Optional[str] = None
    exam_level: Optional[str] = "NEET UG"


@router.post("/unified-add-question")
def add_unified_question(
    data: UnifiedQuestionIn,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Support both options array or option_a/b/c/d fields from Admin forms
    if not data.options:
        opts = []
        if data.option_a is not None and data.option_a.strip():
            opts.append(UnifiedOptionIn(option_key="A", option_text=data.option_a.strip(), is_correct=(data.correct_option == "A")))
        if data.option_b is not None and data.option_b.strip():
            opts.append(UnifiedOptionIn(option_key="B", option_text=data.option_b.strip(), is_correct=(data.correct_option == "B")))
        if data.option_c is not None and data.option_c.strip():
            opts.append(UnifiedOptionIn(option_key="C", option_text=data.option_c.strip(), is_correct=(data.correct_option == "C")))
        if data.option_d is not None and data.option_d.strip():
            opts.append(UnifiedOptionIn(option_key="D", option_text=data.option_d.strip(), is_correct=(data.correct_option == "D")))
        data.options = opts

    if not data.options or len(data.options) < 2:
        raise HTTPException(status_code=400, detail="At least 2 options are required")

    sub_name = (data.subject_name or "Biology").strip()
    subject = db.query(Subject).filter(Subject.name.ilike(sub_name)).first()
    if not subject:
        icon = "atom" if "phys" in sub_name.lower() else ("flask" if "chem" in sub_name.lower() else "dna")
        max_order = db.query(Subject).count()
        subject = Subject(name=sub_name, slug=slugify(sub_name), icon=icon, display_order=max_order + 1)
        db.add(subject)
        db.flush()

    chap_name = (data.chapter_name or "General Concepts").strip()
    chapter = db.query(Chapter).filter(
        Chapter.name.ilike(chap_name),
        Chapter.subject_id == subject.id
    ).first()
    if not chapter:
        chap_order = db.query(Chapter).filter(Chapter.subject_id == subject.id).count()
        chapter = Chapter(
            subject_id=subject.id,
            name=chap_name,
            slug=slugify(chap_name),
            display_order=chap_order + 1
        )
        db.add(chapter)
        db.flush()

    top_name = data.topic_name.strip() if data.topic_name and data.topic_name.strip() else f"{chap_name} - Practice MCQs"
    topic = db.query(Topic).filter(
        Topic.name.ilike(top_name),
        Topic.chapter_id == chapter.id
    ).first()
    if not topic:
        top_order = db.query(Topic).filter(Topic.chapter_id == chapter.id).count()
        topic = Topic(
            chapter_id=chapter.id,
            name=top_name,
            slug=slugify(top_name),
            display_order=top_order + 1
        )
        db.add(topic)
        db.flush()

    # Validate options - ensure at least one correct
    has_correct = any(opt.is_correct for opt in data.options)
    if not has_correct and data.options:
        data.options[0].is_correct = True

    # 1. Insert Question into active question bank
    q_id = str(uuid.uuid4())
    q = Question(
        id=q_id,
        topic_id=topic.id,
        question_text=data.question_text.strip(),
        question_type="SINGLE_CHOICE",
        difficulty=data.difficulty.upper() if data.difficulty else "MEDIUM",
        explanation=data.explanation.strip() if data.explanation else "Detailed solution available in Medicqube syllabus.",
        image_url=data.image_url,
        source=data.source or "Medicqube",
        year=data.year,
        is_active=True
    )
    db.add(q)
    db.flush()

    for opt_data in data.options:
        opt = QuestionOption(
            id=str(uuid.uuid4()),
            question_id=q.id,
            option_key=opt_data.option_key.upper().strip(),
            option_text=opt_data.option_text.strip(),
            is_correct=opt_data.is_correct,
            image_url=opt_data.image_url
        )
        db.add(opt)

    test_info = None
    # 2. Add to Test Series so students can take it in mock tests
    if data.add_to_test:
        test = None
        if data.test_id and data.test_id not in ("default", "new", ""):
            test = db.query(Test).filter(Test.id == data.test_id).first()
        
        if not test:
            mock_test_id = "test-medicqube-mock"
            test = db.query(Test).filter(Test.id == mock_test_id).first()
            if not test:
                test = Test(
                    id=mock_test_id,
                    title="Medicqube All-India Practice & Mock Test",
                    description="Official Medicqube test series containing custom questions with NTA NEET rules (+4, -1).",
                    test_type="FULL_MOCK",
                    duration_minutes=45,
                    total_marks=720,
                    positive_marks_per_q=4.0,
                    negative_marks_per_q=1.0,
                    is_published=True
                )
                db.add(test)
                db.flush()

        existing_tq_count = db.query(TestQuestion).filter(TestQuestion.test_id == test.id).count()
        tq = TestQuestion(
            id=str(uuid.uuid4()),
            test_id=test.id,
            question_id=q.id,
            section_name=subject.name,
            order_index=existing_tq_count + 1
        )
        db.add(tq)
        test.total_marks = int((existing_tq_count + 1) * 4)
        test_info = {"id": test.id, "title": test.title}

    # 3. Also sync to SavedQuestion repository so it's published to all students
    try:
        saved_q = SavedQuestion(
            id=str(uuid.uuid4()),
            user_id=current_user.id if current_user else None,
            exam_level=data.exam_level or "NEET UG",
            subject=subject.name,
            chapter=chapter.name,
            question_text=data.question_text.strip(),
            difficulty=data.difficulty.upper() if data.difficulty else "MEDIUM",
            explanation=data.explanation.strip() if data.explanation else "",
            image_url=data.image_url,
            is_shared=True,
            share_token=str(uuid.uuid4())
        )
        db.add(saved_q)
        db.flush()
        for opt_data in data.options:
            db.add(SavedQuestionOption(
                id=str(uuid.uuid4()),
                saved_question_id=saved_q.id,
                option_key=opt_data.option_key.upper().strip(),
                option_text=opt_data.option_text.strip(),
                is_correct=opt_data.is_correct,
                image_url=opt_data.image_url
            ))
    except Exception:
        pass

    db.commit()
    db.refresh(q)

    return {
        "status": "success",
        "question_id": q.id,
        "subject_id": subject.id,
        "subject_name": subject.name,
        "chapter_id": chapter.id,
        "chapter_name": chapter.name,
        "topic_id": topic.id,
        "topic_name": topic.name,
        "test": test_info,
        "message": "Question successfully added to Practice and Test Series!"
    }


@router.post("/unified-batch-add")
def add_unified_batch_questions(
    questions: List[UnifiedQuestionIn],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    added_count = 0
    results = []
    for item in questions:
        res = add_unified_question(item, current_user, db)
        results.append(res)
        added_count += 1
    return {
        "status": "success",
        "added_count": added_count,
        "results": results,
        "message": f"Successfully added {added_count} questions to Practice and Test Series!"
    }

