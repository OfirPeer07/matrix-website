import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function PrintResume({
  profile,
  contactLinks,
  aboutMe,
  skills,
  languages,
  experience,
  projects,
  education,
  army,
  leftColor = '#f0f4f8',
  rightColor = '#e8ebee',
}) {
  const printRef = useRef();

  const handleExportPDF = () => {
    const input = printRef.current;
    if (!input) return;

    html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('resume.pdf');
    });
  };

  // פונקציה עזר להמרת טקסט עם שורות חדשות ל־<br>
  const formatText = (text) => {
    if (!text) return '';
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div>
      <button onClick={handleExportPDF} style={{ marginBottom: '20px', padding: '10px 20px' }}>
        Export to PDF
      </button>

      <div
        ref={printRef}
        style={{
          width: '210mm',
          minHeight: '297mm',
          padding: '20mm',
          backgroundColor: '#fff',
          boxSizing: 'border-box',
          fontFamily: 'Segoe UI, sans-serif',
          color: '#222',
          display: 'flex',
          boxShadow: '0 0 5px rgba(0,0,0,0.1)',
          margin: 'auto',
        }}
      >
        {/* RIGHT SIDE */}
        <div
          style={{
            width: '40%',
            backgroundColor: rightColor,
            padding: '20px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ margin: '0 0 10px' }}>
              {profile.firstName} {profile.lastName}
            </h1>
            <h3 style={{ margin: 0 }}>{profile.role}</h3>
            {profile.roles && profile.roles.length > 0 && (
              <div style={{ marginTop: '10px' }}>
                {profile.roles.map((r, i) => (
                  <div key={i}>{r}</div>
                ))}
              </div>
            )}
            {profile.photo && (
              <img
                src={profile.photo}
                alt="profile"
                style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginTop: '15px',
                  border: '2px solid #647282',
                }}
              />
            )}
          </div>

          <div>
            <h2>Contact</h2>
            {contactLinks.github && (
              <div>
                GitHub: <a href={contactLinks.github}>{contactLinks.github}</a>
              </div>
            )}
            {contactLinks.linkedin && (
              <div>
                LinkedIn: <a href={contactLinks.linkedin}>{contactLinks.linkedin}</a>
              </div>
            )}
            {contactLinks.email && <div>Email: {contactLinks.email}</div>}
            {contactLinks.phone && <div>Phone: {contactLinks.phone}</div>}
          </div>

          {projects && projects.length > 0 && (
            <div>
              <h2>GitHub Projects</h2>
              {projects.map((p, i) => (
                <div key={i} style={{ marginBottom: '10px' }}>
                  <strong>{p.name}</strong>
                  {p.subtitle && <div>{p.subtitle}</div>}
                  <div>{formatText(p.description)}</div>
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noopener noreferrer">
                      {p.link}
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {skills && skills.length > 0 && (
            <div>
              <h2>Skills</h2>
              {skills.map((s, i) => (
                <div key={i}>
                  <strong>{s.name}</strong> - {'✰'.repeat(s.level || 1)}
                </div>
              ))}
            </div>
          )}

          {languages && languages.length > 0 && (
            <div>
              <h2>Languages</h2>
              {languages.map((l, i) => (
                <div key={i}>
                  <strong>{l.name}</strong> - {'✰'.repeat(l.level || 1)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DIVIDER */}
        <div
          style={{
            width: '3px',
            background: 'linear-gradient(to bottom, #060000, #999, #333)',
            margin: '0 10px',
            boxShadow: '0 0 5px rgba(0,0,0,0.5)',
          }}
        />

        {/* LEFT SIDE */}
        <div
          style={{
            flex: 1,
            backgroundColor: leftColor,
            padding: '20px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {aboutMe && aboutMe.length > 0 && (
            <div>
              <h2>About Me</h2>
              {aboutMe.map((text, i) => (
                <p key={i}>{formatText(text)}</p>
              ))}
            </div>
          )}

          {experience && experience.length > 0 && (
            <div>
              <h2>Experience</h2>
              {experience.map((exp, i) => (
                <div key={i} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>{exp.role}</strong>, {exp.company}
                    <span>
                      {exp.start} - {exp.end}
                    </span>
                  </div>
                  <div>{formatText(exp.description)}</div>
                </div>
              ))}
            </div>
          )}

          {education && education.length > 0 && (
            <div>
              <h2>Education</h2>
              {education.map((edu, i) => (
                <div key={i} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>{edu.school}</strong>, {edu.city}
                    <span>
                      {edu.start} - {edu.end}
                    </span>
                  </div>
                  {edu.degree && <div>{edu.degree}</div>}
                  {edu.details && <div>{formatText(edu.details)}</div>}
                </div>
              ))}
            </div>
          )}

          {(army.role || army.city || army.start || army.end || army.description) && (
            <div>
              <h2>Military Service</h2>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{army.role}</strong>, {army.city}
                <span>
                  {army.start} - {army.end}
                </span>
              </div>
              <div>{formatText(army.description)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
