# agent_runtime/triggers.py
from datetime import datetime

def should_run_daily(last_run):
    now = datetime.now()
    return now.hour >= 21 and last_run.date() != now.date()

def should_run_weekly(last_run):
    now = datetime.now()
    return now.weekday() == 6 and last_run.date() != now.date()
