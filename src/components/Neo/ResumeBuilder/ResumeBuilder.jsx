// ResumeBuilder.jsx
import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom/client";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./ResumeBuilder.css";
import ProfileHeader from "./ProfileHeader/ProfileHeader";
import ContactLinks from "./ContactLinks/ContactLinks";
import SkillsEditor from "./SkillsEditor/SkillsEditor";
import LanguagesEditor from "./LanguagesEditor/LanguagesEditor";
import AboutMeEditor from "./AboutMeEditor/AboutMeEditor";
import ExperienceEditor from "./ExperienceEditor/ExperienceEditor";
import ProjectsEditor from "./ProjectsEditor/ProjectsEditor";
import EducationEditor from "./EducationEditor/EducationEditor";
import ArmySection from "./ArmySection/ArmySection";
import LiveResumePreview from "./LiveResumePreview/LiveResumePreview";
import TerminalWindow from "./TerminalWindow/TerminalWindow";
import terminalPopupCSS from "./TerminalWindow/TerminalPopupStyle";
import OFAiR from "../OFAiR/OFAiR";

export default function ResumeBuilder() {
  const printRef = useRef();
  const didInit = useRef(false);
  const [isReady, setIsReady] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState(false);

  const [profile, setProfile] = useState({ firstName: "", lastName: "", role: "", photo: "", language: "en", roles: [] });
  const [contactLinks, setContactLinks] = useState({ github: "", linkedin: "", email: "", phone: "" });
  const [skills, setSkills] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [aboutMe, setAboutMe] = useState([]);
  const [experience, setExperience] = useState([]);
  const [projects, setProjects] = useState([]);
  const [education, setEducation] = useState([]);
  const [army, setArmy] = useState({ role: "", city: "", start: "", end: "", description: "" });

  const [terminalMessages, setTerminalMessages] = useState([{ sender: "ofair", text: "👾 Ready to assist." }]);

  const openTerminalWindow = () => {
    const popup = window.open("", "OFAiR Terminal", "width=800,height=600,left=100,top=100");
    if (!popup) return;

    popup.document.title = "OFAiR Terminal";

    const style = popup.document.createElement("style");
    style.textContent = terminalPopupCSS;
    popup.document.head.appendChild(style);

    const container = popup.document.createElement("div");
    popup.document.body.appendChild(container);

    const channel = new BroadcastChannel("ofair-terminal-sync");
    setTimeout(() => {
      channel.postMessage({ type: "init-history", messages: terminalMessages });
    }, 300);

    const root = ReactDOM.createRoot(container);
    root.render(<TerminalWindow isPopup={true} />);
  };

  useEffect(() => {
    const channel = new BroadcastChannel("ofair-terminal-sync");
    channel.onmessage = (event) => {
      if (event.data?.type === "new-message") {
        setTerminalMessages((prev) => [...prev, event.data.message]);
      }
    };
    return () => channel.close();
  }, []);

  useEffect(() => {
    if (didInit.current) return;

    const local = localStorage.getItem("resumeData");
    const session = sessionStorage.getItem("resumeDataBackup");
    const savedData = local || session;

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.profile) setProfile(parsed.profile);
        if (parsed.contactLinks) setContactLinks(parsed.contactLinks);
        if (parsed.skills) setSkills(parsed.skills);
        if (parsed.languages) setLanguages(parsed.languages);
        if (parsed.aboutMe) setAboutMe(parsed.aboutMe);
        if (parsed.experience) setExperience(parsed.experience);
        if (parsed.projects) setProjects(parsed.projects);
        if (parsed.education) setEducation(parsed.education);
        if (parsed.army) setArmy(parsed.army);
      } catch (e) {
        console.error("Error loading resumeData:", e);
      }
    }
    didInit.current = true;
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    const data = {
      profile,
      contactLinks,
      skills,
      languages,
      aboutMe,
      experience,
      projects,
      education,
      army,
    };
    localStorage.setItem("resumeData", JSON.stringify(data));
    sessionStorage.setItem("resumeDataBackup", JSON.stringify(data));
    setSaveFeedback(true);
    const timer = setTimeout(() => setSaveFeedback(false), 2000);
    return () => clearTimeout(timer);
  }, [isReady, profile, contactLinks, skills, languages, aboutMe, experience, projects, education, army]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      const data = {
        profile,
        contactLinks,
        skills,
        languages,
        aboutMe,
        experience,
        projects,
        education,
        army,
      };
      localStorage.setItem("resumeData", JSON.stringify(data));
      sessionStorage.setItem("resumeDataBackup", JSON.stringify(data));
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [profile, contactLinks, skills, languages, aboutMe, experience, projects, education, army]);

  const handleSave = () => {
    if (document.activeElement?.blur) {
      document.activeElement.blur();
    }
    setTimeout(() => {
      const data = {
        profile,
        contactLinks,
        skills,
        languages,
        aboutMe,
        experience,
        projects,
        education,
        army,
      };
      localStorage.setItem("resumeData", JSON.stringify(data));
      sessionStorage.setItem("resumeDataBackup", JSON.stringify(data));
      setSaveFeedback(true);
      setTimeout(() => setSaveFeedback(false), 2000);
    }, 50);
  };

  const handleExportPDF = () => {
    const input = printRef.current;
    if (!input) return;
    html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("resume.pdf");
    });
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear all resume data?")) {
      setProfile({ firstName: "", lastName: "", role: "", photo: "", language: "en", roles: [] });
      setContactLinks({ github: "", linkedin: "", email: "", phone: "" });
      setSkills([]);
      setLanguages([]);
      setAboutMe([]);
      setExperience([]);
      setProjects([]);
      setEducation([]);
      setArmy({ role: "", city: "", start: "", end: "", description: "" });
      localStorage.removeItem("resumeData");
      sessionStorage.removeItem("resumeDataBackup");
    }
  };

  const handleOfairAction = (action, payload) => {
    switch (action) {
      case "add_skill":
        setSkills((prev) => [...prev, payload]);
        break;
      case "add_language":
        setLanguages((prev) => [...prev, payload]);
        break;
      case "add_experience":
        setExperience((prev) => [...prev, payload]);
        break;
      case "update_profile":
        setProfile((prev) => ({ ...prev, ...payload }));
        break;
      case "update_aboutMe":
        setAboutMe((prev) => [...prev, payload]);
        break;
      case "update_army":
        setArmy((prev) => ({ ...prev, ...payload }));
        break;
      default:
        console.log("Unknown OFAiR action:", action);
    }
  };

  const isNonEmptyTextArray = (arr) => Array.isArray(arr) && arr.some(text => text.trim() !== "");

  const hasResumeContent = () => {
    const isNonEmptyArray = (arr) => Array.isArray(arr) && arr.length > 0;
    const isNonEmptyObj = (obj) => Object.values(obj).some(val => val && val !== "");
    const isNonEmptyProfile = profile.firstName || profile.lastName || profile.role || (profile.roles?.length > 0);

    return (
      isNonEmptyProfile ||
      isNonEmptyObj(contactLinks) ||
      isNonEmptyArray(skills) ||
      isNonEmptyArray(languages) ||
      isNonEmptyTextArray(aboutMe) ||
      isNonEmptyArray(experience) ||
      isNonEmptyArray(projects) ||
      isNonEmptyArray(education) ||
      isNonEmptyObj(army)
    );
  };

  return (
    <div className="resume-title-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="resume-title">
            Build<br />
            Your<br />
            Resume
          </h1>
          <h1 className="resume-title-two">
            Build<br />
            Your<br />
            Resume
          </h1>
          <OFAiR onAction={handleOfairAction} />
        </div>

        <div className="terminal-launch">
          <button className="open-terminal-button" onClick={openTerminalWindow}>
            Open Terminal
          </button>
        </div>
      </div>

      <div className="resume-form">
        <div className="form-left">
          <ProfileHeader profile={profile} setProfile={setProfile} />
          <ContactLinks contactLinks={contactLinks} setContactLinks={setContactLinks} />
          <ProjectsEditor projects={projects} setProjects={setProjects} />
          <SkillsEditor skills={skills} setSkills={setSkills} />
          <LanguagesEditor languages={languages} setLanguages={setLanguages} />
        </div>

        <div className="form-right">
          <AboutMeEditor value={aboutMe} onChange={setAboutMe} />
          <ExperienceEditor experience={experience} setExperience={setExperience} />
          <EducationEditor education={education} setEducation={setEducation} />
          <ArmySection army={army} setArmy={setArmy} />
        </div>
      </div>

      <div className="resume-actions">
        <button className="pdf-button" onClick={handleExportPDF}>Export PDF</button>
        <button className="save-button" onClick={handleSave}>Save</button>
        <button className="clear-button" onClick={handleClear}>Clear</button>
      </div>

      {saveFeedback && (
        <div className="save-feedback">✅ Saved!</div>
      )}

      {hasResumeContent() && (
        <div className="resume-preview" style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="a4-page">
            <LiveResumePreview
              ref={printRef}
              profile={profile}
              contactLinks={contactLinks}
              aboutMe={aboutMe}
              skills={skills}
              languages={languages}
              experience={experience}
              projects={projects}
              education={education}
              army={army}
            />
          </div>
        </div>
      )}
    </div>
  );
}
