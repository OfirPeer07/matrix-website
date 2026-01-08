import "../../../../styles/editors/Editors.css";

export default function EducationEditor({ education = [], setEducation }) {
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
      <h3>Education</h3>

      {education.map((edu, i) => (
        <div key={i} className="editor-card">
          <div className="editor-card-header">
            <strong>Education {i + 1}</strong>
            <button
              type="button"
              className="icon-button danger"
              onClick={() => removeEducation(i)}
              title="Remove education"
            >
              🗑️
            </button>
          </div>

          <input
            placeholder="Institution / School"
            value={edu.school}
            onChange={(e) =>
              updateEducation(i, "school", e.target.value)
            }
          />

          <input
            placeholder="Degree / Certificate / Field of study"
            value={edu.degree}
            onChange={(e) =>
              updateEducation(i, "degree", e.target.value)
            }
          />

          <div className="editor-row">
            <input
              placeholder="Start year"
              value={edu.start}
              onChange={(e) =>
                updateEducation(i, "start", e.target.value)
              }
            />
            <input
              placeholder="End year"
              value={edu.end}
              onChange={(e) =>
                updateEducation(i, "end", e.target.value)
              }
            />
          </div>

          <textarea
            rows={4}
            placeholder={`Details (optional):
• Certifications
• Honors / GPA
• Relevant coursework`}
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
        + Add Education
      </button>
    </section>
  );
}
