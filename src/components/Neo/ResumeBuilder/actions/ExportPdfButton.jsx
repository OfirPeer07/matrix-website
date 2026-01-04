export default function ExportPdfButton() {
  const handlePrint = () => {
    const pdfTemplate =
      localStorage.getItem("resume_template_pdf") || "classic";

    const allowMultipage =
      localStorage.getItem("resume_allow_multipage") === "true";

    document.body.setAttribute(
      "data-pdf-template",
      pdfTemplate
    );

    document.body.setAttribute(
      "data-multipage",
      allowMultipage ? "true" : "false"
    );

    window.print();
  };

  return (
    <button type="button" onClick={handlePrint}>
      Export PDF
    </button>
  );
}
