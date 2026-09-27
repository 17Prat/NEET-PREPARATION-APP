from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.user import User
from backend.app.schemas.analytics import DashboardStatsOut
from backend.app.services.analytics_service import get_student_dashboard_analytics
from backend.app.api.deps import get_current_user

router = APIRouter(prefix="/analytics", tags=["Performance Analytics"])

@router.get("/dashboard", response_model=DashboardStatsOut)
def get_dashboard_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_student_dashboard_analytics(db, current_user.id)
