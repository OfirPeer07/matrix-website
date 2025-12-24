import React, { useState } from 'react';

export default function ProjectsEditor({ projects, setProjects }) {
  const [name, setName] = useState('');
  const [miniTitle, setMiniTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');

  const addProject = () => {
    if (!name.trim()) return;
    setProjects([
      ...projects,
      {
        name: name.trim(),
        miniTitle: miniTitle.trim(),
        description: description.trim(),
        link: link.trim(),
      },
    ]);
    setName('');
    setMiniTitle('');
    setDescription('');
    setLink('');
  };

  const removeProject = (index) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  return (
    <section className="editor-section">
      <h2>GitHub Projects:</h2>

      <label>
        <strong>Project Name:</strong>
        <input
          type="text"
          name="project-name"
          autoComplete="off"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Portfolio Website"
        />
      </label>

      <label>
        <strong>Mini Title (optional):</strong>
        <input
          type="text"
          name="project-mini-title"
          autoComplete="off"
          value={miniTitle}
          onChange={e => setMiniTitle(e.target.value)}
          placeholder="e.g. React + Firebase"
        />
      </label>

      <label>
        <strong>Description:</strong>
        <textarea
          name="project-description"
          autoComplete="off"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Brief summary or bullet points"
        />
      </label>

      <label>
        <strong>Project Link:</strong>
        <input
          type="url"
          name="project-link"
          autoComplete="url"
          value={link}
          onChange={e => setLink(e.target.value)}
          placeholder="e.g. https://github.com/yourusername/project"
        />
      </label>

      <button type="button" onClick={addProject}>Add Project</button>

      <ul className="list-items">
        {projects.map((p, i) => (
          <li key={i}>
            <div>
              <strong>{p.name}</strong>
              {p.miniTitle && <div><em>{p.miniTitle}</em></div>}
              <p>{p.description}</p>
              {p.link && (
                <a href={p.link} target="_blank" rel="noreferrer">
                  {p.link}
                </a>
              )}
            </div>
            <button onClick={() => removeProject(i)}>❌</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
