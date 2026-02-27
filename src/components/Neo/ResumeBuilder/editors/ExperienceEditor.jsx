import { useState } from "react";
import "../../../../styles/editors/Editors.css";

import { useLocaleContext } from "../../../../context/LocaleContext";

const translations = {
  en: {
    title: "Experience",
    newRole: "New Role",
    rolePlaceholder: "Role / Title",
    companyPlaceholder: "Company",
    startPlaceholder: "Start",
    endPlaceholder: "End",
    descriptionPlaceholder: "Describe your work using bullet points.\nExample:\n• Built React components\n• Improved performance by 30%",
    addBtn: "+ Add Experience"
  },
  he: {
    title: "ניסיון תעסוקתי",
    newRole: "תפקיד חדש",
    rolePlaceholder: "תפקיד / כותרת",
    companyPlaceholder: "חברה / ארגון",
    startPlaceholder: "התחלה",
    endPlaceholder: "סיום",
    descriptionPlaceholder: "תאר את עבודתך בנקודות.\nדוגמה:\n• פיתוח רכיבי React\n• שיפור ביצועים ב-30%",
    addBtn: "+ הוסף ניסיון"
  }
};

export default function ExperienceEditor({ experience = [], setExperience }) {
  const { locale } = useLocaleContext();
  const t = translations[locale];
  const [editingId, setEditingId] = useState(null);

  const emptyItem = {
    id: crypto.randomUUID(),
    title: "",
    company: "",
    start: "",
    end: "",
    description: ""
  };

  const addExperience = () => {
    setExperience([...experience, emptyItem]);
    setEditingId(emptyItem.id);
  };

  const updateItem = (id, field, value) => {
    setExperience(
      experience.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const deleteItem = (id) => {
    setExperience(experience.filter(item => item.id !== id));
  };

  return (
    <section className="editor-section">
      <h3>{t.title}</h3>

      {experience.map(item => {
        const isEditing = editingId === item.id;

        return (
          <div key={item.id} className="experience-card">
            {/* HEADER */}
            <div className="experience-header">
              <strong>
                {item.title || t.newRole}{" "}
                {item.company && `– ${item.company}`}
              </strong>

              <div className="actions">
                <button onClick={() => setEditingId(isEditing ? null : item.id)}>
                  ✏️
                </button>
                <button onClick={() => deleteItem(item.id)}>🗑️</button>
              </div>
            </div>

            {/* EDIT MODE */}
            {isEditing && (
              <div className="experience-form">
                <input
                  placeholder={t.rolePlaceholder}
                  value={item.title}
                  onChange={e =>
                    updateItem(item.id, "title", e.target.value)
                  }
                />

                <input
                  placeholder={t.companyPlaceholder}
                  value={item.company}
                  onChange={e =>
                    updateItem(item.id, "company", e.target.value)
                  }
                />

                <div className="row">
                  <input
                    placeholder={t.startPlaceholder}
                    value={item.start}
                    onChange={e =>
                      updateItem(item.id, "start", e.target.value)
                    }
                  />
                  <input
                    placeholder={t.endPlaceholder}
                    value={item.end}
                    onChange={e =>
                      updateItem(item.id, "end", e.target.value)
                    }
                  />
                </div>

                <textarea
                  placeholder={t.descriptionPlaceholder}
                  value={item.description}
                  onChange={e =>
                    updateItem(item.id, "description", e.target.value)
                  }
                />
              </div>
            )}
          </div>
        );
      })}

      <button className="add-btn" onClick={addExperience}>
        {t.addBtn}
      </button>
    </section>
  );
}
