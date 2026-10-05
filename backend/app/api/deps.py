from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.core.security import decode_access_token
from backend.app.models.user import User

security = HTTPBearer(auto_error=False)

def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """
    Validates JWT token and extracts authenticated user.
    Strictly requires authentication credentials.
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials not provided",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session token. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Malformed token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User account not found or deactivated",
        )

    return user


def get_approved_student(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Strict Access Control: Enforces REGISTERED != APPROVED rule.
    Only users with status == 'APPROVED' can access protected learning platform APIs.
    """
    if current_user.role == "ADMIN":
        return current_user

    if current_user.status == "APPROVED":
        return current_user
    elif current_user.status == "PENDING":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="ACCOUNT_PENDING: Your registration request is pending administrator approval."
        )
    elif current_user.status == "REJECTED":
        reason = current_user.rejection_reason or "Registration criteria not met."
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"ACCOUNT_REJECTED: Registration not approved. Reason: {reason}"
        )
    elif current_user.status == "SUSPENDED":
        reason = current_user.suspension_reason or "Account suspended by administrator."
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"ACCOUNT_SUSPENDED: {reason}"
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: Account status not approved."
        )


def get_current_admin(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Strict Admin Authorization: Only users with role == 'ADMIN' can access Admin endpoints.
    Students attempting to call admin APIs receive 403 Forbidden.
    """
    if current_user.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Administrative privileges required."
        )
    return current_user
