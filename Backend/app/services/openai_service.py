from openai import OpenAI
from app.core.config import OPENAI_API_KEY
import tempfile
import os

client = OpenAI(api_key=OPENAI_API_KEY)


# ---------------- CHAT ----------------
def process_message(prompt: str, messages=None):
    try:
        # 🔥 if history exists
        if messages:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                temperature=0.7
            )
        else:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7
            )

        return response.choices[0].message.content

    except Exception as e:
        print("OpenAI Chat Error:", e)
        return "⚠️ AI response failed"


# ---------------- VOICE → TEXT ----------------
def transcribe_audio(file):
    tmp_path = None

    try:
        # 🔥 save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
            tmp.write(file.file.read())
            tmp_path = tmp.name

        # 🔥 send to OpenAI
        with open(tmp_path, "rb") as audio:
            transcript = client.audio.transcriptions.create(
                model="gpt-4o-mini-transcribe",
                file=audio
            )

        return transcript.text

    except Exception as e:
        print("Transcription Error:", e)
        return "⚠️ Voice transcription failed"

    finally:
        # 🔥 cleanup temp file (VERY IMPORTANT)
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)