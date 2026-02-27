import { useLocaleContext } from "../../../../context/LocaleContext";
import "../../../../styles/editors/Editors.css";

const translations = {
  en: {
    title: "Education",
    eduHeader: (i) => `Education ${i + 1}`,
    removeBtn: "Remove education",
    schoolPlaceholder: "Institution / School",
    degreePlaceholder: "Degree / Certificate / Field of study",
    startPlaceholder: "Start year",
    endPlaceholder: "End year",
    descriptionPlaceholder: "Details (optional):\n• Certifications\n• Honors / GPA\n• Relevant coursework",
    addBtn: "+ Add Education"
  },
  he: {
    title: "השכלה",
    eduHeader: (i) => `לימודים ${i + 1}`,
    removeBtn: "הסר השכלה",
    schoolPlaceholder: "מוסד לימודים / בית ספר",
    degreePlaceholder: "תואר / תעודה / תחום לימוד",
    startPlaceholder: "שנת התחלה",
    endPlaceholder: "שנת סיום",
    descriptionPlaceholder: "פרטים (אופציונלי):\n• הסמכות\n• הצטיינויות / ממוצע\n• קורסים רלוונטיים",
    addBtn: "+ הוסף השכלה"
  }
};

export default function EducationEditor({ education = [], setEducation }) {
  const { locale } = useLocaleContext();
  const t = translations[locale];
  const addEducation = () => {
    setEducation([
      ...education,
      {
        school: "",
        degree: "",
        start: "",
        end: "",
        description: ""
      }
    ]);
  };

  const updateEducation = (index, field, value) => {
    const copy = [...education];
    copy[index] = { ...copy[index], [field]: value };
    setEducation(copy);
  };

  const removeEducation = (index) => {
    const copy = [...education];
    copy.splice(index, 1);
    setEducation(copy);
  };

  return (
    <section className="editor-section">
      <h3>{t.title}</h3>

      {education.map((edu, i) => (
        <div key={i} className="editor-card">
          <div className="editor-card-header">
            <strong>{t.eduHeader(i)}</strong>
            <button
              type="button"
              className="icon-button danger"
              onClick={() => removeEducation(i)}
              title={t.removeBtn}
            >
              🗑️
            </button>
          </div>

          <input
            placeholder={t.schoolPlaceholder}
            value={edu.school}
            onChange={(e) =>
              updateEducation(i, "school", e.target.value)
            }
          />

          <input
            placeholder={t.degreePlaceholder}
            value={edu.degree}
            onChange={(e) =>
              updateEducation(i, "degree", e.target.value)
            }
          />

          <div className="editor-row">
            <input
              placeholder={t.startPlaceholder}
              value={edu.start}
              onChange={(e) =>
                updateEducation(i, "start", e.target.value)
              }
            />
            <input
              placeholder={t.endPlaceholder}
              value={edu.end}
              onChange={(e) =>
                updateEducation(i, "end", e.target.value)
              }
            />
          </div>

          <textarea
            rows={4}
            placeholder={t.descriptionPlaceholder}
            value={edu.description}
            onChange={(e) =>
              updateEducation(i, "description", e.target.value)
            }
          />
        </div>
      ))}

      <button
        type="button"
        className="add-button"
        onClick={addEducation}
      >
        {t.addBtn}
      </button>
    </section>
  );
}
