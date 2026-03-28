from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ai.agent import InterviewAgent

router = APIRouter()

# ✅ Store sessions (in-memory)
sessions = {}


# 📦 Request Schemas
class StartInterview(BaseModel):
    resume_text: str
    session_id: str


class AnswerRequest(BaseModel):
    answer: str
    session_id: str


# 🚀 START INTERVIEW
@router.post("/start")
def start_interview(data: StartInterview):

    print("📥 START REQUEST:", data)

    # ✅ Validation
    if not data.resume_text:
        raise HTTPException(status_code=400, detail="Resume required")

    if not data.session_id:
        raise HTTPException(status_code=400, detail="Session ID required")

    # ✅ Create agent
    agent = InterviewAgent(data.resume_text)

    # ✅ Store session
    sessions[data.session_id] = agent

    # ✅ Generate question
    try:
        question = agent.generate_question()
    except Exception as e:
        print("❌ ERROR generating question:", str(e))
        raise HTTPException(status_code=500, detail="Failed to generate question")

    print("✅ QUESTION:", question)

    return {
        "question": question,
        "session_id": data.session_id
    }


# 💬 ANSWER QUESTION
@router.post("/answer")
def answer_question(data: AnswerRequest):

    print("📥 ANSWER REQUEST:", data)

    if not data.session_id:
        raise HTTPException(status_code=400, detail="Session ID required")

    if not data.answer:
        raise HTTPException(status_code=400, detail="Answer required")

    # ✅ Get session
    agent = sessions.get(data.session_id)

    if not agent:
        raise HTTPException(status_code=400, detail="Session not found")

    # ✅ Process answer
    try:
        response = agent.process_answer(data.answer)
    except Exception as e:
        print("❌ ERROR processing answer:", str(e))
        raise HTTPException(status_code=500, detail="Failed to process answer")

    print("✅ RESPONSE:", response)

    return response