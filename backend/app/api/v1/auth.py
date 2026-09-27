from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.core.security import verify_password, hash_password, create_access_token
from backend.app.models.user import User
from backend.app.schemas.auth import UserSignup, UserLogin, Token, UserOut, UserUpdate
from backend.app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup", response_model=Token)
def signup(data: UserSignup, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email.lower()).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists")

    new_user = User(
        email=data.email.lower(),
        hashed_password=hash_password(data.password),
        full_name=data.full_name,
        target_year=data.target_year,
        student_grade=data.student_grade,
        role="STUDENT"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token(subject=new_user.id)
    return Token(access_token=token, token_type="bearer", user=UserOut.model_validate(new_user))

@router.post("/login", response_model=Token)
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email.lower()).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(subject=user.id)
    return Token(access_token=token, token_type="bearer", user=UserOut.model_validate(user))

@router.get("/me", response_model=UserOut)
def get_profile(current_user: User = Depends(get_current_user)):
    return UserOut.model_validate(current_user)

@router.put("/me", response_model=UserOut)
def update_profile(data: UserUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if data.full_name is not None:
        current_user.full_name = data.full_name
    if data.target_year is not None:
        current_user.target_year = data.target_year
    if data.student_grade is not None:
        current_user.student_grade = data.student_grade
    db.commit()
    db.refresh(current_user)
    return UserOut.model_validate(current_user)
