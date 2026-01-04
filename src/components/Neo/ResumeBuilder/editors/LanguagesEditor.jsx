export default function LanguagesEditor({ languages = [], setLanguages }) {
  const add = () => setLanguages([...languages, { name: "" }]);

  return (
    <section>
      <h3>Languages</h3>
      {languages.map((l, i) => (
        <input
          key={i}
          placeholder="Language"
          value={l.name}
          onChange={e => {
            const copy = [...languages];
            copy[i] = { ...copy[i], name: e.target.value };
            setLanguages(copy);
          }}
        />
      ))}
      <button type="button" onClick={add}>Add</button>
    </section>
  );
}