import os
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ✅ Create app
app = FastAPI(title="AI Interviewer API", version="0.1.0")

# 🔥 FIXED CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       # allow all
    allow_credentials=False,   # 🔥 MUST BE FALSE
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Import AFTER app creation
from app.api.routes.interview import router as interview_router
from app.db.database import Base, engine
from app.models.user import User

# ✅ Startup
@app.on_event("startup")
def startup():
    print("📦 Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created!")

# ✅ Routes
app.include_router(interview_router, prefix="/interview")

# ✅ Root
@app.get("/")
def root():
    return {"message": "AI Interviewer Backend Running 🚀"}