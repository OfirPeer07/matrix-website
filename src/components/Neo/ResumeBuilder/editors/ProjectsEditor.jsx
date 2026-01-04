export default function ProjectsEditor({ projects = [], setProjects }) {
  const addProject = () => {
    setProjects([
      ...projects,
      {
        name: "",
        description: "",
        link: ""
      }
    ]);
  };

  const updateProject = (index, field, value) => {
    const copy = [...projects];
    copy[index] = { ...copy[index], [field]: value };
    setProjects(copy);
  };

  const removeProject = (index) => {
    const copy = [...projects];
    copy.splice(index, 1);
    setProjects(copy);
  };

  return (
    <section className="editor-section">
      <h3>Projects</h3>

      {projects.map((project, i) => (
        <div key={i} className="editor-card">
          <div className="editor-card-header">
            <strong>Project {i + 1}</strong>
            <button
              type="button"
              className="icon-button danger"
              onClick={() => removeProject(i)}
              title="Remove project"
            >
              🗑️
            </button>
          </div>

          <input
            placeholder="Project name"
            value={project.name}
            onChange={(e) =>
              updateProject(i, "name", e.target.value)
            }
          />

          <input
            placeholder="Project link (GitHub / Live demo)"
            value={project.link}
            onChange={(e) =>
              updateProject(i, "link", e.target.value)
            }
          />

          <textarea
            placeholder={`Describe the project using bullet points.
Example:
• Built with React and Node.js
• Implemented authentication
• Deployed on AWS`}
            rows={4}
            value={project.description}
            onChange={(e) =>
              updateProject(i, "description", e.target.value)
            }
          />
        </div>
      ))}

      <button
        type="button"
        className="add-button"
        onClick={addProject}
      >
        + Add Project
      </button>
    </section>
  );
}
