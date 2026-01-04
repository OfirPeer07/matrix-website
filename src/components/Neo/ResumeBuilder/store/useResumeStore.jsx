import { useState, useEffect } from "react";
import defaultResume from "../data/defaultResume";

export default function useResumeStore() {
  const [resume, setResume] = useState(defaultResume);

  useEffect(() => {
    const saved = localStorage.getItem("resume");
    if (saved) setResume(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("resume", JSON.stringify(resume));
  }, [resume]);

  const updateSection = (key, value) => {
    setResume(prev => ({ ...prev, [key]: value }));
  };

  return { resume, updateSection };
}
