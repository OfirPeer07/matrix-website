import { useLocaleContext } from "../../../../context/LocaleContext";

const translations = {
  en: {
    title: "Projects",
    projectHeader: (i) => `Project ${i + 1}`,
    removeBtn: "Remove project",
    namePlaceholder: "Project name",
    linkPlaceholder: "Project link (GitHub / Live demo)",
    descriptionPlaceholder: "Describe the project using bullet points.\nExample:\n• Built with React and Node.js\n• Implemented authentication\n• Deployed on AWS",
    addBtn: "+ Add Project"
  },
  he: {
    title: "פרויקטים",
    projectHeader: (i) => `פרויקט ${i + 1}`,
    removeBtn: "הסר פרויקט",
    namePlaceholder: "שם הפרויקט",
    linkPlaceholder: "קישור לפרויקט (GitHub / דמו חי)",
    descriptionPlaceholder: "תאר את הפרויקט בנקודות.\nדוגמה:\n• פותח עם React ו-Node.js\n• מימוש מערכת אימות\n• פריסה ב-AWS",
    addBtn: "+ הוסף פרויקט"
  }
};

export default function ProjectsEditor({ projects = [], setProjects }) {
  const { locale } = useLocaleContext();
  const t = translations[locale];
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
      <h3>{t.title}</h3>

      {projects.map((project, i) => (
        <div key={i} className="editor-card">
          <div className="editor-card-header">
            <strong>{t.projectHeader(i)}</strong>
            <button
              type="button"
              className="icon-button danger"
              onClick={() => removeProject(i)}
              title={t.removeBtn}
            >
              🗑️
            </button>
          </div>

          <input
            placeholder={t.namePlaceholder}
            value={project.name}
            onChange={(e) =>
              updateProject(i, "name", e.target.value)
            }
          />

          <input
            placeholder={t.linkPlaceholder}
            value={project.link}
            onChange={(e) =>
              updateProject(i, "link", e.target.value)
            }
          />

          <textarea
            placeholder={t.descriptionPlaceholder}
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
        {t.addBtn}
      </button>
    </section>
  );
}
