import React, { useState } from 'react';

export default function ExperienceEditor({ experience, setExperience }) {
  const currentYear = new Date().getFullYear();

  const yearsFrom = Array.from({ length: currentYear - 1969 }, (_, i) => (currentYear - i).toString());
  const yearsTo = ['Present', ...yearsFrom];

  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [start, setStart] = useState(currentYear.toString());
  const [end, setEnd] = useState('Present');
  const [description, setDescription] = useState('');

  function addExperience() {
    if (!company || !role) return;
    setExperience([
      ...experience,
      {
        company,
        role,
        start,
        end,
        description
      }
    ]);
    setCompany('');
    setRole('');
    setStart(currentYear.toString());
    setEnd('Present');
    setDescription('');
  }

  function removeExperience(index) {
    setExperience(experience.filter((_, i) => i !== index));
  }

  return (
    <section className="editor-section">
      <h2>Experience</h2>

      <label>
        <strong>Company:</strong>
        <input
          type="text"
          name="organization"
          autoComplete="organization"
          value={company}
          onChange={e => setCompany(e.target.value)}
          placeholder="Enter company name"
        />
      </label>

      <label>
        <strong>Role:</strong>
        <input
          type="text"
          name="job-title"
          autoComplete="organization-title"
          value={role}
          onChange={e => setRole(e.target.value)}
          placeholder="Your role"
        />
      </label>

      <label>
        <strong>From year:</strong>
        <select name="start-year" value={start} onChange={e => setStart(e.target.value)}>
          {yearsFrom.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </label>

      <label>
        <strong>To year:</strong>
        <select name="end-year" value={end} onChange={e => setEnd(e.target.value)}>
          {yearsTo.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </label>

      <label>
        <strong>Description:</strong>
        <textarea
          name="experience-description"
          autoComplete="off"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Describe your experience..."
          style={{
            minHeight: 80,
            border: '1px solid #ccc',
            padding: 10,
            borderRadius: 4,
            backgroundColor: '#fff',
            marginTop: 10,
            resize: 'vertical',
            fontFamily: 'Arial, sans-serif',
            fontSize: 16,
            whiteSpace: 'pre-wrap'
          }}
        />
      </label>

      <button type="button" onClick={addExperience} style={{ marginTop: 12 }}>
        Add Experience
      </button>

      <ul className="list-items">
        {experience.map((exp, i) => (
          <li key={i}>
            <div className="exp-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>
                <strong>{exp.role}</strong>, {exp.company}
              </span>
              <span className="exp-dates">
                {exp.start} - {exp.end}
              </span>
            </div>
            {exp.description && (
              <div style={{ marginTop: 8, whiteSpace: 'pre-wrap' }}>
                {exp.description}
              </div>
            )}
            <button
              type="button"
              onClick={() => removeExperience(i)}
              style={{ marginTop: 6 }}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
