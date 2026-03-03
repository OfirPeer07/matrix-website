import { useState, useEffect, useCallback } from "react";
import useResumeStore from "./store/useResumeStore";
import { useLocaleContext } from "../../../context/LocaleContext";

/* ===== EDITORS ===== */
import ProfileHeader from "./editors/ProfileHeader";
import AboutMeEditor from "./editors/AboutMeEditor";
import SkillsEditor from "./editors/SkillsEditor";
import ExperienceEditor from "./editors/ExperienceEditor";
import EducationEditor from "./editors/EducationEditor";
import LanguagesEditor from "./editors/LanguagesEditor";
import ProjectsEditor from "./editors/ProjectsEditor";
import ArmySection from "./editors/ArmySection";
import ContactLinks from "./editors/ContactLinks";

/* ===== TEMPLATE SELECTOR ===== */
import TemplateSelector from "./TemplateSelector";

/* ===== PREVIEW & ACTIONS ===== */
import ResumePreview from "./preview/ResumePreview";
import ExportPdfButton from "./actions/ExportPdfButton";

/* ===== STYLES ===== */
import "./ResumeBuilder.css";

const translations = {
  en: {
    title: "// CV Builder",
    sub: "Fill in your data → see preview live → export A4 PDF",
    preview: "▶ Live Preview",
    a4: "A4 · 210 × 297 mm"
  },
  he: {
    title: "// בונה קורות חיים",
    sub: "מלא את הפרטים ← ראה תצוגה מקדימה ← ייצוא ל-PDF (A4)",
    preview: "▶ תצוגה מקדימה",
    a4: "A4 · 210 × 297 מ\"מ"
  }
};

const TEMPLATE_KEY = "resume_template";

export default function ResumeBuilder() {
  const { locale } = useLocaleContext();
  const t = translations[locale] || translations.he;
  const { resume, updateSection } = useResumeStore();

  /* Unified template state — drives BOTH preview and PDF export */
  const [template, setTemplate] = useState(
    () => localStorage.getItem(TEMPLATE_KEY) || "classic"
  );

  const handleTemplateChange = useCallback((id) => {
    setTemplate(id);
    localStorage.setItem(TEMPLATE_KEY, id);
  }, []);

  return (
    <div className="resume-builder-layout">

      {/* ======================== */}
      {/* ===== LEFT: FORM ===== */}
      {/* ======================== */}
      <aside className="resume-form-panel">
        <div className="resume-form-header">
          <h2>{t.title}</h2>
          <p>{t.sub}</p>
        </div>

        <div className="resume-form-scroll">

          {/* Template selector at the top of the form */}
          <TemplateSelector selected={template} onChange={handleTemplateChange} />

          <ProfileHeader
            value={resume.profile}
            onChange={(v) => updateSection("profile", v)}
          />

          <ContactLinks
            value={resume.contact}
            onChange={(v) => updateSection("contact", v)}
          />

          <AboutMeEditor
            value={resume.about}
            onChange={(v) => updateSection("about", v)}
          />

          <SkillsEditor
            skills={resume.skills}
            setSkills={(v) => updateSection("skills", v)}
          />

          <ExperienceEditor
            experience={resume.experience}
            setExperience={(v) => updateSection("experience", v)}
          />

          <EducationEditor
            education={resume.education}
            setEducation={(v) => updateSection("education", v)}
          />

          <ProjectsEditor
            projects={resume.projects}
            setProjects={(v) => updateSection("projects", v)}
          />

          <LanguagesEditor
            languages={resume.languages}
            setLanguages={(v) => updateSection("languages", v)}
          />

          <ArmySection
            value={resume.army}
            onChange={(v) => updateSection("army", v)}
          />
        </div>

        {/* ===== STICKY ACTIONS BAR ===== */}
        <div className="resume-actions-bar">
          <ExportPdfButton template={template} resume={resume} />
        </div>
      </aside>

      {/* ========================== */}
      {/* ===== RIGHT: PREVIEW ===== */}
      {/* ========================== */}
      <main className="resume-preview-panel">
        <div className="resume-preview-panel-header">
          <span>{t.preview}</span>
          <span className="a4-hint">{t.a4}</span>
        </div>

        <div className="preview-scroll">
          <ResumePreview resume={resume} template={template} />
        </div>
      </main>

    </div>
  );
}
