from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ai.agent import InterviewAgent

router = APIRouter()

# ✅ Store sessions (in-memory for now)
sessions = {}


# 📦 Request Schemas
class StartInterview(BaseModel):
    resume_text: str
    session_id: str  # 🔥 NEW


class AnswerRequest(BaseModel):
    answer: str
    session_id: str  # 🔥 NEW


# 🚀 START INTERVIEW
@router.post("/start")
def start_interview(data: StartInterview):
    # Create new agent per session
    agent = InterviewAgent(data.resume_text)

    sessions[data.session_id] = agent

    question = agent.generate_question()

    return {
        "question": question,
        "session_id": data.session_id
    }


# 💬 ANSWER QUESTION
@router.post("/answer")
def answer_question(data: AnswerRequest):

    agent = sessions.get(data.session_id)

    if not agent:
        raise HTTPException(status_code=400, detail="Session not found")

    response = agent.process_answer(data.answer)

    return response