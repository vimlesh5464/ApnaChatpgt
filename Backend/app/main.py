from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.chat import router as chat_router
from app.db.base import Base
from app.db.session import engine

app = FastAPI()

# CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
Base.metadata.create_all(bind=engine)

# Routes
app.include_router(chat_router, prefix="/api")

@app.get("/")
def home():
    return {"message": "SigmaGPT FastAPI backend running 🚀"}