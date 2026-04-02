import { useEffect, useState } from "react";
import DailyReflection from "./components/DailyReflection";
import GoalsCard from "./components/GoalsCard";
import Header from "./components/Header";
import { type DashboardData, fetchDashboard } from "./services/api";
import "./App.css";

function App() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadDashboard = async () => {
      try {
        setIsLoading(true);
        const data = await fetchDashboard(controller.signal);
        setDashboard(data);
        setError(null);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    void loadDashboard();

    return () => {
      controller.abort();
    };
  }, []);

  if (isLoading) {
    return <div className="app-state">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="app-state error">Error loading dashboard: {error}</div>;
  }

  if (!dashboard) {
    return <div className="app-state">No dashboard data.</div>;
  }

  return (
    <div className="app-shell">
      <main className="app-container">
        <div className="app-stack">
          <Header
            generatedAt={dashboard.meta.generated_at}
            latestLog={dashboard.meta.latest_log}
          />

          <DailyReflection
            mood={dashboard.daily_reflection.mood}
            one_experiment={dashboard.daily_reflection.one_experiment}
            patterns={dashboard.daily_reflection.patterns}
          />

          <GoalsCard goals={dashboard.goals} />
        </div>
      </main>
    </div>
  );
}

export default App;
