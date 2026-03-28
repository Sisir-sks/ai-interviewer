@router.post("/start")
def start_interview(data: StartInterview):
    
    # ✅ Validate input
    if not data.resume_text:
        return {"error": "Resume required"}

    if not data.session_id:
        return {"error": "Session ID required"}

    # ✅ Create new agent for this session
    agent = InterviewAgent(data.resume_text)

    # ✅ Store session
    sessions[data.session_id] = agent

    # ✅ Generate first question
    question = agent.generate_question()

    return {
        "question": question,
        "session_id": data.session_id
    }