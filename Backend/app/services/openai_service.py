from openai import OpenAI
from app.core.config import OPENAI_API_KEY

# ✅ correct initialization
client = OpenAI(api_key=OPENAI_API_KEY)


async def get_openai_response(message: str):
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "user", "content": message}
        ]
    )

    return response.choices[0].message.content


