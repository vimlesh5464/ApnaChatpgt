from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from app.db.base import Base

class UserSettings(Base):
    __tablename__ = "user_settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    name = Column(String)
    email = Column(String)
    theme = Column(String, default="dark")
    notifications = Column(Boolean, default=True)