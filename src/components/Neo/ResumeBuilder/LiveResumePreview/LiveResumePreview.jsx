import React, { forwardRef } from 'react';
import './LiveResumePreview.css';
import githubIcon from './GitHub.svg';
import linkedinIcon from './Linkedin.svg';
import emailIcon from './Email.svg';
import phoneIcon from './Phone.svg';

const LiveResumePreview = forwardRef(({
  profile,
  contactLinks,
  aboutMe,
  skills,
  languages,
  experience,
  projects,
  education,
  army,
  leftColor,
  rightColor,
  isPDF = false
}, ref) => {

  function formatText(text) {
    if (!text) return '';
    return text.replace(/\n/g, '<br />');
  }

  function renderSafeHTML(content) {
    if (!content) return '';
    const looksLikeHTML = /<\/?[a-z][\s\S]*>/i.test(content);
    return looksLikeHTML ? content : formatText(content);
  }

  function sortByDateDescending(arr) {
    if (!arr) return [];
    return [...arr].sort((a, b) => {
      const getEnd = (item) => {
        if (!item.end) return -Infinity;
        if (typeof item.end === 'string' && item.end.toLowerCase() === 'present') return Infinity;
        return parseInt(item.end);
      };
      return getEnd(b) - getEnd(a);
    });
  }

  return (
    <div
      ref={ref}
      className={`live-resume two-columns ${isPDF ? 'pdf-mode' : ''}`}
      dir={profile.language === 'he' ? 'rtl' : 'ltr'}
    >
      {/* Right Side */}
      <div className="resume-right" style={{ backgroundColor: rightColor || '#e8ebee' }}>
        <div className="profile-header">
          <div className="name-photo-stacked">
            <div className="name-container">
              {profile.firstName && <div className="first-name">{profile.firstName}</div>}
              {profile.lastName && <div className="last-name">{profile.lastName}</div>}
            </div>
            {profile.photo && <img src={profile.photo} alt="profile" className="profile-photo" />}
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

        {projects?.length > 0 && (
          <section className="projects">
            <h2><u>GitHub Projects:</u></h2>
            {projects.map((p, i) => (
              <div key={i} className="entry">
                <p><strong>{p.name}</strong></p>
                {p.subtitle && <h4 className="project-subtitle">{p.subtitle}</h4>}
                <div dangerouslySetInnerHTML={{ __html: renderSafeHTML(p.description) }} />
                {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer">{p.link}</a>}
              </div>
            ))}
          </section>
        )}

        {skills?.length > 0 && (
          <div className="skills">
            <h2><u>Skills:</u></h2>
            {skills.map((s, i) => (
              <p key={i}><strong>{s.name}</strong> - {'✰'.repeat(s.level || 1)}</p>
            ))}
          </div>
        )}

        {languages?.length > 0 && (
          <div className="languages">
            <h2><u>Languages:</u></h2>
            {languages.map((l, i) => (
              <p key={i}><strong>{l.name}</strong> - {'✰'.repeat(l.level || 1)}</p>
            ))}
          </div>
        )}
      </div>

      <div className="divider-flex"></div>

      {/* Left Side */}
      <div className="resume-left" style={{ backgroundColor: leftColor || '#f0f4f8' }}>
        {aboutMe?.length > 0 && (
          <section className="about-me">
            <h2><u>About Me:</u></h2>
            <div className="entry">
              {aboutMe.map((html, i) => (
                <div key={i} dangerouslySetInnerHTML={{ __html: renderSafeHTML(html) }} />
              ))}
            </div>
          </section>
        )}

        {experience?.length > 0 && (
          <section className="experience">
            <h2><u>Experience:</u></h2>
            {sortByDateDescending(experience).map((exp, i) => (
              <div key={i} className="entry">
                <div className="exp-title">
                  <span><strong>{exp.role}</strong>, {exp.company}.</span>
                  <span className="exp-dates">{exp.start} - {exp.end}</span>
                </div>
                <div dangerouslySetInnerHTML={{ __html: renderSafeHTML(exp.description) }} />
              </div>
            ))}
          </section>
        )}

        {education?.length > 0 && (
          <section className="education">
            <h2><u>Education:</u></h2>
            {sortByDateDescending(education).map((edu, i) => (
              <div key={i} className="entry">
                <div className="edu-title">
                  <span>
                    <strong>{edu.school && `${edu.school}, `}</strong>{edu.city}.
                  </span>
                  <span className="edu-dates">{edu.start} - {edu.end}</span>
                </div>
                {edu.degree && <div className="edu-degree">{edu.degree}</div>}
                {edu.details && <div dangerouslySetInnerHTML={{ __html: renderSafeHTML(edu.details) }} />}
              </div>
            ))}
          </section>
        )}

        {(army.role || army.city || army.start || army.end || army.description) && (
          <section className="army">
            <h2><u>Military Service:</u></h2>
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
      </div>
    </div>
  );
});

export default LiveResumePreview;
