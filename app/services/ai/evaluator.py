def evaluate_answer(answer: str):
    # Temporary simple scoring (upgrade later with LLM)
    length = len(answer.split())

    if length > 50:
        return 8
    elif length > 20:
        return 6
    else:
        return 3