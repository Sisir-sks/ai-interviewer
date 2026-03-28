import google.generativeai as genai
from app.core.config import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-1.5-flash")


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

        response = model.generate_content(prompt)

        # ✅ SAFE EXTRACTION
        if response:
            text = ""

            # Some Gemini responses store text differently
            if hasattr(response, "text") and response.text:
                text = response.text.strip()
            elif hasattr(response, "candidates"):
                text = str(response.candidates)

            # Extract number
            import re
            match = re.search(r"\d+", text)

            if match:
                score = int(match.group())
                return max(1, min(score, 10))

        return 5  # fallback safe score

    except Exception as e:
        print("Evaluation Error:", str(e))
        return 5