export default function SkillsEditor({ skills = [], setSkills }) {
  const add = () => setSkills([...skills, { name: "", level: "" }]);

  return (
    <section>
      <h3>Skills</h3>
      {skills.map((s, i) => (
        <input
          key={i}
          placeholder="Skill"
          value={s.name}
          onChange={e => {
            const copy = [...skills];
            copy[i] = { ...copy[i], name: e.target.value };
            setSkills(copy);
          }}
        />
      ))}
      <button type="button" onClick={add}>Add</button>
    </section>
  );
}