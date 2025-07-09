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
            dir="rtl"
            style={{
              width: '100%',
              minHeight: 80,
              padding: 10,
              borderRadius: 4,
              border: '1px solid #ccc',
              fontSize: 16,
              fontFamily: 'Arial, sans-serif',
              resize: 'vertical',
              backgroundColor: '#fff',
              whiteSpace: 'pre-wrap',
            }}
            value={text}
            onChange={e => updateParagraph(index, e.target.value)}
          />
          <button
            onClick={() => removeParagraph(index)}
            style={{
              marginTop: 6,
              background: '#dc3545',
              color: '#fff',
              border: 'none',
              padding: '5px 10px',
              borderRadius: 4,
              cursor: 'pointer',
            }}
            aria-label={`מחק פסקה מספר ${index + 1}`}
          >
            מחק פסקה
          </button>
        </div>
      ))}

      <button
        onClick={addParagraph}
        style={{
          marginTop: 10,
          background: '#0d6efd',
          color: '#fff',
          border: 'none',
          padding: '8px 12px',
          borderRadius: 4,
          cursor: 'pointer',
        }}
        aria-label="הוסף פסקה חדשה"
      >
        הוסף פסקה
      </button>
    </section>
  );
}
