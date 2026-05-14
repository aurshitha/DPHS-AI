# You can replace this with OpenAI later

def build_prompt(context):
    return f"""
You are a medical report analysis assistant.

Analyze the report carefully.

RULES:
- No hallucination
- No diagnosis
- Extract only facts

CONTENT:
{context}

OUTPUT:

🧾 Summary:
🧠 Findings:
📊 Values:
⚠️ Abnormalities:
🧩 Interpretation:
"""


def call_llm(prompt):
    # 🔴 TEMP fallback (no API yet)
    return f"""
⚠️ LLM NOT CONNECTED

Prompt Preview:
{prompt[:1000]}
"""