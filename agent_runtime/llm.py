# agent_runtime/llm.py
from __future__ import annotations
import os
import json
from datetime import datetime

def _mock_response(system_prompt: str, user_prompt: str) -> str:
    # 极简 mock：从文本里随便抽几个关键词，保证输出是可用 JSON
    text = (user_prompt or "")[:500]
    mood = "neutral"
    if any(k in text for k in ["累", "疲惫", "烦", "焦虑", "崩"]):
        mood = "tired/anxious"
    elif any(k in text for k in ["开心", "顺利", "轻松", "爽", "满意"]):
        mood = "positive"

    out = {
        "mood": mood,
        "patterns": ["mock_mode: no api key, using heuristic output"],
        "one_experiment": "Write 3 bullet points tonight: win / friction / next step."
    }
    return json.dumps(out, ensure_ascii=False, indent=2)

def call_llm(system_prompt: str, user_prompt: str, temperature: float = 0.3) -> str:
    api_key = os.getenv("OPENAI_API_KEY", "").strip()
    if not api_key:
        return _mock_response(system_prompt, user_prompt)

    # 有 key 时再走真实 LLM（先留接口，等你拿到 key 再启用）
    from openai import OpenAI
    client = OpenAI(api_key=api_key)
    resp = client.responses.create(
        model="gpt-4.1-mini",
        input=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=temperature,
    )
    return resp.output_text
