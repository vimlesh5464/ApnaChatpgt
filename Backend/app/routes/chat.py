from fastapi import APIRouter, HTTPException
from datetime import datetime

from app.schemas.chat import ChatRequest
from app.services.openai_service import get_openai_response
from app.models.thread import Thread
from app.models.message import Message
from app.db.session import SessionLocal

router = APIRouter()


# ---------------- GET ALL THREADS ----------------
@router.get("/thread")
def get_threads():
    db = SessionLocal()
    threads = db.query(Thread).order_by(Thread.updated_at.desc()).all()
    return threads


# ---------------- GET SINGLE THREAD ----------------
@router.get("/thread/{thread_id}")
def get_thread(thread_id: str):
    db = SessionLocal()

    thread = db.query(Thread).filter(Thread.thread_id == thread_id).first()

    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")

    return thread.messages


# ---------------- DELETE THREAD ----------------
@router.delete("/thread/{thread_id}")
def delete_thread(thread_id: str):
    db = SessionLocal()

    thread = db.query(Thread).filter(Thread.thread_id == thread_id).first()

    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")

    db.delete(thread)
    db.commit()

    return {"success": True}


# ---------------- CHAT API ----------------
@router.post("/chat")
async def chat(req: ChatRequest):
    db = SessionLocal()

    thread = db.query(Thread).filter(Thread.thread_id == req.threadId).first()

    # create thread if not exists
    if not thread:
        thread = Thread(
            thread_id=req.threadId,
            title=req.message
        )
        db.add(thread)
        db.commit()
        db.refresh(thread)

    # user message
    user_msg = Message(
        role="user",
        content=req.message,
        thread_id=thread.id
    )

    db.add(user_msg)

    # AI response
    reply = await get_openai_response(req.message)

    assistant_msg = Message(
        role="assistant",
        content=reply,
        thread_id=thread.id
    )

    db.add(assistant_msg)

    thread.updated_at = datetime.utcnow()

    db.commit()

    return {"reply": reply}