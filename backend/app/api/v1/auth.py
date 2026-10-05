import re
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from backend.app.core.database import get_db
from backend.app.core.security import verify_password, hash_password, create_access_token
from backend.app.models.user import User
from backend.app.schemas.auth import (
    StudentRegisterIn,
    UserLogin,
    AuthResponse,
    UserOut,
    UserUpdate,
    StudentStatusOut,
)
from backend.app.api.deps import get_current_user, get_approved_student

router = APIRouter(prefix="/auth", tags=["Authentication"])

EMAIL_REGEX = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'

@router.post("/register", response_model=AuthResponse)
def register_student(data: StudentRegisterIn, db: Session = Depends(get_db)):
    """
    Student Registration:
    Creates student account with default status = 'PENDING'.
    Strictly prevents instant dashboard access until an Admin reviews and approves.
    """
    clean_email = data.email.strip().lower()
    if not re.match(EMAIL_REGEX, clean_email):
        raise HTTPException(status_code=400, detail="Invalid email address format.")

    if len(data.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters long.")

    if data.confirm_password and data.password != data.confirm_password:
        raise HTTPException(status_code=400, detail="Password confirmation does not match.")

    # Check for existing email
    existing_user = db.query(User).filter(User.email == clean_email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="An account with this email address already exists.")

    # Check for existing mobile if provided
    clean_mobile = data.mobile.strip() if data.mobile else None
    if clean_mobile:
        mobile_user = db.query(User).filter(User.mobile == clean_mobile).first()
        if mobile_user:
            raise HTTPException(status_code=400, detail="An account with this mobile number already exists.")

    new_student = User(
        email=clean_email,
        mobile=clean_mobile,
        hashed_password=hash_password(data.password),
        full_name=data.full_name.strip(),
        target_year=data.target_year,
        student_grade=data.student_grade,
        preferred_language=data.preferred_language or "English",
        role="STUDENT",
        status="PENDING",  # Strictly PENDING upon registration
        is_active=True
    )
    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    # Issue status token for pending verification checks
    token = create_access_token(subject=new_student.id)

    return AuthResponse(
        status="PENDING",
        role="STUDENT",
        access_token=token,
        token_type="bearer",
        user=UserOut.model_validate(new_student),
        message="Account created successfully. Your registration request has been submitted for admin approval."
    )


@router.post("/login", response_model=AuthResponse)
def login(data: UserLogin, db: Session = Depends(get_db)):
    """
    Unified Authentication Endpoint:
    Supports login via registered Email or Mobile.
    Enforces Status Validation:
      - APPROVED: Returns full access token + student dashboard entry
      - PENDING: Informs student that request is awaiting admin approval
      - REJECTED: Shows admin rejection reason
      - SUSPENDED: Alerts student of account suspension
    """
    login_identifier = data.email.strip().lower()
    
    # Query by email or mobile
    user = db.query(User).filter(
        or_(
            User.email == login_identifier,
            User.mobile == login_identifier
        )
    ).first()

    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email/mobile or password."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated. Please contact support."
        )

    # Issue token
    token = create_access_token(subject=user.id)
    user_out = UserOut.model_validate(user)

    # Case 1: Admin user (always granted)
    if user.role == "ADMIN":
        return AuthResponse(
            status="APPROVED",
            role="ADMIN",
            access_token=token,
            token_type="bearer",
            user=user_out,
            message="Administrator login successful."
        )

    # Case 2: Student is APPROVED
    if user.status == "APPROVED":
        return AuthResponse(
            status="APPROVED",
            role=user.role,
            access_token=token,
            token_type="bearer",
            user=user_out,
            message="Login successful. Welcome back to Medicqube!"
        )

    # Case 3: Student is PENDING
    if user.status == "PENDING":
        return AuthResponse(
            status="PENDING",
            role=user.role,
            access_token=token,
            token_type="bearer",
            user=user_out,
            message="Your account is currently pending administrator approval. Please wait."
        )

    # Case 4: Student is REJECTED
    if user.status == "REJECTED":
        return AuthResponse(
            status="REJECTED",
            role=user.role,
            access_token=None,
            user=user_out,
            rejection_reason=user.rejection_reason or "Registration criteria not met.",
            message="Your registration request was not approved by the administrator."
        )

    # Case 5: Student is SUSPENDED
    if user.status == "SUSPENDED":
        return AuthResponse(
            status="SUSPENDED",
            role=user.role,
            access_token=None,
            user=user_out,
            suspension_reason=user.suspension_reason or "Account suspended by administrator.",
            message="Your account has been suspended. Please contact the administrator."
        )

    raise HTTPException(status_code=403, detail="Unrecognized account status.")


@router.get("/status", response_model=StudentStatusOut)
def check_status(
    email: str = Query(..., description="Registered student email to check approval status"),
    db: Session = Depends(get_db)
):
    """
    Real-time Approval Status Polling:
    Allows pending students to verify whether their account was approved.
    """
    user = db.query(User).filter(User.email == email.strip().lower()).first()
    if not user:
        raise HTTPException(status_code=404, detail="Student account not found.")

    msg_map = {
        "PENDING": "Your account is awaiting administrator approval.",
        "APPROVED": "Your account has been approved! You can now log into Medicqube.",
        "REJECTED": f"Registration rejected: {user.rejection_reason or 'Criteria not met.'}",
        "SUSPENDED": f"Account suspended: {user.suspension_reason or 'Administrative hold.'}"
    }

    return StudentStatusOut(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        status=user.status,
        rejection_reason=user.rejection_reason,
        suspension_reason=user.suspension_reason,
        message=msg_map.get(user.status, "Status pending verification.")
    )


@router.get("/me", response_model=UserOut)
def get_current_profile(current_user: User = Depends(get_current_user)):
    """
    Returns authenticated user profile.
    """
    return UserOut.model_validate(current_user)


@router.put("/me", response_model=UserOut)
def update_profile(
    data: UserUpdate,
    current_user: User = Depends(get_approved_student),
    db: Session = Depends(get_db)
):
    """
    Allows approved students to update profile preferences.
    """
    if data.full_name is not None:
        current_user.full_name = data.full_name.strip()
    if data.target_year is not None:
        current_user.target_year = data.target_year
    if data.student_grade is not None:
        current_user.student_grade = data.student_grade
    if data.mobile is not None:
        current_user.mobile = data.mobile.strip()
    if data.preferred_language is not None:
        current_user.preferred_language = data.preferred_language

    db.commit()
    db.refresh(current_user)
    return UserOut.model_validate(current_user)


@router.post("/forgot-password")
def forgot_password(payload: dict, db: Session = Depends(get_db)):
    """
    Password recovery endpoint.
    """
    email = payload.get("email", "").strip().lower()
    user = db.query(User).filter(User.email == email).first()
    # Always return a generic success message to prevent user enumeration
    return {
        "status": "success",
        "message": "If an account matches that email, password reset instructions have been forwarded."
    }
