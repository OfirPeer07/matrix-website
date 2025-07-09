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
        <strong>Project Name:
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Portfolio Website"
        /></strong>
      </label>

      <label>
        <strong>Mini Title (optional):
        <input
          type="text"
          value={miniTitle}
          onChange={e => setMiniTitle(e.target.value)}
          placeholder="e.g. React + Firebase"
        /></strong>
      </label>

      <label>
        <strong>Description:
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Brief summary or bullet points"
        /></strong>
      </label>

      <label>
        <strong>Project Link:
        <input
          type="text"
          value={link}
          onChange={e => setLink(e.target.value)}
          placeholder="e.g. https://github.com/yourusername/project"
        /></strong>
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
