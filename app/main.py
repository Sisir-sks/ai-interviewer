from fastapi import FastAPI
from app.api.routes import auth

app = FastAPI(title="AI Interviewer API")
from app.api.routes import interview

app.include_router(interview.router, prefix="/interview", tags=["Interview"])
# Include routes
app.include_router(auth.router, prefix="/auth", tags=["Auth"])


@app.get("/")
def root():
    return {"message": "AI Interviewer Backend Running 🚀"}