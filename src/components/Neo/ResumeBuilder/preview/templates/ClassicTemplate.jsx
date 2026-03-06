import { useLocaleContext } from "../../../../../context/LocaleContext";
import "../templates/styles/base.css";
import "../templates/styles/classic.css";
import { groupBulletLines, stripMarker } from "../../utils/resumeUtils";

const translations = {
  en: {
    contact: "Contact",
    skills: "Skills",
    languages: "Languages",
    about: "About Me",
    experience: "Experience",
    projects: "Projects",
    education: "Education",
    army: "Military Service"
  },
  he: {
    contact: "צור קשר",
    skills: "מיומנויות",
    languages: "שפות",
    about: "אודות",
    experience: "ניסיון תעסוקתי",
    projects: "פרויקטים",
    education: "השכלה",
    army: "שירות צבאי / לאומי"
  }
};

export default function ClassicTemplate({
  profile = {},
  contact = {},
  about = [],
  skills = [],
  languages = [],
  experience = [],
  projects = [],
  education = [],
  army = {}
}) {
  const { locale } = useLocaleContext();
  const t = translations[locale];
  const hasContent = (arr) => Array.isArray(arr) && arr.length > 0;

  const isArmyFilled =
    army?.enabled &&
    (army.role || army.start || army.end || army.description);

  return (
    <div className="live-resume classic two-columns">
      {/* ================= RIGHT ================= */}
      <aside className="resume-right">
        {(profile.firstName || profile.lastName) && (
          <header className="profile-header">
            <h1>{profile.firstName} {profile.lastName}</h1>
            {profile.role && <h2>{profile.role}</h2>}
          </header>
        )}

        {Object.values(contact).some(Boolean) && (
          <section>
            <h2>{t.contact}</h2>
            {contact.email && <p>{contact.email}</p>}
            {contact.phone && <p>{contact.phone}</p>}
            {contact.linkedin && <p>{contact.linkedin}</p>}
            {contact.github && <p>{contact.github}</p>}
          </section>
        )}

        {hasContent(skills) && (
          <section>
            <h2>{t.skills}</h2>
            {skills.map((s, i) => (
              <p key={i}>
                {s.name}{s.level && ` (${s.level}/5)`}
              </p>
            ))}
          </section>
        )}

        {hasContent(languages) && (
          <section>
            <h2>{t.languages}</h2>
            {languages.map((l, i) => (
              <p key={i}>
                {l.name}{l.level && ` (${l.level}/5)`}
              </p>
            ))}
          </section>
        )}
      </aside>

      <div className="divider-flex" />

      {/* ================= LEFT ================= */}
      <main className="resume-left">
        {hasContent(about) && (
          <section>
            <h2>{t.about}</h2>
            {about.map((p, i) => (
              <p key={i} style={{ whiteSpace: "pre-line" }}>{p}</p>
            ))}
          </section>
        )}

        {hasContent(experience) && (
          <section>
            <h2>{t.experience}</h2>
            {experience.map((exp, i) => (
              <div key={i} className="entry">
                <div className="entry-header">
                  <span className="entry-title">
                    {exp.role || exp.title}
                    {exp.company && <span className="entry-company"> — {exp.company}</span>}
                  </span>
                  {(exp.start || exp.end) && (
                    <span className="entry-dates">
                      {exp.start}{exp.end && ` – ${exp.end}`}
                    </span>
                  )}
                </div>

                {exp.description && (
                  <ul className="entry-bullets">
                    {groupBulletLines(exp.description).map((bullet, idx) => (
                      <li key={idx} style={{ whiteSpace: "pre-line" }}>
                        {stripMarker(bullet)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {hasContent(projects) && (
          <section>
            <h2>{t.projects}</h2>
            {projects.map((proj, i) => (
              <div key={i} className="entry">
                <div className="entry-header">
                  <span className="entry-title">{proj.name}</span>
                </div>

                {proj.description && (
                  <ul className="entry-bullets">
                    {groupBulletLines(proj.description).map((bullet, idx) => (
                      <li key={idx} style={{ whiteSpace: "pre-line" }}>
                        {stripMarker(bullet)}
                      </li>
                    ))}
                  </ul>
                )}

                {proj.link && <p className="muted">{proj.link}</p>}
              </div>
            ))}
          </section>
        )}

        {hasContent(education) && (
          <section>
            <h2>{t.education}</h2>
            {education.map((edu, i) => (
              <div key={i} className="entry">
                <div className="entry-header">
                  <span className="entry-title">
                    {edu.school}
                    {edu.degree && <span className="entry-company"> — {edu.degree}</span>}
                  </span>
                  {(edu.start || edu.end) && (
                    <span className="entry-dates">
                      {edu.start}{edu.end && ` – ${edu.end}`}
                    </span>
                  )}
                </div>

                {edu.description && (
                  <ul className="entry-bullets">
                    {groupBulletLines(edu.description).map((bullet, idx) => (
                      <li key={idx} style={{ whiteSpace: "pre-line" }}>
                        {stripMarker(bullet)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {isArmyFilled && (
          <section>
            <h2>{t.army}</h2>
            <div className="entry">
              <div className="entry-header">
                <span className="entry-title">{army.role}</span>
                {(army.start || army.end) && (
                  <span className="entry-dates">
                    {army.start}{army.end && ` – ${army.end}`}
                  </span>
                )}
              </div>

              {army.description && (
                <ul className="entry-bullets">
                  {groupBulletLines(army.description).map((bullet, idx) => (
                    <li key={idx} style={{ whiteSpace: "pre-line" }}>
                      {stripMarker(bullet)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
