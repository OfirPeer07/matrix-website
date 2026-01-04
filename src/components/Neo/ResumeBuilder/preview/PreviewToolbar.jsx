import "./PreviewToolbar.css";
import "./templates/styles/base.css";

export default function PreviewToolbar({ template, onChange }) {
  const buttons = [
    { id: "classic", label: "Classic" },
    { id: "modern", label: "Modern" },
    { id: "ats", label: "ATS" },
    { id: "base", label: "Raw" },
  ];

  return (
    <div className="preview-toolbar">
      <span>Preview:</span>

      {buttons.map((btn) => (
        <button
          key={btn.id}
          type="button"
          className={template === btn.id ? "active" : ""}
          onClick={() => onChange(btn.id)}
          aria-pressed={template === btn.id}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );
}
