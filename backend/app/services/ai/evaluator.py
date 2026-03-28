from google import genai
from app.core.config import GEMINI_API_KEY
import re

client = genai.Client(api_key=GEMINI_API_KEY)

def evaluate_answer(answer: str):
    try:
        prompt = f"""
        You are an expert technical interviewer.

        Candidate Answer:
        {answer}

        Evaluate based on:
        - Technical accuracy
        - Clarity
        - Depth

        Return ONLY a number between 1 and 10.
        """

        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=prompt
        )

        if response and response.text:
            text = response.text.strip()
            # Extract number
            match = re.search(r"\d+", text)

            if match:
                score = int(match.group())
                return max(1, min(score, 10))

        return 5  # fallback safe score

    except Exception as e:
        print("Evaluation Error:", str(e))
        return 5