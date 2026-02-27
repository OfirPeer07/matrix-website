import { useLocaleContext } from "../../../../context/LocaleContext";

const translations = {
  en: { title: "About" },
  he: { title: "אודות" }
};

export default function AboutMeEditor({ value = [], onChange }) {
  const { locale } = useLocaleContext();
  const t = translations[locale];
  return (
    <section>
      <h3>{t.title}</h3>
      <textarea
        value={value.join("\n")}
        onChange={e => onChange(e.target.value.split("\n"))}
      />
    </section>
  );
}