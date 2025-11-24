import React from 'react';
import { Phone, Mail, MessageCircle, Clock, Linkedin, Github } from 'lucide-react';
import './ContactUs.css';

const ContactUs = () => {
  const phoneNumber = "+972504082153";
  const email = "ofirpeer07@gmail.com";
  const whatsappNumber = "+972504082153";
  const linkedinProfile = "ofir-peer-658506210";
  const githubProfile = "https://github.com/ofirpeer"; // עדכן ל-GitHub שלך

  const containerStyle = {
    maxWidth: '650px',
    margin: '0 auto',
    padding: '2rem',
    backgroundColor: '#1e1e1e',
    borderRadius: '8px',
    boxShadow: '0 0 15px rgba(0, 255, 0, 0.1)',
    color: '#e0e0e0',
    direction: 'ltr',
  };

  const titleStyle = {
    color: '#0f0',
    textAlign: 'center',
    marginBottom: '2rem',
    fontSize: '2rem',
    textShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
  };

  const contactMethodsStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  };

  const contactMethodStyle = {
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem',
    backgroundColor: '#2a2a2a',
    borderRadius: '8px',
    textDecoration: 'none',
    color: '#e0e0e0',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
  };

  const contactMethodHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.5rem',
  };

  const iconStyle = {
    marginLeft: '1rem',
    color: '#0f0',
    transition: 'transform 0.3s ease',
  };

  const textStyle = {
    fontSize: '1.1rem',
  };

  const descriptionStyle = {
    fontSize: '0.9rem',
    color: '#aaa',
    marginTop: '0.5rem',
  };

  const workingHoursStyle = {
    marginTop: '2rem',
    padding: '1rem',
    backgroundColor: '#2a2a2a',
    borderRadius: '8px',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.backgroundColor = '#3a3a3a';
    e.currentTarget.style.transform = 'translateY(-3px)';
    e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 255, 0, 0.3)';
    e.currentTarget.querySelector('svg').style.transform = 'scale(1.2)';
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.backgroundColor = '#2a2a2a';
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    e.currentTarget.querySelector('svg').style.transform = 'scale(1)';
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Let’s&nbsp;&nbsp;&nbsp;Connect</h1>
      <div style={contactMethodsStyle}>
        <a 
          href={`tel:${phoneNumber}`} 
          style={contactMethodStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          aria-label="Call me"
        >
          <div style={contactMethodHeaderStyle}>
            <Phone size={24} style={iconStyle} aria-hidden="true" />
            <span style={textStyle}>&nbsp;&nbsp;&nbsp;&nbsp;{phoneNumber}</span>
          </div>
          <span style={descriptionStyle}>Call&nbsp;&nbsp;me&nbsp;&nbsp;directly&nbsp;&nbsp;for&nbsp;&nbsp;professional&nbsp;&nbsp;inquiries</span>
        </a>
        <a 
          href={`mailto:${email}`} 
          style={contactMethodStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          aria-label="Send me an email"
        >
          <div style={contactMethodHeaderStyle}>
            <Mail size={24} style={iconStyle} aria-hidden="true" />
            <span style={textStyle}>&nbsp;&nbsp;&nbsp;&nbsp;{email}</span>
          </div>
          <span style={descriptionStyle}>Send&nbsp;&nbsp;me&nbsp;&nbsp;an&nbsp;&nbsp;email&nbsp;&nbsp;for&nbsp;&nbsp;collaborations&nbsp;&nbsp;or&nbsp;&nbsp;project&nbsp;&nbsp;discussions</span>
        </a>
        <a 
          href={`https://wa.me/${whatsappNumber}`} 
          style={contactMethodStyle} 
          target="_blank" 
          rel="noopener noreferrer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          aria-label="Contact me on WhatsApp"
        >
          <div style={contactMethodHeaderStyle}>
            <MessageCircle size={24} style={iconStyle} aria-hidden="true" />
            <span style={textStyle}>&nbsp;&nbsp;&nbsp;&nbsp;WhatsApp</span>
          </div>
          <span style={descriptionStyle}>Message&nbsp;&nbsp;me&nbsp;&nbsp;on&nbsp;&nbsp;WhatsApp&nbsp;&nbsp;for&nbsp;&nbsp;quick&nbsp;&nbsp;communication</span>
        </a>
        <a 
          href={`https://www.linkedin.com/in/${linkedinProfile}`} 
          style={contactMethodStyle} 
          target="_blank" 
          rel="noopener noreferrer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          aria-label="Connect with me on LinkedIn"
        >
          <div style={contactMethodHeaderStyle}>
            <Linkedin size={24} style={iconStyle} aria-hidden="true" />
            <span style={textStyle}>&nbsp;&nbsp;&nbsp;&nbsp;LinkedIn</span>
          </div>
          <span style={descriptionStyle}>Connect&nbsp;&nbsp;with&nbsp;&nbsp;me&nbsp;&nbsp;on&nbsp;&nbsp;LinkedIn&nbsp;&nbsp;for&nbsp;&nbsp;professional&nbsp;&nbsp;networking</span>
        </a>
        <a 
          href={githubProfile} 
          style={contactMethodStyle} 
          target="_blank" 
          rel="noopener noreferrer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          aria-label="View my GitHub projects"
        >
          <div style={contactMethodHeaderStyle}>
            <Github size={24} style={iconStyle} aria-hidden="true" />
            <span style={textStyle}>&nbsp;&nbsp;&nbsp;&nbsp;GitHub</span>
          </div>
          <span style={descriptionStyle}>Explore&nbsp;&nbsp;my&nbsp;&nbsp;projects&nbsp;&nbsp;and&nbsp;&nbsp;open-source&nbsp;&nbsp;contributions</span>
        </a>
      </div>
      <div style={workingHoursStyle}>
        <Clock size={18} style={{...iconStyle, marginRight: '0.5rem'}} aria-hidden="true" />
        <span style={textStyle}>Available:&nbsp;&nbsp;&nbsp;<span style={descriptionStyle}>Sun–Thu,&nbsp;&nbsp;09:00&nbsp;&nbsp;–&nbsp;&nbsp;19:00</span></span>
      </div>
    </div>
  );
};

export default ContactUs;