import { useLocaleContext } from "../../../../context/LocaleContext";

const translations = {
  en: {
    title: "Military Service",
    addBtn: "+ Add Military Service (optional)",
    removeBtn: "Remove military service",
    rolePlaceholder: "Role / Unit",
    startPlaceholder: "Start year",
    endPlaceholder: "End year",
    descriptionPlaceholder: "Describe your service using bullet points.\nExample:\n• Led a team of 8 soldiers\n• Managed logistics and operations"
  },
  he: {
    title: "שירות צבאי / לאומי",
    addBtn: "+ הוסף שירות צבאי/לאומי (אופציונלי)",
    removeBtn: "הסר שירות צבאי",
    rolePlaceholder: "תפקיד / יחידה",
    startPlaceholder: "שנת התחלה",
    endPlaceholder: "שנת סיום",
    descriptionPlaceholder: "תאר את שירותך בנקודות.\nדוגמה:\n• פיקוד על צוות של 8 חיילים\n• ניהול לוגיסטיקה ומבצעים"
  }
};

export default function ArmySection({ value = {}, onChange }) {
  const { locale } = useLocaleContext();
  const t = translations[locale];
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
        <h3>{t.title}</h3>
        <button
          type="button"
          className="add-button"
          onClick={toggle}
        >
          {t.addBtn}
        </button>
      </section>
    );
  }

  return (
    <section className="editor-section">
      <div className="editor-card">
        <div className="editor-card-header">
          <strong>{t.title}</strong>
          <button
            type="button"
            className="icon-button danger"
            onClick={toggle}
            title={t.removeBtn}
          >
            🗑️
          </button>
        </div>

        <input
          placeholder={t.rolePlaceholder}
          value={role}
          onChange={(e) =>
            onChange({ ...value, role: e.target.value })
          }
        />

        <div className="editor-row">
          <input
            placeholder={t.startPlaceholder}
            value={start}
            onChange={(e) =>
              onChange({ ...value, start: e.target.value })
            }
          />
          <input
            placeholder={t.endPlaceholder}
            value={end}
            onChange={(e) =>
              onChange({ ...value, end: e.target.value })
            }
          />
        </div>

        <textarea
          rows={4}
          placeholder={t.descriptionPlaceholder}
          value={description}
          onChange={(e) =>
            onChange({ ...value, description: e.target.value })
          }
        />
      </div>
    </section>
  );
}
