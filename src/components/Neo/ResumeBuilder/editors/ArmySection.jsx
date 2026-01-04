export default function ArmySection({ value = {}, onChange }) {
  const {
    enabled = false,
    role = "",
    start = "",
    end = "",
    description = ""
  } = value;

  const toggle = () => {
    onChange({
      enabled: !enabled,
      role: "",
      start: "",
      end: "",
      description: ""
    });
  };

  if (!enabled) {
    return (
      <section className="editor-section">
        <h3>Military Service</h3>
        <button
          type="button"
          className="add-button"
          onClick={toggle}
        >
          + Add Military Service (optional)
        </button>
      </section>
    );
  }

  return (
    <section className="editor-section">
      <div className="editor-card">
        <div className="editor-card-header">
          <strong>Military Service</strong>
          <button
            type="button"
            className="icon-button danger"
            onClick={toggle}
            title="Remove military service"
          >
            🗑️
          </button>
        </div>

        <input
          placeholder="Role / Unit"
          value={role}
          onChange={(e) =>
            onChange({ ...value, role: e.target.value })
          }
        />

        <div className="editor-row">
          <input
            placeholder="Start year"
            value={start}
            onChange={(e) =>
              onChange({ ...value, start: e.target.value })
            }
          />
          <input
            placeholder="End year"
            value={end}
            onChange={(e) =>
              onChange({ ...value, end: e.target.value })
            }
          />
        </div>

        <textarea
          rows={4}
          placeholder={`Describe your service using bullet points.
Example:
• Led a team of 8 soldiers
• Managed logistics and operations`}
          value={description}
          onChange={(e) =>
            onChange({ ...value, description: e.target.value })
          }
        />
      </div>
    </section>
  );
}
