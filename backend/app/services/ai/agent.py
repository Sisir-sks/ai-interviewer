from app.services.ai.prompts import SYSTEM_PROMPT
from app.services.ai.memory import InterviewMemory
from app.services.ai.evaluator import evaluate_answer

import google.generativeai as genai
from app.core.config import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash")


# 🚀 SAFE LLM CALL
def call_llm(prompt: str):
    try:
        response = model.generate_content(prompt, stream=True)

        full_text = ""
        for chunk in response:
            if hasattr(chunk, "text") and chunk.text:
                full_text += chunk.text

        if len(full_text.strip()) < 5:
            return ""

        return full_text.strip()

    except Exception as e:
        print("Gemini Error:", str(e))
        return ""


# 🧠 MAIN AGENT
class InterviewAgent:
    def __init__(self, resume_text: str):
        self.resume = resume_text
        self.memory = InterviewMemory()

    # 🔒 GET CLEAN QUESTION HISTORY
    def get_previous_questions(self):
        return [item["question"] for item in self.memory.history]

    # 🚀 GENERATE FIRST QUESTION
    def generate_question(self):
        prompt = f"""
        {SYSTEM_PROMPT}

        Candidate Resume:
        {self.resume}

        Previous Questions:
        {self.get_previous_questions()}

        Difficulty: {self.memory.difficulty}

        STRICT RULES:
        - Ask exactly ONE question
        - Must be DIFFERENT from previous questions
        - Must be resume-based
        - No explanation
        - Start simple

        Output: Only question
        """

        question = call_llm(prompt)

        # 🔥 HARD FALLBACK
        if not question or question in self.get_previous_questions():
            question = "Can you explain your most recent project and your role in it?"

        self.memory.history.append({
            "question": question,
            "answer": ""
        })

        return question

    # 🧠 PROCESS ANSWER
    def process_answer(self, answer: str):
        try:
            score = evaluate_answer(answer)
        except:
            score = 5

        self.memory.update_difficulty(score)

        if self.memory.history:
            self.memory.history[-1]["answer"] = answer

        followup = self.generate_followup(answer)

        self.memory.history.append({
            "question": followup,
            "answer": ""
        })

        return {
            "score": score,
            "next_question": followup,
            "difficulty": self.memory.difficulty
        }

    # 🔁 GENERATE FOLLOW-UP
    def generate_followup(self, answer: str):
        previous_questions = self.get_previous_questions()

        prompt = f"""
        You are an expert technical interviewer.

        Candidate Resume:
        {self.resume}

        Previous Questions:
        {previous_questions}

        Candidate Answer:
        {answer}

        STRICT RULES:
        - Ask ONE NEW question
        - NEVER repeat or rephrase previous questions
        - Focus on a NEW angle:
            • architecture
            • optimization
            • scalability
            • edge cases
            • trade-offs
        - Increase difficulty slightly
        - Be specific
        - No generic wording
        - No "elaborate"

        Output: Only question
        """

        result = call_llm(prompt)

        # 🚨 LOOP BREAKER
        if not result or result in previous_questions:
            fallback_questions = [
                "How would you scale this system for millions of users?",
                "What trade-offs did you consider in your design?",
                "How would you optimize performance in this system?",
                "What edge cases did you handle and how?",
                "Can you explain the architecture of your solution?"
            ]

            for q in fallback_questions:
                if q not in previous_questions:
                    return q

            return "Can you describe a challenging bug you faced and how you solved it?"

        return result