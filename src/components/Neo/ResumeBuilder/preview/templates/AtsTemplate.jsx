import { useLocaleContext } from "../../../../../context/LocaleContext";
import "./styles/base.css";
import "./styles/ats.css";
import { groupBulletLines, stripMarker } from "../../utils/resumeUtils";

const translations = {
  en: {
    contact: "Contact",
    summary: "Summary",
    experience: "Experience",
    projects: "Projects",
    education: "Education",
    skills: "Skills"
  },
  he: {
    contact: "צור קשר",
    summary: "תמצית",
    experience: "ניסיון תעסוקתי",
    projects: "פרויקטים",
    education: "השכלה",
    skills: "מיומנויות"
  }
};

export default function AtsTemplate({
  profile = {},
  contact = {},
  about = [],
  skills = [],
  experience = [],
  projects = [],
  education = []
}) {
  const { locale } = useLocaleContext();
  const t = translations[locale];
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
          <h2>{t.contact}</h2>
          {contact.email && <p>{contact.email}</p>}
          {contact.phone && <p>{contact.phone}</p>}
          {contact.linkedin && <p>{contact.linkedin}</p>}
          {contact.github && <p>{contact.github}</p>}
        </section>
      )}

      {/* ===== SUMMARY ===== */}
      {hasContent(about) && (
        <section>
          <h2>{t.summary}</h2>
          {about.map((p, i) => (
            <p key={i} style={{ whiteSpace: "pre-line" }}>{p}</p>
          ))}
        </section>
      )}

      {/* ===== EXPERIENCE ===== */}
      {hasContent(experience) && (
        <section>
          <h2>{t.experience}</h2>

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

      {/* ===== PROJECTS ===== */}
      {hasContent(projects) && (
        <section>
          <h2>{t.projects}</h2>

          {projects.map((proj, i) => (
            <div key={i}>
              <p><strong>{proj.name}</strong></p>

              {proj.description && (
                <ul>
                  {groupBulletLines(proj.description).map((bullet, idx) => (
                    <li key={idx} style={{ whiteSpace: "pre-line" }}>
                      {stripMarker(bullet)}
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
          <h2>{t.education}</h2>

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

      {/* ===== SKILLS ===== */}
      {hasContent(skills) && (
        <section>
          <h2>{t.skills}</h2>
          <p>{skills.map((s) => s.name).join(", ")}</p>
        </section>
      )}
    </div>
  );
}
