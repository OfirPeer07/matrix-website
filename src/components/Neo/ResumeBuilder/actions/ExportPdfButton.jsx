import { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useLocaleContext } from "../../../../context/LocaleContext";

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

const translations = {
  en: {
    export: "EXPORT PDF ↓",
    generating: "⏳ GENERATING...",
    noName: "Add your name first",
    exportAs: "Export as {template} PDF",
    previewNotFound: "Preview not found. Make sure your name is filled in.",
    failed: "PDF export failed. Please try again."
  },
  he: {
    export: "ייצוא PDF ↓",
    generating: "⏳ מייצר...",
    noName: "יש להזין שם תחילה",
    exportAs: "ייצוא כ- {template} PDF",
    previewNotFound: "לא נמצאה תצוגה מקדימה. וודא שהשם מלא.",
    failed: "ייצוא PDF נכשל. נסה שוב."
  }
};

export default function ExportPdfButton({ template, resume }) {
  const { locale } = useLocaleContext();
  const t = translations[locale] || translations.en; // Default to English if locale not found
  const [loading, setLoading] = useState(false);
  const hasName = resume?.profile?.firstName;

  const handleExport = async () => {
    if (!hasName || loading) return;
    setLoading(true);

    try {
      // ─── 1. Find the screen-preview div (the live scaled preview) ─────────
      //    We target the inner rendered template, not the scaled wrapper,
      //    so the canvas is always at real A4 resolution regardless of zoom.
      const templateEl = document.querySelector(".a4-scale-wrapper .live-resume");

      if (!templateEl) {
        alert("Preview not found. Make sure your name is filled in.");
        return;
      }

      // ─── 2. Snapshot the element at 2× resolution for sharpness ──────────
      const canvas = await html2canvas(templateEl, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        // Capture at the element's natural (unscaled) size
        width: templateEl.scrollWidth,
        height: templateEl.scrollHeight,
      });

      // ─── 3. Build the PDF ─────────────────────────────────────────────────
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const imgW = A4_WIDTH_MM;
      const imgH = (canvas.height / canvas.width) * A4_WIDTH_MM;

      // If content is taller than A4, scale it down to fit one page
      const finalH = Math.min(imgH, A4_HEIGHT_MM);
      const finalW = imgH > A4_HEIGHT_MM
        ? (A4_HEIGHT_MM / imgH) * A4_WIDTH_MM
        : imgW;

      // Center horizontally if we had to scale down width
      const xOffset = (A4_WIDTH_MM - finalW) / 2;

      pdf.addImage(imgData, "JPEG", xOffset, 0, finalW, finalH);

      // ─── 4. Save ──────────────────────────────────────────────────────────
      const firstName = resume.profile.firstName || "resume";
      const lastName = resume.profile.lastName || "";
      pdf.save(`${firstName}_${lastName}_CV.pdf`.replace(/\s+/g, "_"));

    } catch (err) {
      console.error("PDF export failed:", err);
      alert(t.failed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={!hasName || loading}
      className="export-pdf-button"
      title={!hasName ? t.noName : t.exportAs.replace("{template}", template)}
    >
      {loading ? t.generating : t.export}
    </button>
  );
}
