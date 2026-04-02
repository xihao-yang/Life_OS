const DEFAULT_API_BASE_URL = "http://127.0.0.1:8000";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL
).replace(/\/$/, "");

export type DailyReflectionData = {
  mood: string;
  one_experiment: string;
  patterns: string[];
};

export type DashboardData = {
  meta: {
    generated_at: string;
    latest_log: string | null;
  };
  daily_reflection: DailyReflectionData;
  goals: unknown[];
  habits: unknown[];
  progress: Record<string, unknown>;
};

export async function fetchDashboard(
  signal?: AbortSignal
): Promise<DashboardData> {
  const response = await fetch(`${API_BASE_URL}/api/dashboard`, { signal });

  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard (${response.status})`);
  }

  return (await response.json()) as DashboardData;
}
