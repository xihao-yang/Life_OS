# api/server.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import json
import datetime

# ===== 基础配置 =====
app = FastAPI(title="Life OS api", version="0.1")

# 允许前端访问（Vite / React）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # v1 直接放开，后面可收紧
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "Data"
LOG_DIR = DATA_DIR / "Logs"


# ===== 工具函数 =====
def load_json(path: Path, default):
    if not path.exists():
        return default
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def latest_log_date():
    if not LOG_DIR.exists():
        return None
    logs = sorted(LOG_DIR.glob("*.md"))
    if not logs:
        return None
    return logs[-1].stem


# ===== api =====
@app.get("/api/dashboard")
def get_dashboard():
    """
    UI Dashboard 使用的核心接口
    """
    goals = load_json(DATA_DIR / "goals.json", [])
    habits = load_json(DATA_DIR / "habits.json", [])
    progress = load_json(DATA_DIR / "progress.json", {})
    agent_memory = load_json(DATA_DIR / "agent_memory.json", {})

    return {
        "meta": {
            "generated_at": datetime.datetime.now().isoformat(),
            "latest_log": latest_log_date(),
        },
        "daily_reflection": {
            "mood": agent_memory.get("mood", "unknown"),
            "one_experiment": agent_memory.get(
                "one_experiment",
                "Write 3 bullet points tonight: win / friction / next step."
            ),
            "patterns": agent_memory.get("patterns", []),
        },
        "goals": goals,
        "habits": habits,
        "progress": progress,
    }


@app.get("/api/health")
def health_check():
    return {"status": "ok"}
