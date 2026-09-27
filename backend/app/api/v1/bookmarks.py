import uuid
from typing import List
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.bookmark import Bookmark
from backend.app.models.question import Question
from backend.app.models.user import User
from backend.app.schemas.analytics import BookmarkOut
from backend.app.api.deps import get_current_user

router = APIRouter(prefix="/bookmarks", tags=["Bookmarks"])

@router.get("", response_model=List[BookmarkOut])
def list_bookmarks(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    bookmarks = db.query(Bookmark).filter(Bookmark.user_id == current_user.id).order_by(Bookmark.created_at.desc()).all()
    results = []
    for b in bookmarks:
        q = b.question
        if not q:
            continue
        results.append(BookmarkOut(
            id=b.id,
            question_id=b.question_id,
            created_at=b.created_at,
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
                "is_bookmarked": True,
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

@router.post("/{question_id}")
def toggle_bookmark(
    question_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    existing = db.query(Bookmark).filter(
        Bookmark.user_id == current_user.id,
        Bookmark.question_id == question_id
    ).first()

    if existing:
        db.delete(existing)
        db.commit()
        return {"status": "removed", "question_id": question_id}
    else:
        new_bm = Bookmark(
            id=str(uuid.uuid4()),
            user_id=current_user.id,
            question_id=question_id,
            created_at=datetime.now(timezone.utc)
        )
        db.add(new_bm)
        db.commit()
        return {"status": "saved", "question_id": question_id}
