import { useLocaleContext } from "../../../../context/LocaleContext";

const translations = {
  en: {
    title: "Profile",
    firstName: "First name",
    lastName: "Last name",
    role: "Role"
  },
  he: {
    title: "פרופיל",
    firstName: "שם פרטי",
    lastName: "שם משפחה",
    role: "תפקיד"
  }
};

export default function ProfileHeader({ value = {}, onChange }) {
  const { locale } = useLocaleContext();
  const t = translations[locale];
  const { firstName = "", lastName = "", role = "" } = value;

  return (
    <section>
      <h3>{t.title}</h3>
      <input
        placeholder={t.firstName}
        value={firstName}
        onChange={e => onChange({ ...value, firstName: e.target.value })}
      />
      <input
        placeholder={t.lastName}
        value={lastName}
        onChange={e => onChange({ ...value, lastName: e.target.value })}
      />
      <input
        placeholder={t.role}
        value={role}
        onChange={e => onChange({ ...value, role: e.target.value })}
      />
    </section>
  );
}