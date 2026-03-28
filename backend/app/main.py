from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ✅ Create app
app = FastAPI(title="AI Interviewer API")

# ✅ CORS (must be early)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ DIRECT imports (IMPORTANT FIX)
from app.api.routes.auth import router as auth_router
from app.api.routes.interview import router as interview_router

from app.db.database import Base, engine
from app.models import user  # ensure models are registered

# ✅ Create tables
def create_tables():
    print("📦 Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created!")

create_tables()

# ✅ Include routers (ONLY ONCE)
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(interview_router, prefix="/interview", tags=["Interview"])

# ✅ Root
@app.get("/")
def root():
    return {"message": "AI Interviewer Backend Running 🚀"}


print("🚀 VERSION FINAL DEPLOYED")