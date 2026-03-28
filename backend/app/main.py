from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

# ✅ Create app
app = FastAPI(title="AI Interviewer API", version="0.1.0")

# ✅ CORS - Fixed (allow_credentials=True is incompatible with allow_origins=["*"])
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://ai-interviewer-oz7s4ykns-sisirkumar413-5323s-projects.vercel.app",
        "http://localhost:3000",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Import router
from app.api.routes.interview import router as interview_router

# ✅ DB setup
from app.db.database import Base, engine
from app.models.user import User  # optional

# ✅ Startup event
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

# 🔥 Railway-compatible run
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)