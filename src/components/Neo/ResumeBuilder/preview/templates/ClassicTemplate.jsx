import "../templates/styles/base.css";
import "../templates/styles/classic.css";

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
            <h2>Contact</h2>
            {contact.email && <p>{contact.email}</p>}
            {contact.phone && <p>{contact.phone}</p>}
            {contact.linkedin && <p>{contact.linkedin}</p>}
            {contact.github && <p>{contact.github}</p>}
          </section>
        )}

        {hasContent(skills) && (
          <section>
            <h2>Skills</h2>
            {skills.map((s, i) => (
              <p key={i}>
                {s.name}{s.level && ` (${s.level}/5)`}
              </p>
            ))}
          </section>
        )}

        {hasContent(languages) && (
          <section>
            <h2>Languages</h2>
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
            <h2>About Me</h2>
            {about.map((p, i) => <p key={i}>{p}</p>)}
          </section>
        )}

        {hasContent(experience) && (
          <section>
            <h2>Experience</h2>
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
                    {exp.description.split("\n").filter(Boolean).map((line, idx) => (
                      <li key={idx}>{line.replace(/^•\s*/, "")}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {hasContent(projects) && (
          <section>
            <h2>Projects</h2>
            {projects.map((proj, i) => (
              <div key={i} className="entry">
                <div className="entry-header">
                  <span className="entry-title">{proj.name}</span>
                </div>

                {proj.description && (
                  <ul className="entry-bullets">
                    {proj.description.split("\n").filter(Boolean).map((line, idx) => (
                      <li key={idx}>{line.replace(/^•\s*/, "")}</li>
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
            <h2>Education</h2>
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
                    {edu.description.split("\n").filter(Boolean).map((line, idx) => (
                      <li key={idx}>{line.replace(/^•\s*/, "")}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {isArmyFilled && (
          <section>
            <h2>Military Service</h2>
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
                  {army.description.split("\n").filter(Boolean).map((line, idx) => (
                    <li key={idx}>{line.replace(/^•\s*/, "")}</li>
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
