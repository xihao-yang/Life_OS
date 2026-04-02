import Card from "./Card";

type GoalsCardProps = {
  goals: unknown[];
};

function goalLabel(goal: unknown): string {
  if (typeof goal === "string") {
    return goal;
  }

  if (typeof goal === "object" && goal !== null) {
    const value = goal as Record<string, unknown>;
    if (typeof value.title === "string") {
      return value.title;
    }
    if (typeof value.name === "string") {
      return value.name;
    }

    return JSON.stringify(value);
  }

  return String(goal);
}

function GoalsCard({ goals }: GoalsCardProps) {
  return (
    <Card title="Goals">
      {goals.length === 0 ? (
        <p className="muted">No goals yet.</p>
      ) : (
        <ul className="goals-list">
          {goals.map((goal, index) => (
            <li key={`goal-${index}`}>{goalLabel(goal)}</li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export default GoalsCard;
