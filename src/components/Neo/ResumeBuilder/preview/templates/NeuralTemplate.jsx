import { useLocaleContext } from "../../../../../context/LocaleContext";
import "../templates/styles/base.css";
import "../templates/styles/neural.css";
import { groupBulletLines, stripMarker } from "../../utils/resumeUtils";

const translations = {
    en: {
        profile: "Profile",
        experience: "Experience",
        projects: "Projects",
        education: "Education",
        army: "Military Service",
        contact: "Contact",
        skills: "Skills",
        languages: "Languages",
        email: "Email",
        phone: "Phone",
        linkedin: "LinkedIn",
        github: "GitHub"
    },
    he: {
        profile: "תיק אישי",
        experience: "משימות וניסיון",
        projects: "פרויקטים",
        education: "הכשרה",
        army: "שירות צבאי",
        contact: "תקשורת",
        skills: "מיומנויות",
        languages: "שפות",
        email: "אימייל",
        phone: "טלפון",
        linkedin: "לינקדין",
        github: "גיטהאב"
    }
};

export default function NeuralTemplate({
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
        army?.role || army?.start || army?.end || army?.description;

    return (
        <div className="live-resume neural">
            {/* ===== HEADER ===== */}
            <header className="neural-header">
                <div>
                    <h1>
                        {profile.firstName} {profile.lastName}
                    </h1>
                </div>
                {profile.role && <p className="neural-role">{profile.role}</p>}
            </header>

            {/* ===== GRID ===== */}
            <section className="neural-grid">
                {/* ================= MAIN COLUMN ================= */}
                <div className="neural-main">
                    {hasContent(about) && (
                        <section>
                            <h2 className="neural-section-title">{t.profile}</h2>
                            {about.map((p, i) => (
                                <p key={i} style={{ whiteSpace: "pre-line" }}>{p}</p>
                            ))}
                        </section>
                    )}

                    {hasContent(experience) && (
                        <section>
                            <h2 className="neural-section-title">{t.experience}</h2>

                            {experience.map((exp, i) => (
                                <div key={i} className="neural-entry">
                                    <div className="neural-entry-header">
                                        <span className="neural-entry-title">
                                            {exp.role || exp.title}
                                            {exp.company && (
                                                <span className="neural-entry-company">
                                                    {" "}— {exp.company}
                                                </span>
                                            )}
                                        </span>

                                        {(exp.start || exp.end) && (
                                            <span className="neural-entry-dates">
                                                {exp.start}
                                                {exp.end && ` – ${exp.end}`}
                                            </span>
                                        )}
                                    </div>

                                    {exp.description && (
                                        <ul className="neural-bullets">
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
                            <h2 className="neural-section-title">{t.projects}</h2>

                            {projects.map((proj, i) => (
                                <div key={i} className="neural-entry">
                                    <div className="neural-entry-header">
                                        <span className="neural-entry-title">{proj.name}</span>
                                    </div>

                                    {proj.description && (
                                        <ul className="neural-bullets">
                                            {groupBulletLines(proj.description).map((bullet, idx) => (
                                                <li key={idx} style={{ whiteSpace: "pre-line" }}>
                                                    {stripMarker(bullet)}
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {proj.link && (
                                        <p className="muted" style={{ fontSize: '11px', fontFamily: 'monospace' }}>
                                            {proj.link}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </section>
                    )}

                    {hasContent(education) && (
                        <section>
                            <h2 className="neural-section-title">{t.education}</h2>

                            {education.map((edu, i) => (
                                <div key={i} className="neural-entry">
                                    <div className="neural-entry-header">
                                        <span className="neural-entry-title">
                                            {edu.school}
                                            {edu.degree && (
                                                <span className="neural-entry-company">
                                                    {" "}— {edu.degree}
                                                </span>
                                            )}
                                        </span>

                                        {(edu.start || edu.end) && (
                                            <span className="neural-entry-dates">
                                                {edu.start}
                                                {edu.end && ` – ${edu.end}`}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </section>
                    )}

                    {isArmyFilled && (
                        <section>
                            <h2 className="neural-section-title">{t.army}</h2>
                            <div className="neural-entry">
                                <div className="neural-entry-header">
                                    <span className="neural-entry-title">{army.role}</span>
                                    {(army.start || army.end) && (
                                        <span className="neural-entry-dates">
                                            {army.start}
                                            {army.end && ` – ${army.end}`}
                                        </span>
                                    )}
                                </div>
                                {army.description && (
                                    <p style={{ whiteSpace: "pre-line" }}>{army.description}</p>
                                )}
                            </div>
                        </section>
                    )}
                </div>

                {/* ================= SIDE COLUMN ================= */}
                <aside className="neural-side">
                    {Object.values(contact).some(Boolean) && (
                        <section>
                            <h2 className="neural-section-title">{t.contact}</h2>
                            <div className="neural-contact-list">
                                {contact.email && (
                                    <div className="neural-contact-item">
                                        <span className="neural-contact-label">{t.email}</span>
                                        <span className="neural-contact-value">{contact.email}</span>
                                    </div>
                                )}
                                {contact.phone && (
                                    <div className="neural-contact-item">
                                        <span className="neural-contact-label">{t.phone}</span>
                                        <span className="neural-contact-value">{contact.phone}</span>
                                    </div>
                                )}
                                {contact.linkedin && (
                                    <div className="neural-contact-item">
                                        <span className="neural-contact-label">{t.linkedin}</span>
                                        <span className="neural-contact-value">{contact.linkedin}</span>
                                    </div>
                                )}
                                {contact.github && (
                                    <div className="neural-contact-item">
                                        <span className="neural-contact-label">{t.github}</span>
                                        <span className="neural-contact-value">{contact.github}</span>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {hasContent(skills) && (
                        <section>
                            <h2 className="neural-section-title">{t.skills}</h2>
                            <div className="neural-badge-list">
                                {skills.map((s, i) => (
                                    <span key={i} className="neural-badge">
                                        {s.name}
                                    </span>
                                ))}
                            </div>
                        </section>
                    )}

                    {hasContent(languages) && (
                        <section>
                            <h2 className="neural-section-title">{t.languages}</h2>
                            {languages.map((l, i) => (
                                <div key={i} className="neural-lang-item">
                                    <span>{l.name}</span>
                                    <div className="neural-lang-dots">
                                        {[1, 2, 3, 4, 5].map((dot) => (
                                            <div
                                                key={dot}
                                                className={`neural-dot ${dot <= (l.level || 0) ? "filled" : ""}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </section>
                    )}
                </aside>
            </section>
        </div>
    );
}
