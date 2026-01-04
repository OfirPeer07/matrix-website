import useResumeStore from "./store/useResumeStore";

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

/* ===== PREVIEW & ACTIONS ===== */
import ResumePreview from "./preview/ResumePreview";
import PdfTemplateSelector from "./actions/PdfTemplateSelector";
import ExportPdfButton from "./actions/ExportPdfButton";

/* ===== STYLES ===== */
import "./ResumeBuilder.css";

export default function ResumeBuilder() {
  const { resume, updateSection } = useResumeStore();

  return (
    <div className="resume-builder-layout">
      {/* ============================= */}
      {/* ===== LEFT: EDITORS ===== */}
      {/* ============================= */}
      <aside className="resume-editors">
        <ProfileHeader
          value={resume.profile}
          onChange={(v) => updateSection("profile", v)}
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

        <LanguagesEditor
          languages={resume.languages}
          setLanguages={(v) => updateSection("languages", v)}
        />

        <ProjectsEditor
          projects={resume.projects}
          setProjects={(v) => updateSection("projects", v)}
        />

        <ArmySection
          value={resume.army}
          onChange={(v) => updateSection("army", v)}
        />

        <ContactLinks
          value={resume.contact}
          onChange={(v) => updateSection("contact", v)}
        />

        {/* ===== ACTIONS ===== */}
        <div className="resume-actions">
          <PdfTemplateSelector />
          <ExportPdfButton />
        </div>
      </aside>

      {/* ============================= */}
      {/* ===== RIGHT: PREVIEW ===== */}
      {/* ============================= */}
      <main className="resume-preview-area">
        <ResumePreview resume={resume} />
      </main>
    </div>
  );
}
