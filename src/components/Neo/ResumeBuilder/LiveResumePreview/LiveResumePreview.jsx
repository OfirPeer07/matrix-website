import React, { forwardRef } from 'react';
import './LiveResumePreview.css';
import githubIcon from './GitHub.svg';
import linkedinIcon from './Linkedin.svg';
import emailIcon from './Email.svg';
import phoneIcon from './Phone.svg';

const LiveResumePreview = forwardRef(({
  profile,
  contactLinks,
  aboutMe = [],
  skills = [],
  languages = [],
  experience = [],
  projects = [],
  education = [],
  army = {},
  leftColor = '#f0f4f8',
  rightColor = '#e8ebee',
  isPDF = false
}, ref) => {
  // פונקציות עזר
  const formatText = (text) =>
    text ? text.replace(/\n/g, '<br />') : '';

  const renderSafeHTML = (content) => {
    if (!content) return '';
    const hasHTML = /<\/?[a-z][\s\S]*>/i.test(content);
    return hasHTML ? content : formatText(content);
  };

  const sortByDateDescending = (arr) => {
    if (!arr) return [];
    return [...arr].sort((a, b) => {
      const parseEnd = (item) =>
        item?.end?.toLowerCase?.() === 'present'
          ? Infinity
          : parseInt(item.end) || -Infinity;
      return parseEnd(b) - parseEnd(a);
    });
  };

  const renderList = (items, renderFn) =>
    items?.length > 0 && (
      <section className="entry-section">
        {renderFn(items)}
      </section>
    );

  const isProfileFilled = profile?.firstName || profile?.lastName || profile?.role || (profile?.roles?.length > 0);
  const isContactFilled = Object.values(contactLinks).some(val => val);
  const isArmyFilled = army?.role || army?.city || army?.start || army?.end || army?.description;
  const shouldRenderPreview = isProfileFilled || isContactFilled || aboutMe.length || skills.length || languages.length || experience.length || projects.length || education.length || isArmyFilled;

  if (!shouldRenderPreview) return null;

  return (
    <div
      ref={ref}
      className={`live-resume two-columns ${isPDF ? 'pdf-mode' : ''}`}
      dir={profile.language === 'he' ? 'rtl' : 'ltr'}
    >
      {/* RIGHT SIDE */}
      <aside className="resume-right" style={{ backgroundColor: rightColor }}>
        <div className="profile-header">
          <div className="name-photo-stacked">
            <div className="name-container">
              {profile.firstName && <div className="first-name">{profile.firstName}</div>}
              {profile.lastName && <div className="last-name">{profile.lastName}</div>}
            </div>
            {profile.photo && (
              <img src={profile.photo} alt="profile" className="profile-photo" />
            )}
          </div>
          {profile.role && <div className="role-position"><h2>{profile.role}</h2></div>}
          {profile.roles?.map((r, i) => <p key={i}>{r}</p>)}
        </div>

        <div className="contact-links">
          {contactLinks.github && (
            <div className="contact-item">
              <p><img src={githubIcon} alt="github" className="icon" />
                <a href={contactLinks.github} target="_blank" rel="noopener noreferrer">{contactLinks.github}</a></p>
            </div>
          )}
          {contactLinks.linkedin && (
            <div className="contact-item">
              <p><img src={linkedinIcon} alt="linkedin" className="icon" />
                <a href={contactLinks.linkedin} target="_blank" rel="noopener noreferrer">{contactLinks.linkedin}</a></p>
            </div>
          )}
          {contactLinks.email && (
            <div className="contact-item">
              <p><img src={emailIcon} alt="email" className="icon" />{contactLinks.email}</p>
            </div>
          )}
          {contactLinks.phone && (
            <div className="contact-item">
              <p><img src={phoneIcon} alt="phone" className="icon" />{contactLinks.phone}</p>
            </div>
          )}
        </div>

        {renderList(projects, (list) => (
          <>
            <h2>GitHub Projects</h2>
            {list.map((p, i) => (
              <div key={i} className="entry">
                <strong>{p.name}</strong>
                {p.subtitle && <h4 className="project-subtitle">{p.subtitle}</h4>}
                <div dangerouslySetInnerHTML={{ __html: renderSafeHTML(p.description) }} />
                {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer">{p.link}</a>}
              </div>
            ))}
          </>
        ))}

        {renderList(skills, (list) => (
          <>
            <h2>Skills</h2>
            {list.map((s, i) => (
              <p key={i}><strong>{s.name}</strong> - {'✰'.repeat(s.level || 1)}</p>
            ))}
          </>
        ))}

        {renderList(languages, (list) => (
          <>
            <h2>Languages</h2>
            {list.map((l, i) => (
              <p key={i}><strong>{l.name}</strong> - {'✰'.repeat(l.level || 1)}</p>
            ))}
          </>
        ))}
      </aside>

      <div className="divider-flex" />

      {/* LEFT SIDE */}
      <main className="resume-left" style={{ backgroundColor: leftColor }}>
        {renderList(aboutMe, (list) => (
          <>
            <h2>About Me</h2>
            <div className="entry">
              {list.map((html, i) => (
                <div key={i} dangerouslySetInnerHTML={{ __html: renderSafeHTML(html) }} />
              ))}
            </div>
          </>
        ))}

        {renderList(sortByDateDescending(experience), (list) => (
          <>
            <h2>Experience</h2>
            {list.map((exp, i) => (
              <div key={i} className="entry">
                <div className="exp-title">
                  <span><strong>{exp.role}</strong>, {exp.company}</span>
                  <span className="exp-dates">{exp.start} - {exp.end}</span>
                </div>
                <div dangerouslySetInnerHTML={{ __html: renderSafeHTML(exp.description) }} />
              </div>
            ))}
          </>
        ))}

        {renderList(sortByDateDescending(education), (list) => (
          <>
            <h2>Education</h2>
            {list.map((edu, i) => (
              <div key={i} className="entry">
                <div className="edu-title">
                  <span><strong>{edu.school}</strong>, {edu.city}</span>
                  <span className="edu-dates">{edu.start} - {edu.end}</span>
                </div>
                {edu.degree && <div>{edu.degree}</div>}
                {edu.description && <div dangerouslySetInnerHTML={{ __html: renderSafeHTML(edu.description) }} />}
              </div>
            ))}
          </>
        ))}

        {isArmyFilled && (
          <section className="entry-section">
            <h2>Military Service</h2>
            <div className="entry">
              <div className="army-title">
                <span>
                  {army.role && <strong>{army.role}</strong>}
                  {army.role && army.city && ', '}
                  {army.city}
                </span>
                <span className="army-dates">{army.start} - {army.end}</span>
              </div>
              <div dangerouslySetInnerHTML={{ __html: renderSafeHTML(army.description) }} />
            </div>
          </section>
        )}
      </main>
    </div>
  );
});

export default LiveResumePreview;
