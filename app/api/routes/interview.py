from fastapi import APIRouter
from pydantic import BaseModel
from app.services.ai.agent import InterviewAgent

router = APIRouter()

# Temporary in-memory session
agent_instance = None


class StartInterview(BaseModel):
    resume_text: str


class AnswerRequest(BaseModel):
    answer: str


@router.post("/start")
def start_interview(data: StartInterview):
    global agent_instance
    agent_instance = InterviewAgent(data.resume_text)

    question = agent_instance.generate_question()

    return {"question": question}


@router.post("/answer")
def answer_question(data: AnswerRequest):
    global agent_instance

    response = agent_instance.process_answer(data.answer)

    return response