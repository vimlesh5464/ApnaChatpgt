from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user_settings import UserSettings
from app.core.security import get_current_user
from app.models.user import User

router = APIRouter(prefix="/settings", tags=["Settings"])


# ---------------- GET SETTINGS ----------------
@router.get("")
def get_settings(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    settings = db.query(UserSettings).filter(
        UserSettings.user_id == user.id
    ).first()

    if not settings:
        settings = UserSettings(
            user_id=user.id,
            name=user.name,
            email=user.email,
            theme="dark",
            notifications=True
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)

    return settings


# ---------------- UPDATE SETTINGS ----------------
@router.put("")
def update_settings(
    data: dict,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    settings = db.query(UserSettings).filter(
        UserSettings.user_id == user.id
    ).first()

    if not settings:
        settings = UserSettings(user_id=user.id)
        db.add(settings)

    settings.name = data.get("name")
    settings.email = data.get("email")
    settings.theme = data.get("theme")
    settings.notifications = data.get("notifications")

    db.commit()

    return {"message": "Settings updated"}