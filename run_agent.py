# run_agent.py
from agent_runtime.agents.daily import run_daily_agent

if __name__ == "__main__":
    out = run_daily_agent()
    print("=== Daily Reflection Saved ===")
    print(out)
