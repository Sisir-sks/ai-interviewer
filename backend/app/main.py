# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AI Interviewer API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import routers
from app.api.routes.auth import router as auth_router
from app.api.routes.interview import router as interview_router

from app.db.database import Base, engine
from app.models.user import User   # Make sure your User model is imported

def create_tables():
    print("📦 Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created!")

create_tables()

# Include routers
app.include_router(auth_router, prefix="/auth")
app.include_router(interview_router, prefix="/interview")

@app.get("/")
def root():
    return {"message": "AI Interviewer Backend Running 🚀"}