import { useState, useEffect } from "react";

const PDF_KEY = "resume_template_pdf";

export default function PdfTemplateSelector() {
  const [selected, setSelected] = useState(
    () => localStorage.getItem(PDF_KEY) || "classic"
  );

  useEffect(() => {
    localStorage.setItem(PDF_KEY, selected);
  }, [selected]);

  const options = [
    { id: "classic", label: "Classic" },
    { id: "modern", label: "Modern" },
    { id: "neural", label: "Neural Link" },
    { id: "ats", label: "ATS" },
  ];

  return (
    <div className="pdf-template-selector">
      <label>PDF Template:</label>
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
      >
        {options.map(opt => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
