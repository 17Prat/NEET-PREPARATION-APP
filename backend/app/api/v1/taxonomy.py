from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.taxonomy import Subject, Chapter, Topic
from backend.app.models.question import Question
from backend.app.schemas.taxonomy import SubjectOut, ChapterOut, TopicOut

router = APIRouter(prefix="/taxonomy", tags=["Taxonomy"])

@router.get("/tree", response_model=List[SubjectOut])
def get_taxonomy_tree(db: Session = Depends(get_db)):
    subjects = db.query(Subject).order_by(Subject.display_order).all()
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
                q_count = db.query(Question).filter(Question.topic_id == top.id, Question.is_active == True).count()
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
