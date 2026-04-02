import { useState } from "react";
import Card from "./Card";

type DailyReflectionData = {
  mood: string;
  one_experiment: string;
  patterns: string[];
};

type DailyReflectionProps = DailyReflectionData;

function DailyReflection({
  mood,
  one_experiment,
  patterns,
}: DailyReflectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [reflection, setReflection] = useState<DailyReflectionData>({
    mood,
    one_experiment,
    patterns,
  });
  const [draftMood, setDraftMood] = useState(reflection.mood);
  const [draftExperiment, setDraftExperiment] = useState(
    reflection.one_experiment
  );
  const [draftPatternsText, setDraftPatternsText] = useState(
    reflection.patterns.join("\n")
  );

  const startEdit = () => {
    setDraftMood(reflection.mood);
    setDraftExperiment(reflection.one_experiment);
    setDraftPatternsText(reflection.patterns.join("\n"));
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setDraftMood(reflection.mood);
    setDraftExperiment(reflection.one_experiment);
    setDraftPatternsText(reflection.patterns.join("\n"));
    setIsEditing(false);
  };

  const saveEdit = () => {
    const nextPatterns = draftPatternsText
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    setReflection({
      mood: draftMood.trim(),
      one_experiment: draftExperiment.trim(),
      patterns: nextPatterns,
    });
    setIsEditing(false);
  };

  return (
    <Card
      title="Daily Reflection"
      variant="primary"
      actions={
        !isEditing ? (
          <button className="btn" type="button" onClick={startEdit}>
            Edit
          </button>
        ) : undefined
      }
    >
      {isEditing ? (
        <>
          <label className="field">
            <span className="field-label">Mood</span>
            <input
              className="input"
              type="text"
              value={draftMood}
              onChange={(event) => setDraftMood(event.target.value)}
            />
          </label>

          <label className="field">
            <span className="field-label">One experiment</span>
            <textarea
              className="textarea"
              value={draftExperiment}
              onChange={(event) => setDraftExperiment(event.target.value)}
              rows={2}
            />
          </label>

          <label className="field">
            <span className="field-label">Patterns (one per line or comma separated)</span>
            <textarea
              className="textarea"
              value={draftPatternsText}
              onChange={(event) => setDraftPatternsText(event.target.value)}
              rows={3}
            />
          </label>

          <div className="actions-row">
            <button className="btn" type="button" onClick={saveEdit}>
              Save
            </button>
            <button className="btn secondary" type="button" onClick={cancelEdit}>
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="field">
            <p className="field-label">Mood</p>
            <p className="field-value">
              {reflection.mood || "N/A"}
            </p>
          </div>

          <div className="field">
            <p className="field-label">One experiment</p>
            <p className="field-value">
              {reflection.one_experiment || "N/A"}
            </p>
          </div>

          <div className="field">
            <p className="field-label">Patterns</p>
            {reflection.patterns.length === 0 ? (
              <p className="muted">No patterns detected.</p>
            ) : (
              <div className="patterns-tags">
                {reflection.patterns.map((pattern, index) => (
                  <span className="pattern-tag" key={`${pattern}-${index}`}>
                    {pattern}
                  </span>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </Card>
  );
}

export default DailyReflection;
