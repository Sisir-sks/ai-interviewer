class InterviewMemory:
    def __init__(self):
        self.history = []
        self.question_count = 0
        self.difficulty = "easy"

    def add_interaction(self, question, answer):
        self.history.append({
            "question": question,
            "answer": answer
        })
        self.question_count += 1

    def update_difficulty(self, score):
        if score > 7:
            self.difficulty = "hard"
        elif score > 4:
            self.difficulty = "medium"
        else:
            self.difficulty = "easy"