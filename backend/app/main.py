from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Create app
app = FastAPI(title="AI Interviewer API")

# CORS (keep it early)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ Change this in production!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import routers AFTER app is created
from app.api.routes.auth import router as auth_router
from app.api.routes.interview import router as interview_router

from app.db.database import Base, engine
from app.models import user  # Make sure all models are imported so they register with Base

# Create tables (only in dev; use migrations in production)
def create_tables():
    print("📦 Creating database tables if not exist...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables ready!")

create_tables()

# Include routers (ONLY ONCE)
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(interview_router, prefix="/interview", tags=["Interview"])

@app.get("/")
def root():
    return {"message": "AI Interviewer Backend Running 🚀"}

print("🚀 AI Interviewer Backend Started Successfully")