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

# ✅ Import AFTER app creation
from app.api.routes import auth, interview
from app.db.database import Base, engine
from app.models import user  # 👈 import module, not just class

# ✅ Create tables (safe execution)
def create_tables():
    print("📦 Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created!")

create_tables()

# ✅ Routes
app.include_router(interview.router, prefix="/interview", tags=["Interview"])
app.include_router(auth.router, prefix="/auth", tags=["Auth"])

# ✅ Root
@app.get("/")
def root():
    return {"message": "AI Interviewer Backend Running 🚀"}


print("🚀 VERSION 2 DEPLOYED")