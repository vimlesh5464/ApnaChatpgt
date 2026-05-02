from pydantic import BaseModel

class SettingsRequest(BaseModel):
    name: str
    email: str
    theme: str
    notifications: bool