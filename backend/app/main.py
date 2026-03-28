import os
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ✅ Create app
app = FastAPI(title="AI Interviewer API", version="0.1.0")

# ✅ CORS (FIXED)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change later to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Import AFTER app creation
from app.api.routes.interview import router as interview_router
from app.db.database import Base, engine
from app.models.user import User  # optional

# ✅ Create tables on startup
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