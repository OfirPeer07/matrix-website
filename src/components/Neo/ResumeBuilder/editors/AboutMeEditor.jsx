export default function AboutMeEditor({ value = [], onChange }) {
  return (
    <section>
      <h3>About</h3>
      <textarea
        value={value.join("\n")}
        onChange={e => onChange(e.target.value.split("\n"))}
      />
    </section>
  );
}