from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

# ✅ Create app
app = FastAPI(title="AI Interviewer API", version="0.1.0")

# ✅ CORS (you can restrict later)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Import router
from app.api.routes.interview import router as interview_router

# ✅ DB setup
from app.db.database import Base, engine
from app.models.user import User  # optional

# ✅ Startup event (better than calling directly)
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


# 🔥 IMPORTANT: Railway-compatible run
if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 8000))  # 🔥 dynamic port
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)