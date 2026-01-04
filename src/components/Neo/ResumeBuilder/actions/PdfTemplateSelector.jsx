export default function ExportPdfButton() {
  const handlePrint = () => {
    // 1️⃣ קריאה ל-template שנבחר ל-PDF
    const pdfTemplate =
      localStorage.getItem("resume_template_pdf") || "classic";

    // 2️⃣ עדכון ה-body כדי שה-CSS ידע מה להציג
    document.body.setAttribute(
      "data-pdf-template",
      pdfTemplate
    );

    // 3️⃣ הדפסה אמיתית
    window.print();
  };

  return (
    <button
      type="button"
      onClick={handlePrint}
      className="export-pdf-button"
    >
      Export PDF
    </button>
  );
}
