from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload
from backend.app.core.database import get_db
from backend.app.models.taxonomy import Subject, Chapter, Topic
from backend.app.models.question import Question
from backend.app.schemas.taxonomy import SubjectOut, ChapterOut, TopicOut

router = APIRouter(prefix="/taxonomy", tags=["Taxonomy"])

@router.get("/tree", response_model=List[SubjectOut])
def get_taxonomy_tree(db: Session = Depends(get_db)):
    # 1. Batch aggregate active question counts in a single query (replaces 200+ N+1 queries)
    topic_counts = dict(
        db.query(Question.topic_id, func.count(Question.id))
        .filter(Question.is_active == True)
        .group_by(Question.topic_id)
        .all()
    )

    # 2. Eagerly load subjects, chapters, and topics in a single efficient query
    subjects = (
        db.query(Subject)
        .options(
            joinedload(Subject.chapters).joinedload(Chapter.topics)
        )
        .order_by(Subject.display_order)
        .all()
    )

    results = []
    for sub in subjects:
        sub_dict = {
            "id": sub.id,
            "name": sub.name,
            "slug": sub.slug,
            "icon": sub.icon,
            "display_order": sub.display_order,
            "chapters": []
        }
        for chap in sub.chapters:
            chap_dict = {
                "id": chap.id,
                "subject_id": chap.subject_id,
                "name": chap.name,
                "slug": chap.slug,
                "display_order": chap.display_order,
                "topics": []
            }
            for top in chap.topics:
                q_count = topic_counts.get(top.id, 0)
                chap_dict["topics"].append({
                    "id": top.id,
                    "name": top.name,
                    "slug": top.slug,
                    "display_order": top.display_order,
                    "question_count": q_count
                })
            sub_dict["chapters"].append(chap_dict)
        results.append(sub_dict)
    return results
