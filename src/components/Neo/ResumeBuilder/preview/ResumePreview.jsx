import { useEffect, useRef } from "react";
import { useLocaleContext } from "../../../../context/LocaleContext";
import ClassicTemplate from "./templates/ClassicTemplate";
import ModernTemplate from "./templates/ModernTemplate";
import NeuralTemplate from "./templates/NeuralTemplate";
import AtsTemplate from "./templates/AtsTemplate";
import useA4Overflow from "./useA4Overflow";
import A4Meter from "./A4Meter";

const A4_WIDTH_PX = 793.7; // 210mm @ 96dpi
const A4_HEIGHT_PX = 1122;  // 297mm @ 96dpi

const translations = {
  en: {
    placeholder: "Add your name to see the live preview →",
    atsHint: "ATS view – plain text, optimised for applicant tracking systems",
  },
  he: {
    placeholder: "→ הוסף שם כדי לראות תצוגה מקדימה",
    atsHint: "תצוגת ATS – טקסט נקי, מותאם למערכות סינון קורות חיים",
  },
};

function TemplateRenderer({ template, ...props }) {
  switch (template) {
    case "modern": return <ModernTemplate  {...props} />;
    case "neural": return <NeuralTemplate  {...props} />;
    case "ats": return <AtsTemplate     {...props} />;
    case "classic":
    default: return <ClassicTemplate {...props} />;
  }
}

export default function ResumePreview({ resume, template = "classic" }) {
  const { locale } = useLocaleContext();
  const t = translations[locale] ?? translations.en;

  /* ===== A4 MEASURE ===== */
  const previewRef = useRef(null);
  const wrapperRef = useRef(null);
  const { height, overflow, max } = useA4Overflow(previewRef);

  /* ===== SCALE TO FIT ===== */
  useEffect(() => {
    const scaleToFit = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      const parent = wrapper.parentElement;
      if (!parent) return;

      const availableW = parent.clientWidth - 48; // 24px padding each side
      const scale = Math.min(1, availableW / A4_WIDTH_PX);
      wrapper.style.transform = `scale(${scale})`;
      // Since transform doesn't affect layout flow, manually set the container height
      wrapper.style.marginBottom = `${(A4_HEIGHT_PX * scale) - A4_HEIGHT_PX}px`;
    };

    scaleToFit();
    window.addEventListener("resize", scaleToFit);
    return () => window.removeEventListener("resize", scaleToFit);
  }, []);

  /* ===== GUARD: NO PROFILE YET ===== */
  if (!resume?.profile?.firstName) {
    return (
      <div className="resume-placeholder">
        <p>{t.placeholder}</p>
      </div>
    );
  }

  const props = { ...resume };

  return (
    <>
      {/* ===== A4 HEIGHT INDICATOR ===== */}
      <A4Meter height={height} max={max} overflow={overflow} />

      {template === "ats" && (
        <p className="preview-hint">{t.atsHint}</p>
      )}

      {/* ===== SCREEN PREVIEW (scaled A4) ===== */}
      <div ref={wrapperRef} className="a4-scale-wrapper">
        <div ref={previewRef}>
          <TemplateRenderer template={template} {...props} />
        </div>
      </div>

      {/* ===== PDF-ONLY TEMPLATES (hidden on screen, printed based on data-pdf-template) ===== */}
      <div className="pdf-only classic"><ClassicTemplate {...props} /></div>
      <div className="pdf-only modern"><ModernTemplate  {...props} /></div>
      <div className="pdf-only neural"><NeuralTemplate  {...props} /></div>
      <div className="pdf-only ats">   <AtsTemplate     {...props} /></div>
    </>
  );
}
