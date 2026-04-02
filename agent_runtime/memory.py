# agent_runtime/memory.py
from __future__ import annotations

import json
from pathlib import Path
from datetime import datetime
from typing import Any, Dict

# =====================================================
# Original memory (timeline-style, append-only)
# =====================================================

DATA_DIR = Path("Data")
MEMORY_PATH = DATA_DIR / "agent_memory.json"


def load_memory() -> Dict[str, Any]:
    if MEMORY_PATH.exists():
        return json.loads(MEMORY_PATH.read_text(encoding="utf-8"))
    return {
        "daily": [],
        "weekly": [],
        "patterns": []
    }


def save_memory(memory: Dict[str, Any]) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    MEMORY_PATH.write_text(
        json.dumps(memory, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )


def append_daily(summary: Dict[str, Any]) -> None:
    memory = load_memory()
    summary.setdefault("ts", datetime.now().isoformat(timespec="seconds"))
    memory["daily"].append(summary)
    save_memory(memory)


# =====================================================
# Dashboard-facing agent state (single snapshot)
# =====================================================

# ⚠️ This is intentionally separated from agent_memory.json
# to avoid breaking the timeline structure above.

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR_ABS = BASE_DIR / "Data"
AGENT_STATE_PATH = DATA_DIR_ABS / "agent_state.json"


def write_agent_memory(result: Dict[str, Any]) -> None:
    """
    Write a compact agent state for UI consumption (Dashboard).

    This does NOT overwrite agent_memory.json used by append_daily().
    It writes a single snapshot file for frontend display.
    """
    DATA_DIR_ABS.mkdir(parents=True, exist_ok=True)

    payload = {
        "mood": result.get("mood"),
        "patterns": result.get("patterns", []),
        "one_experiment": result.get("one_experiment"),
        "updated_at": datetime.now().isoformat(timespec="seconds"),
    }

    AGENT_STATE_PATH.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )
