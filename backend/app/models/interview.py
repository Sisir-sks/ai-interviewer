@router.post("/start")
def start_interview(data: StartInterview):
    global agent_instance

    if not data.resume_text:
        return {"error": "Resume required"}

    agent_instance = InterviewAgent(data.resume_text)

    question = agent_instance.generate_question()

    return {"question": question}