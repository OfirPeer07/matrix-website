import React from 'react';

export default function AboutMeEditor({ value = [], onChange }) {
  const updateParagraph = (index, newText) => {
    const updated = [...value];
    updated[index] = newText;
    onChange(updated);
  };

  const addParagraph = () => {
    onChange([...value, '']);
  };

  const removeParagraph = (index) => {
    const updated = [...value];
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <section className="editor-section">
      <h2>About Me</h2>

      {value.map((text, index) => (
        <div key={index} style={{ marginBottom: 16 }}>
          <textarea
            name={`about-me-${index}`}
            autoComplete="off"
            style={{
              width: '100%',
              minHeight: 100,
              padding: 12,
              borderRadius: 6,
              border: '1px solid #ccc',
              fontSize: 16,
              fontFamily: 'Arial, sans-serif',
              resize: 'vertical',
              backgroundColor: '#fff',
              whiteSpace: 'pre-wrap',
              lineHeight: 1.5,
            }}
            placeholder="Write something about yourself..."
            value={text}
            onChange={e => updateParagraph(index, e.target.value)}
          />
          <button
            type="button"
            onClick={() => removeParagraph(index)}
            style={{
              marginTop: 8,
              backgroundColor: '#dc3545',
              color: '#fff',
              border: 'none',
              padding: '6px 12px',
              borderRadius: 4,
              cursor: 'pointer',
            }}
            aria-label={`Delete paragraph ${index + 1}`}
          >
            Delete Paragraph
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addParagraph}
        style={{
          marginTop: 12,
          backgroundColor: '#0d6efd',
          color: '#fff',
          border: 'none',
          padding: '10px 14px',
          borderRadius: 4,
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
        aria-label="Add new paragraph"
      >
        ➕ Add Paragraph
      </button>
    </section>
  );
}
