import { useLocaleContext } from "../../../../context/LocaleContext";

const translations = {
  en: {
    title: "Skills",
    placeholder: "Skill",
    add: "Add"
  },
  he: {
    title: "מיומנויות",
    placeholder: "מיומנות",
    add: "הוסף"
  }
};

export default function SkillsEditor({ skills = [], setSkills }) {
  const { locale } = useLocaleContext();
  const t = translations[locale];
  const add = () => setSkills([...skills, { name: "", level: "" }]);

  return (
    <section>
      <h3>{t.title}</h3>
      {skills.map((s, i) => (
        <input
          key={i}
          placeholder={t.placeholder}
          value={s.name}
          onChange={e => {
            const copy = [...skills];
            copy[i] = { ...copy[i], name: e.target.value };
            setSkills(copy);
          }}
        />
      ))}
      <button type="button" onClick={add}>{t.add}</button>
    </section>
  );
}