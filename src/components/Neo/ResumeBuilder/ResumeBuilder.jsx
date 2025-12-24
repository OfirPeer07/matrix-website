import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
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
import OFAiR from "../../Neo/OFAiR/OFAiR";

// 🔥 ייבוא הטיוטה החדשה
import resumeDraft from "./resumeDraft.json";

// Normalize message
const makeMessage = (msg) => ({
  id: msg.id || (crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`),
  timestamp: msg.timestamp || Date.now(),
  ...msg,
});

export default function ResumeBuilder() {
  const printRef = useRef();
  const didInit = useRef(false);
  const [isReady, setIsReady] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState(false);
  const saveFeedbackTimerRef = useRef(null);
  const lastRepliedUserMessageIdRef = useRef(null);

  // State
  const [profile, setProfile] = useState({ firstName: "", lastName: "", role: "", photo: "", language: "en", roles: [] });
  const [contactLinks, setContactLinks] = useState({ github: "", linkedin: "", email: "", phone: "" });
  const [skills, setSkills] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [aboutMe, setAboutMe] = useState([]);
  const [experience, setExperience] = useState([]);
  const [projects, setProjects] = useState([]);
  const [education, setEducation] = useState([]);
  const [army, setArmy] = useState({ role: "", city: "", start: "", end: "", description: "" });

  // Terminal messages
  const [terminalMessages, setTerminalMessages] = useState([
    makeMessage({ sender: "ofair", text: "👾 Ready to assist." })
  ]);
  const terminalMessagesRef = useRef(terminalMessages);

  useEffect(() => {
    terminalMessagesRef.current = terminalMessages;
  }, [terminalMessages]);

  // Broadcast channel
  const channelRef = useRef(null);
  useEffect(() => {
    const channel = new BroadcastChannel("ofair-terminal-sync");
    channelRef.current = channel;

    channel.onmessage = ({ data }) => {
      if (data.type === "new-message" && data.message) {
        setTerminalMessages(prev => {
          if (prev.some(m => m.id === data.message.id)) return prev;
          return [...prev, data.message];
        });
      } else if (data.type === "request-sync") {
        channel.postMessage({ type: "sync-history", history: terminalMessagesRef.current });
      } else if (data.type === "sync-history" && Array.isArray(data.history)) {
        setTerminalMessages(prev => {
          const existingIds = new Set(prev.map(m => m.id));
          const merged = [...prev];
          data.history.forEach(m => {
            if (!existingIds.has(m.id)) merged.push(m);
          });
          return merged;
        });
      }
    };

    return () => channel.close();
  }, []);

  // Safe save
  const safeSetItem = (storage, key, value) => {
    try { storage.setItem(key, value); }
    catch (e) { console.warn(`Failed to write ${key} to storage:`, e); }
  };

  const handleSend = useCallback((message) => {
    const normalized = makeMessage(message);
    setTerminalMessages(prev => {
      if (prev.some(m => m.id === normalized.id)) return prev;
      return [...prev, normalized];
    });

    if (channelRef.current)
      channelRef.current.postMessage({ type: "new-message", message: normalized });
  }, []);

  // Fake auto-reply
  useEffect(() => {
    if (!terminalMessages.length) return;
    const last = terminalMessages[terminalMessages.length - 1];
    if (last.sender === "user" && last.id !== lastRepliedUserMessageIdRef.current) {
      lastRepliedUserMessageIdRef.current = last.id;
      const reply = makeMessage({
        sender: "ofair",
        text: "⚠️ Matrix connection failed.",
      });

      const timer = setTimeout(() => {
        setTerminalMessages(prev => {
          if (prev.some(m => m.id === reply.id)) return prev;
          if (channelRef.current)
            channelRef.current.postMessage({ type: "new-message", message: reply });
          return [...prev, reply];
        });
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [terminalMessages]);

  const openTerminalWindow = useCallback(() => {
    const popup = window.open("", "OFAiR Terminal", "width=800,height=600,left=100,top=100");
    if (!popup) return;

    popup.document.title = "OFAiR Terminal";
    const style = popup.document.createElement("style");
    style.textContent = terminalPopupCSS;
    popup.document.head.appendChild(style);

    const container = popup.document.createElement("div");
    popup.document.body.appendChild(container);

    ReactDOM.createRoot(container).render(
      <TerminalWindow isPopup={true} messages={terminalMessagesRef.current} onSend={handleSend} />
    );

    setTimeout(() => {
      if (channelRef.current)
        channelRef.current.postMessage({ type: "sync-history", history: terminalMessagesRef.current });
    }, 100);
  }, [handleSend]);

  // Save data debounce
  const latestDataRef = useRef(null);
  useEffect(() => {
    latestDataRef.current = { profile, contactLinks, skills, languages, aboutMe, experience, projects, education, army };
  }, [profile, contactLinks, skills, languages, aboutMe, experience, projects, education, army]);

  const saveTimerRef = useRef(null);
  useEffect(() => {
    if (!isReady) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(() => {
      const data = latestDataRef.current;
      safeSetItem(localStorage, "resumeData", JSON.stringify(data));
      safeSetItem(sessionStorage, "resumeDataBackup", JSON.stringify(data));
      setSaveFeedback(true);

      if (saveFeedbackTimerRef.current) clearTimeout(saveFeedbackTimerRef.current);
      saveFeedbackTimerRef.current = setTimeout(() => {
        setSaveFeedback(false);
        saveFeedbackTimerRef.current = null;
      }, 2000);
    }, 500);

    return () => clearTimeout(saveTimerRef.current);
  }, [isReady, profile, contactLinks, skills, languages, aboutMe, experience, projects, education, army]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      const data = latestDataRef.current;
      try { localStorage.setItem("resumeData", JSON.stringify(data)); } catch {}
      try { sessionStorage.setItem("resumeDataBackup", JSON.stringify(data)); } catch {}
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // ⭐ טעינה ראשונית — JSON Draft במקום localStorage
  useEffect(() => {
    if (didInit.current) return;

    try {
      const parsed = resumeDraft;

      setProfile(parsed.profile);
      setContactLinks(parsed.contactLinks);
      setSkills(parsed.skills);
      setLanguages(parsed.languages);
      setAboutMe(parsed.aboutMe);
      setExperience(parsed.experience);
      setProjects(parsed.projects);
      setEducation(parsed.education);
      setArmy(parsed.army);
    } catch (e) {
      console.error("Error loading draft:", e);
    }

    didInit.current = true;
    setIsReady(true);
  }, []);

  // Save button
  const handleSave = useCallback(() => {
    if (document.activeElement?.blur) document.activeElement.blur();
    setTimeout(() => {
      const data = { profile, contactLinks, skills, languages, aboutMe, experience, projects, education, army };
      safeSetItem(localStorage, "resumeData", JSON.stringify(data));
      safeSetItem(sessionStorage, "resumeDataBackup", JSON.stringify(data));
      setSaveFeedback(true);

      if (saveFeedbackTimerRef.current) clearTimeout(saveFeedbackTimerRef.current);
      saveFeedbackTimerRef.current = setTimeout(() => {
        setSaveFeedback(false);
        saveFeedbackTimerRef.current = null;
      }, 2000);
    }, 50);
  }, [profile, contactLinks, skills, languages, aboutMe, experience, projects, education, army]);

  const handleExportPDF = useCallback(() => {
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
  }, []);

  const handleClear = useCallback(() => {
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
  }, []);

  const handleOfairAction = useCallback((action, payload) => {
    switch (action) {
      case "add_skill": setSkills(prev => [...prev, payload]); break;
      case "add_language": setLanguages(prev => [...prev, payload]); break;
      case "add_experience": setExperience(prev => [...prev, payload]); break;
      case "update_profile": setProfile(prev => ({ ...prev, ...payload })); break;
      case "update_aboutMe": setAboutMe(prev => [...prev, payload]); break;
      case "update_army": setArmy(prev => ({ ...prev, ...payload })); break;
    }
  }, []);

  const hasResumeContent = useMemo(() => {
    const isNonEmptyArray = arr => Array.isArray(arr) && arr.length > 0;
    const isNonEmptyObj = obj => obj && typeof obj === "object" && Object.values(obj).some(val => val);
    const isProfileFilled = profile.firstName || profile.lastName || profile.role || (profile.roles?.length > 0);
    const isArmyFilled = army && Object.values(army).some(val => typeof val === "string" && val.trim());
    const isNonEmptyTextArray = arr => Array.isArray(arr) && arr.some(text => text.trim().length > 1);

    return (
      isProfileFilled ||
      isNonEmptyObj(contactLinks) ||
      isNonEmptyArray(skills) ||
      isNonEmptyArray(languages) ||
      isNonEmptyTextArray(aboutMe) ||
      isNonEmptyArray(experience) ||
      isNonEmptyArray(projects) ||
      isNonEmptyArray(education) ||
      isArmyFilled
    );
  }, [profile, contactLinks, skills, languages, aboutMe, experience, projects, education, army]);

  return (
    <div className="resume-title-wrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="resume-title">
            Build<br />Your<br />Resume
          </h1>

          <h1 className="resume-title-two">
            <div className="word-line">
              <span className="letter">B</span><span className="letter">u</span><span className="letter">i</span><span className="letter">l</span><span className="letter">d</span>
            </div>
            <div className="word-line">
              <span className="letter">Y</span><span className="letter">o</span><span className="letter">u</span><span className="letter">r</span>
            </div>
            <div className="word-line">
              <span className="letter">R</span><span className="letter">e</span><span className="letter">s</span><span className="letter">u</span><span className="letter">m</span><span className="letter">e</span>
            </div>
          </h1>

          <OFAiR messages={terminalMessages} onSend={handleSend} />
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

      {saveFeedback && <div className="save-feedback">✅ Saved!</div>}

      {hasResumeContent && (
        <div className="resume-preview" style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="a4-page">
            <div ref={printRef}>
              <LiveResumePreview
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
        </div>
      )}
    </div>
  );
}
