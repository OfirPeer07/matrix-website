import React, { useState, useRef, useEffect } from "react";
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
  const [leftColor, setLeftColor] = useState("#f0f4f8");
  const [rightColor, setRightColor] = useState("#e8ebee");

  // Load from localStorage once
  useEffect(() => {
    if (didInit.current) return;
    const savedData = localStorage.getItem("resumeData");
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

  // Auto-save on change
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
    setSaveFeedback(true);
    const timer = setTimeout(() => setSaveFeedback(false), 2000);
    return () => clearTimeout(timer);
  }, [isReady, profile, contactLinks, skills, languages, aboutMe, experience, projects, education, army]);

  // Warn before leaving if unsaved
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const current = JSON.stringify({ profile, contactLinks, skills, languages, aboutMe, experience, projects, education, army });
      const saved = localStorage.getItem("resumeData");
      if (current !== saved) {
        e.preventDefault();
        e.returnValue = "";
      }
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

  const hasResumeContent = () => {
    const isNonEmptyArray = (arr) => Array.isArray(arr) && arr.length > 0;
    const isNonEmptyObj = (obj) => Object.values(obj).some(val => val && val !== "");
    const isNonEmptyProfile = profile.firstName || profile.lastName || profile.role || (profile.roles?.length > 0);

    return (
      isNonEmptyProfile ||
      isNonEmptyObj(contactLinks) ||
      isNonEmptyArray(skills) ||
      isNonEmptyArray(languages) ||
      isNonEmptyArray(aboutMe) ||
      isNonEmptyArray(experience) ||
      isNonEmptyArray(projects) ||
      isNonEmptyArray(education) ||
      isNonEmptyObj(army)
    );
  };

  return (
    <div className="resume-title-wrapper">
      <div>
        <h1 className="resume-title">Build Your Resume</h1>
        <OFAiR onAction={handleOfairAction} />
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
              leftColor={leftColor}
              rightColor={rightColor}
            />
          </div>
        </div>
      )}
    </div>
  );
}
