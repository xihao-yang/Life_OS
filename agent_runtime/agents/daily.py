# agent_runtime/agents/daily.py
from __future__ import annotations
import json
from pathlib import Path
from typing import Any, Dict

from agent_runtime.llm import call_llm
from agent_runtime.memory import append_daily

DATA_DIR = Path("Data")
LOG_DIR = DATA_DIR / "Logs"

SYSTEM_PROMPT = """
You are a Daily Reflection Agent embedded in a personal Life OS.

Your role is NOT to judge or motivate.
Your role is to extract:
- mood (short)
- patterns (1-3)
- one_experiment (only ONE small, testable adjustment for tomorrow)

Return JSON only.
"""

USER_PROMPT_TEMPLATE = """Today log:

{log_text}

Return JSON only in this exact schema:
{{
  "date": "{date}",
  "mood": "one short phrase",
  "patterns": ["..."],
  "one_experiment": "..."
}}
"""


def _latest_log_file() -> Path | None:
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    logs = sorted(LOG_DIR.glob("*.md"))
    return logs[-1] if logs else None


def run_daily_agent() -> Dict[str, Any]:
    log_path = _latest_log_file()
    if not log_path:
        raise FileNotFoundError(f"No log files found in {LOG_DIR.resolve()}")

    log_text = log_path.read_text(encoding="utf-8").strip()
    if not log_text:
        raise ValueError(f"Log file is empty: {log_path.name}")

    date = log_path.stem  # e.g., 2026-01-26
    user_prompt = USER_PROMPT_TEMPLATE.format(log_text=log_text, date=date)

    raw = call_llm(SYSTEM_PROMPT, user_prompt)

    # 容错：LLM 偶尔会输出非纯 JSON（mock 基本不会，但真实 LLM 以后可能会）
    try:
        result = json.loads(raw)
    except json.JSONDecodeError:
        result = {
            "date": date,
            "mood": "unparsed",
            "patterns": ["LLM output was not valid JSON"],
            "one_experiment": "Retry with simpler input tomorrow.",
            "raw": raw,
        }

    append_daily(result)
    return result
