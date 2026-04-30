from pydantic import BaseModel


class ChatRequest(BaseModel):
    threadId: str
    message: str