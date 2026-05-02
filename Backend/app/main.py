from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.chat import router as chat_router
from app.routes.auth import router as auth_router
from app.routes.settings import router as settings_router

from app.db.base import Base
from app.db.session import engine

app = FastAPI(
    title="SigmaGPT API",
    version="1.0.0"
)

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- DB INIT ----------------
Base.metadata.create_all(bind=engine)

# ---------------- ROUTES ----------------
app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])
app.include_router(chat_router, prefix="/api", tags=["Chat"])
app.include_router(settings_router, prefix="/api", tags=["Settings"])

# ---------------- HEALTH ----------------
@app.get("/")
def home():
    return {
        "status": "ok",
        "message": "SigmaGPT backend running 🚀"
    }