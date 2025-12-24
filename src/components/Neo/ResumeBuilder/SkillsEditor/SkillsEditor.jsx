
import React, { useState } from 'react';

export default function SkillsEditor({ skills, setSkills }) {
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState(1);

  function addSkill() {
    if (!skillName.trim()) return;
    const updatedSkills = [...skills, { name: skillName.trim(), level: skillLevel }];
    updatedSkills.sort((a, b) => b.level - a.level);
    setSkills(updatedSkills);
    setSkillName('');
    setSkillLevel(1);
  }

  function removeSkill(index) {
    const updatedSkills = skills.filter((_, i) => i !== index);
    updatedSkills.sort((a, b) => b.level - a.level);
    setSkills(updatedSkills);
  }

  return (
    <section className="editor-section">
      <h2>Skills</h2>

      <div className="skill-input">
        <input
          type="text"
          name="skill"
          autoComplete="off"
          placeholder="Skill name"
          value={skillName}
          onChange={e => setSkillName(e.target.value)}
        />

        <select
          value={skillLevel}
          onChange={e => setSkillLevel(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5].map(level => (
            <option key={level} value={level}>
              {level} star{level > 1 ? 's' : ''}
            </option>
          ))}
        </select>

        <button type="button" onClick={addSkill}>
          Add
        </button>
      </div>

      <ul className="skill-list">
        {skills
          .slice()
          .sort((a, b) => b.level - a.level)
          .map((skill, i) => (
            <li key={i}>
              <span>{skill.name}</span> — <span>{'⭐'.repeat(skill.level)}</span>
              <button type="button" onClick={() => removeSkill(i)}>❌</button>
            </li>
          ))}
      </ul>
    </section>
  );
}
