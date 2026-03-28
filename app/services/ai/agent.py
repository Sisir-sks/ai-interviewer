from app.services.ai.prompts import SYSTEM_PROMPT
from app.services.ai.memory import InterviewMemory
from app.services.ai.evaluator import evaluate_answer

# TEMP: replace with Gemini/OpenAI later
import google.generativeai as genai
from app.core.config import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")


def call_llm(prompt: str):
    try:
        response = model.generate_content(prompt)

        # Debug print (temporary)
        print("RAW RESPONSE:", response)

        if response and hasattr(response, "text") and response.text:
            return response.text.strip()

        return "Can you explain that in more detail?"

    except Exception as e:
        print("Gemini Error:", str(e))
        return "Can you elaborate more on your answer?"
    
    
class InterviewAgent:
    def __init__(self, resume_text: str):
        self.resume = resume_text
        self.memory = InterviewMemory()

    def generate_question(self):
        prompt = f"""
        {SYSTEM_PROMPT}

        Resume:
        {self.resume}

        Previous history:
        {self.memory.history}

        Difficulty: {self.memory.difficulty}

        Generate next interview question.
        """

        question = call_llm(prompt)
        return question

    def process_answer(self, answer: str):
        score = evaluate_answer(answer)

        # Update difficulty
        self.memory.update_difficulty(score)

        # Store interaction
        last_question = self.memory.history[-1]["question"] if self.memory.history else "N/A"
        self.memory.add_interaction(last_question, answer)

        # Generate follow-up
        followup = self.generate_followup(answer)

        return {
            "score": score,
            "next_question": followup,
            "difficulty": self.memory.difficulty
        }

    def generate_followup(self, answer: str):
        prompt = f"""
        You are an AI technical interviewer.

        Candidate Resume:{self.resume}

        Candidate Answer:{answer}

        Previous Questions:
        {self.memory.history}

        Task:
        - Ask ONE deep follow-up question
        - Focus on concepts, implementation, or edge cases
        - Keep it concise
        - Do NOT repeat previous questions

        Output ONLY the question.
        """

        return call_llm(prompt)