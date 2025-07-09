import React, { useState } from "react";
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
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    role: "",
    photo: "",
    language: "en",
    roles: [],
  });

  const [contactLinks, setContactLinks] = useState({
    github: "",
    linkedin: "",
    email: "",
    phone: "",
  });

  const [skills, setSkills] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [aboutMe, setAboutMe] = useState([]);
  const [experience, setExperience] = useState([]);
  const [projects, setProjects] = useState([]);
  const [education, setEducation] = useState([]);
  const [army, setArmy] = useState({
    role: "",
    city: "",
    start: "",
    end: "",
    description: "",
  });

  const [leftColor, setLeftColor] = useState("#f0f4f8");
  const [rightColor, setRightColor] = useState("#e8ebee");

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
        console.log("Unknown action from OFAiR:", action);
    }
  };

  return (
    <div className="resume-builder">
      {/* כותרת + OFAiR באותה שורה */}
      <div className="header-with-ofair">
        <h1>Resume Builder</h1>
        <OFAiR onAction={handleOfairAction} />
      </div>

      <div className="resume-form">
        <div className="form-left">
          <ProfileHeader profile={profile} setProfile={setProfile} />
          <ContactLinks contactLinks={contactLinks} setContactLinks={setContactLinks} />
          <SkillsEditor skills={skills} setSkills={setSkills} />
          <LanguagesEditor languages={languages} setLanguages={setLanguages} />
        </div>

        <div className="form-right">
          <AboutMeEditor aboutMe={aboutMe} setAboutMe={setAboutMe} />
          <ExperienceEditor experience={experience} setExperience={setExperience} />
          <ProjectsEditor projects={projects} setProjects={setProjects} />
          <EducationEditor education={education} setEducation={setEducation} />
          <ArmySection army={army} setArmy={setArmy} />
        </div>
      </div>

      <div className="resume-preview">
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
          leftColor={leftColor}
          rightColor={rightColor}
        />
      </div>
    </div>
  );
}
