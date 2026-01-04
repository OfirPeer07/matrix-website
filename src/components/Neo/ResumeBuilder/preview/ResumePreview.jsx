import { useState, useEffect, useRef } from "react";
import PreviewToolbar from "./PreviewToolbar";
import ClassicTemplate from "./templates/ClassicTemplate";
import ModernTemplate from "./templates/ModernTemplate";
import AtsTemplate from "./templates/AtsTemplate";
import useA4Overflow from "./useA4Overflow";
import A4Meter from "./A4Meter";

const PREVIEW_KEY = "resume_template_preview";

export default function ResumePreview({ resume }) {
  /* ===== STATE ===== */
  const [template, setTemplate] = useState(
    () => localStorage.getItem(PREVIEW_KEY) || "classic"
  );

  /* ===== A4 MEASURE ===== */
  const previewRef = useRef(null);
  const { height, overflow, max } = useA4Overflow(previewRef);

  /* ===== PERSIST PREVIEW TEMPLATE ===== */
  useEffect(() => {
    localStorage.setItem(PREVIEW_KEY, template);
  }, [template]);

  /* ===== GUARD: NO PROFILE YET ===== */
  if (!resume?.profile?.firstName) {
    return (
      <div className="resume-preview-wrapper">
        <div className="resume-placeholder">
          <p>👈 Add your name to see resume preview</p>
        </div>
      </div>
    );
  }

  const props = { ...resume };

  return (
    <div className="resume-preview-wrapper">
      {/* ===== TOOLBAR (PREVIEW ONLY) ===== */}
      <PreviewToolbar template={template} onChange={setTemplate} />

      {/* ===== A4 HEIGHT INDICATOR ===== */}
      <A4Meter height={height} max={max} overflow={overflow} />

      {(template === "ats" || template === "base") && (
        <div className="preview-hint">
          {template === "ats" && "ATS view – optimized for applicant tracking systems"}
          {template === "base" && "Raw layout – no styling, used for structure & page size checks"}
        </div>
      )}

      {/* ===== SCREEN PREVIEW ===== */}
      <div ref={previewRef} className="screen-only">
        {template === "classic" && <ClassicTemplate {...props} />}
        {template === "modern" && <ModernTemplate {...props} />}
        {template === "ats" && <AtsTemplate {...props} />}
        {template === "base" && (
          <div className="live-resume">
            {/* Base = ATS content בלי ats.css */}
            <AtsTemplate {...props} />
          </div>
        )}
      </div>

      {/* ===== PDF-ONLY TEMPLATES ===== */}
      <div className="pdf-only classic">
        <ClassicTemplate {...props} />
      </div>

      <div className="pdf-only modern">
        <ModernTemplate {...props} />
      </div>

      <div className="pdf-only ats">
        <AtsTemplate {...props} />
      </div>
    </div>
  );
}
