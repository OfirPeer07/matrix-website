import React from 'react';

export default function ArmySection({ army, setArmy }) {
  const currentYear = new Date().getFullYear();

  const isArmyFilled = army.role || army.city || army.start || army.end || army.description;

  function updateField(field, value) {
    setArmy(prev => ({ ...prev, [field]: value }));
  }

  function clearArmy() {
    setArmy({
      role: '',
      city: '',
      start: '',
      end: '',
      description: ''
    });
  }

  return (
    <section className="editor-section">
      <h2>Military Service</h2>

      {isArmyFilled ? (
        <>
          <label>
            <strong>Role in the Army:</strong><br />
            <input
              type="text"
              name="military-role"
              autoComplete="off"
              value={army.role}
              onChange={e => updateField('role', e.target.value)}
              placeholder="e.g. Intelligence Analyst"
            />
          </label>

          <label>
            <strong>City / Base:</strong><br />
            <input
              type="text"
              name="military-base"
              autoComplete="off"
              value={army.city}
              onChange={e => updateField('city', e.target.value)}
              placeholder="e.g. Southern Israel"
            />
          </label>

          <label>
            <strong>From Year:</strong><br />
            <input
              type="number"
              name="military-start"
              autoComplete="off"
              min="1900"
              max={currentYear + 10}
              value={army.start || ''}
              onChange={e => updateField('start', Number(e.target.value))}
              placeholder="e.g. 2016"
            />
          </label>

          <label>
            <strong>To Year:</strong><br />
            <input
              type="number"
              name="military-end"
              autoComplete="off"
              min="1900"
              max={currentYear + 10}
              value={army.end || ''}
              onChange={e => updateField('end', Number(e.target.value))}
              placeholder="e.g. 2019"
            />
          </label>

          <label>
            <strong>Description: <span style={{ fontWeight: 'normal' }}>(optional)</span></strong><br />
            <textarea
              name="military-description"
              autoComplete="off"
              value={army.description}
              onChange={e => updateField('description', e.target.value)}
              placeholder="Details about your service..."
              style={{ minHeight: 80 }}
            />
          </label>

          <button type="button" onClick={clearArmy} style={{ marginTop: 12 }}>
            ❌ Remove Military Service
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() =>
            setArmy({
              role: '',
              city: '',
              start: currentYear,
              end: currentYear,
              description: ''
            })
          }
        >
          ➕ Add Military Service
        </button>
      )}
    </section>
  );
}
