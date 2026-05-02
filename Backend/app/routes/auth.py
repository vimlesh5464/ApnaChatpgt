from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas.auth import UserCreate, UserLogin, Token
from app.db.session import get_db
from app.services.auth_service import create_user, authenticate_user
from app.core.security import create_access_token
from app.models.user import User

# ✅ FIXED HERE
router = APIRouter(tags=["Auth"])


# ---------------- REGISTER ----------------
@router.post("/register", response_model=Token)
def register(user: UserCreate, db: Session = Depends(get_db)):

    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = create_user(db, user.name, user.email, user.password)

    token = create_access_token({"sub": new_user.email})

    return {
        "access_token": token,
        "token_type": "bearer"
    }


# ---------------- LOGIN ----------------
@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):

    db_user = authenticate_user(db, user.email, user.password)

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": db_user.email})

    return {
        "access_token": token,
        "token_type": "bearer"
    }