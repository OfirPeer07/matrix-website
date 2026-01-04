import { useState } from "react";
import "../../../../styles/editors/editors.css";

export default function ExperienceEditor({ experience = [], setExperience }) {
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
      <h3>Experience</h3>

      {experience.map(item => {
        const isEditing = editingId === item.id;

        return (
          <div key={item.id} className="experience-card">
            {/* HEADER */}
            <div className="experience-header">
              <strong>
                {item.title || "New Role"}{" "}
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
                  placeholder="Role / Title"
                  value={item.title}
                  onChange={e =>
                    updateItem(item.id, "title", e.target.value)
                  }
                />

                <input
                  placeholder="Company"
                  value={item.company}
                  onChange={e =>
                    updateItem(item.id, "company", e.target.value)
                  }
                />

                <div className="row">
                  <input
                    placeholder="Start"
                    value={item.start}
                    onChange={e =>
                      updateItem(item.id, "start", e.target.value)
                    }
                  />
                  <input
                    placeholder="End"
                    value={item.end}
                    onChange={e =>
                      updateItem(item.id, "end", e.target.value)
                    }
                  />
                </div>

                <textarea
                  placeholder={
                    "Describe your work using bullet points.\n" +
                    "Example:\n" +
                    "• Built React components\n" +
                    "• Improved performance by 30%"
                  }
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
        + Add Experience
      </button>
    </section>
  );
}
