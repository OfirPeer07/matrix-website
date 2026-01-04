import "./styles/base.css";
import "./styles/ats.css";

export default function AtsTemplate({
  profile = {},
  contact = {},
  about = [],
  skills = [],
  experience = [],
  projects = [],
  education = []
}) {
  const hasContent = (arr) => Array.isArray(arr) && arr.length > 0;

  return (
    <div className="live-resume ats">
      {/* ===== HEADER ===== */}
      {(profile.firstName || profile.lastName) && (
        <header>
          <h1>{profile.firstName} {profile.lastName}</h1>
          {profile.role && <p>{profile.role}</p>}
        </header>
      )}

      {/* ===== CONTACT ===== */}
      {Object.values(contact).some(Boolean) && (
        <section>
          <h2>Contact</h2>
          {contact.email && <p>{contact.email}</p>}
          {contact.phone && <p>{contact.phone}</p>}
          {contact.linkedin && <p>{contact.linkedin}</p>}
          {contact.github && <p>{contact.github}</p>}
        </section>
      )}

      {/* ===== SUMMARY ===== */}
      {hasContent(about) && (
        <section>
          <h2>Summary</h2>
          {about.map((p, i) => <p key={i}>{p}</p>)}
        </section>
      )}

      {/* ===== EXPERIENCE ===== */}
      {hasContent(experience) && (
        <section>
          <h2>Experience</h2>

          {experience.map((exp, i) => (
            <div key={i}>
              <p>
                <strong>{exp.role || exp.title}</strong>
                {exp.company && ` — ${exp.company}`}
                {(exp.start || exp.end) &&
                  ` | ${exp.start}${exp.end ? ` - ${exp.end}` : ""}`}
              </p>

              {exp.description && (
                <ul>
                  {exp.description
                    .split("\n")
                    .filter(Boolean)
                    .map((line, idx) => (
                      <li key={idx}>
                        {line.replace(/^•\s*/, "")}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* ===== PROJECTS ===== */}
      {hasContent(projects) && (
        <section>
          <h2>Projects</h2>

          {projects.map((proj, i) => (
            <div key={i}>
              <p><strong>{proj.name}</strong></p>

              {proj.description && (
                <ul>
                  {proj.description
                    .split("\n")
                    .filter(Boolean)
                    .map((line, idx) => (
                      <li key={idx}>
                        {line.replace(/^•\s*/, "")}
                      </li>
                    ))}
                </ul>
              )}

              {proj.link && <p>{proj.link}</p>}
            </div>
          ))}
        </section>
      )}

      {/* ===== EDUCATION ===== */}
      {hasContent(education) && (
        <section>
          <h2>Education</h2>

          {education.map((edu, i) => (
            <div key={i}>
              <p>
                <strong>{edu.school}</strong>
                {edu.degree && ` — ${edu.degree}`}
                {(edu.start || edu.end) &&
                  ` | ${edu.start}${edu.end ? ` - ${edu.end}` : ""}`}
              </p>

              {edu.description && (
                <ul>
                  {edu.description
                    .split("\n")
                    .filter(Boolean)
                    .map((line, idx) => (
                      <li key={idx}>
                        {line.replace(/^•\s*/, "")}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* ===== SKILLS ===== */}
      {hasContent(skills) && (
        <section>
          <h2>Skills</h2>
          <p>{skills.map((s) => s.name).join(", ")}</p>
        </section>
      )}
    </div>
  );
}
