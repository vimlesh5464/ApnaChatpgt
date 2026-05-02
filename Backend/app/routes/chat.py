from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import datetime

from app.schemas.chat import ChatRequest
from app.services.openai_service import get_openai_response

from app.models.thread import Thread
from app.models.message import Message
from app.db.session import get_db

router = APIRouter()

# ---------------- GET THREADS ----------------
@router.get("/thread")
def get_threads(db: Session = Depends(get_db)):
    threads = db.query(Thread).order_by(Thread.updated_at.desc()).all()

    return [
        {
            "thread_id": t.thread_id,
            "title": t.title,
            "updated_at": t.updated_at
        }
        for t in threads
    ]


# ---------------- GET MESSAGES ----------------
@router.get("/thread/{thread_id}")
def get_thread(thread_id: str, db: Session = Depends(get_db)):
    thread = db.query(Thread).filter(Thread.thread_id == thread_id).first()

    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")

    return thread.messages


# ---------------- DELETE THREAD ----------------
@router.delete("/thread/{thread_id}")
def delete_thread(thread_id: str, db: Session = Depends(get_db)):
    thread = db.query(Thread).filter(Thread.thread_id == thread_id).first()

    if not thread:
        raise HTTPException(status_code=404, detail="Thread not found")

    db.delete(thread)
    db.commit()

    return {"success": True}


# ---------------- CHAT ----------------
@router.post("/chat")
async def chat(req: ChatRequest, db: Session = Depends(get_db)):

    if not req.message or not req.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    # ---------------- THREAD CREATE / GET ----------------
    thread = db.query(Thread).filter(Thread.thread_id == req.threadId).first()

    if not thread:
        thread = Thread(
            thread_id=req.threadId,
            title=req.message
        )
        db.add(thread)
        db.commit()
        db.refresh(thread)

    # ---------------- USER MESSAGE ----------------
    user_msg = Message(
        role="user",
        content=req.message,
        thread_id=thread.id
    )
    db.add(user_msg)

    # ---------------- AI RESPONSE (🔥 FIXED HERE) ----------------
    try:
        reply = await get_openai_response(req.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # ensure string safety
    reply = str(reply)

    # ---------------- ASSISTANT MESSAGE ----------------
    assistant_msg = Message(
        role="assistant",
        content=reply,
        thread_id=thread.id
    )
    db.add(assistant_msg)

    # ---------------- UPDATE THREAD TIME ----------------
    thread.updated_at = datetime.utcnow()

    db.commit()

    return {"reply": reply}