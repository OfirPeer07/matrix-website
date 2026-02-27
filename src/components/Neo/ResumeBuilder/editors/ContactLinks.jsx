import { useLocaleContext } from "../../../../context/LocaleContext";

const translations = {
  en: { title: "Contact", email: "Email", phone: "Phone" },
  he: { title: "צור קשר", email: "אימייל", phone: "טלפון" }
};

export default function ContactLinks({ value = {}, onChange }) {
  const { locale } = useLocaleContext();
  const t = translations[locale];
  const { email = "", phone = "" } = value;

  return (
    <section>
      <h3>{t.title}</h3>
      <input
        placeholder={t.email}
        value={email}
        onChange={e => onChange({ ...value, email: e.target.value })}
      />
      <input
        placeholder={t.phone}
        value={phone}
        onChange={e => onChange({ ...value, phone: e.target.value })}
      />
    </section>
  );
}