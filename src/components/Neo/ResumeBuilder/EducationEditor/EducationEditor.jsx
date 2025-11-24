import React, { useState } from 'react';

export default function EducationEditor({ education, setEducation }) {
  const currentYear = new Date().getFullYear();

  const yearsFrom = Array.from({ length: currentYear - 1969 }, (_, i) => (currentYear - i).toString());
  const yearsTo = ['Present', ...yearsFrom];

  const [school, setSchool] = useState('');
  const [city, setCity] = useState('');
  const [degree, setDegree] = useState('');
  const [start, setStart] = useState(currentYear.toString());
  const [end, setEnd] = useState('Present');
  const [description, setDescription] = useState('');

  function addEducation() {
    if (!school) return;
    setEducation([
      ...education,
      { school, city, degree, start, end, description }
    ]);
    setSchool('');
    setCity('');
    setDegree('');
    setStart(currentYear.toString());
    setEnd('Present');
    setDescription('');
  }

  function removeEducation(index) {
    setEducation(education.filter((_, i) => i !== index));
  }

  return (
    <section className="editor-section">
      <h2>Education</h2>

      <label>
        <strong>Institution:</strong>
        <input
          type="text"
          name="school"
          autoComplete="organization"
          value={school}
          onChange={e => setSchool(e.target.value)}
          placeholder="Enter institution name"
        />
      </label>

      <label>
        <strong>City:</strong>
        <input
          type="text"
          name="address-level2"
          autoComplete="address-level2"
          value={city}
          onChange={e => setCity(e.target.value)}
          placeholder="Enter city"
        />
      </label>

      <label>
        <strong>Degree / Certification:</strong>
        <input
          type="text"
          name="degree"
          autoComplete="off"
          value={degree}
          onChange={e => setDegree(e.target.value)}
          placeholder="e.g., B.Sc. in Computer Science"
        />
      </label>

      <label>
        <strong>From year:</strong>
        <select name="edu-start-year" value={start} onChange={e => setStart(e.target.value)}>
          {yearsFrom.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </label>

      <label>
        <strong>To year:</strong>
        <select name="edu-end-year" value={end} onChange={e => setEnd(e.target.value)}>
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
          name="edu-description"
          autoComplete="off"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Details about your education"
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

      <button type="button" onClick={addEducation} style={{ marginTop: 12 }}>
        Add Education
      </button>

      <ul className="list-items">
        {education.map((edu, i) => (
          <li key={i}>
            <strong>{edu.degree}</strong><br />
            {edu.school} — {edu.city}<br />
            ({edu.start} - {edu.end})
            {edu.description && (
              <div style={{ marginTop: 8, whiteSpace: 'pre-wrap' }}>
                {edu.description}
              </div>
            )}
            <button onClick={() => removeEducation(i)} style={{ marginLeft: '10px', marginTop: 8 }}>
              ❌
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
