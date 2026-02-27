import { useLocaleContext } from "../../../../context/LocaleContext";

const translations = {
  en: { title: "Languages", placeholder: "Language", addBtn: "Add" },
  he: { title: "שפות", placeholder: "שפה", addBtn: "הוסף" }
};

export default function LanguagesEditor({ languages = [], setLanguages }) {
  const { locale } = useLocaleContext();
  const t = translations[locale];
  const add = () => setLanguages([...languages, { name: "" }]);

  return (
    <section>
      <h3>{t.title}</h3>
      {languages.map((l, i) => (
        <input
          key={i}
          placeholder={t.placeholder}
          value={l.name}
          onChange={e => {
            const copy = [...languages];
            copy[i] = { ...copy[i], name: e.target.value };
            setLanguages(copy);
          }}
        />
      ))}
      <button type="button" onClick={add}>{t.addBtn}</button>
    </section>
  );
}