
import React, { useState } from 'react';

export default function LanguagesEditor({ languages, setLanguages }) {
  const [languageName, setLanguageName] = useState('');
  const [languageLevel, setLanguageLevel] = useState(1);

  function addLanguage() {
    if (!languageName.trim()) return;
    const updatedLanguages = [...languages, { name: languageName.trim(), level: languageLevel }];
    updatedLanguages.sort((a, b) => b.level - a.level);
    setLanguages(updatedLanguages);
    setLanguageName('');
    setLanguageLevel(1);
  }

  function removeLanguage(index) {
    const updatedLanguages = languages.filter((_, i) => i !== index);
    updatedLanguages.sort((a, b) => b.level - a.level);
    setLanguages(updatedLanguages);
  }

  return (
    <section className="editor-section">
      <h2>Languages</h2>

      <div className="skill-input">
        <input
          type="text"
          name="language"
          autoComplete="off"
          placeholder="Language name"
          value={languageName}
          onChange={e => setLanguageName(e.target.value)}
        />

        <select
          value={languageLevel}
          onChange={e => setLanguageLevel(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5].map(level => (
            <option key={level} value={level}>
              {level} star{level > 1 ? 's' : ''}
            </option>
          ))}
        </select>

        <button type="button" onClick={addLanguage}>Add</button>
      </div>

      <ul className="skill-list">
        {languages
          .slice()
          .sort((a, b) => b.level - a.level)
          .map((lang, i) => (
            <li key={i}>
              <span>{lang.name}</span> — <span>{'⭐'.repeat(lang.level)}</span>
              <button type="button" onClick={() => removeLanguage(i)}>❌</button>
            </li>
          ))}
      </ul>
    </section>
  );
}
