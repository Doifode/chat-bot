import os
from google import genai
from google.genai import types
from dotenv import load_dotenv
load_dotenv()

MODEL="gemini-2.5-flash"
SYSTEM_PROMPT = "You are a helpful assistant"
TEMPERATURE = 0.7

api_key = os.getenv("GEMINI_API_KEY")

_client = genai.Client(api_key=api_key)

def generate_reply(history: list[dict],system_instruction:str|None=None) -> str:
    contents = []
    for msg in history:
        # your DB uses "user"/"assistant"; Gemini uses "user"/"model"
        gemini_role = "model" if msg["role"] == "assistant" else "user"
        contents.append({
            "role": gemini_role,
            "parts": [{"text": msg["content"]}],   # text goes in parts, as a list
        })

    response = _client.models.generate_content(
        model=MODEL,
        contents=contents,                          # the converted list, not `history`
        config=types.GenerateContentConfig(
            system_instruction=system_instruction or SYSTEM_PROMPT,
            temperature=TEMPERATURE,
        ),
    )
    return response.text
