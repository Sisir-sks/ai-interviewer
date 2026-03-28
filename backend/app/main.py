from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ✅ Create app
app = FastAPI(title="AI Interviewer API", version="0.1.0")

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Import ONLY interview router
from app.api.routes.interview import router as interview_router

# ✅ DB setup
from app.db.database import Base, engine
from app.models.user import User  # optional (safe to keep)

def create_tables():
    print("📦 Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created!")

create_tables()

# ✅ Include ONLY interview routes
app.include_router(interview_router, prefix="/interview")

# ✅ Root
@app.get("/")
def root():
    return {"message": "AI Interviewer Backend Running 🚀"}