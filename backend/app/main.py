from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os

app = FastAPI(title="AI Interviewer API", version="0.1.0")

# ✅ Allow ALL vercel previews + production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # temporary fix
    allow_credentials=False,  # must be False when using "*"
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Handle OPTIONS preflight manually
@app.options("/{full_path:path}")
async def preflight_handler(full_path: str, request: Request):
    return JSONResponse(
        content={},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "*",
        }
    )

# ✅ Import router
from app.api.routes.interview import router as interview_router
from app.db.database import Base, engine
from app.models.user import User

@app.on_event("startup")
def startup():
    print("📦 Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created!")

app.include_router(interview_router, prefix="/interview")

@app.get("/")
def root():
    return {"message": "AI Interviewer Backend Running 🚀"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)