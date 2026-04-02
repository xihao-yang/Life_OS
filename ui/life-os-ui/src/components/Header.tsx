type HeaderProps = {
  generatedAt: string;
  latestLog: string | null;
};

function readableDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString();
}

function Header({ generatedAt, latestLog }: HeaderProps) {
  return (
    <header className="top-header">
      <span className="top-header-eyebrow">Dashboard</span>
      <h1 className="top-header-title">Life OS</h1>
      <p className="top-header-subtitle">
        A focused view of your current state and priorities.
      </p>
      <p className="top-header-meta">
        Generated at {readableDate(generatedAt)}
        {latestLog ? ` | Latest log ${latestLog}` : ""}
      </p>
    </header>
  );
}

export default Header;
