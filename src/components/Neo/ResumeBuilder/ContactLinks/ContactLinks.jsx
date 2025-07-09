export default function ContactLinks({ contactLinks, setContactLinks }) {
  return (
    <section className="editor-section">
      <h2>Contact Information</h2>
      <label>
        <strong>GitHub:
        <input
          type="text"
          value={contactLinks.github}
          onChange={e => setContactLinks(prev => ({ ...prev, github: e.target.value }))}
          placeholder="GitHub URL"
        /></strong>
      </label>
      <label>
        <strong>LinkedIn:
        <input
          type="text"
          value={contactLinks.linkedin}
          onChange={e => setContactLinks(prev => ({ ...prev, linkedin: e.target.value }))}
          placeholder="LinkedIn URL"
        /></strong>
      </label>
      <label>
        <strong>Email:
        <input
          type="email"
          value={contactLinks.email}
          onChange={e => setContactLinks(prev => ({ ...prev, email: e.target.value }))}
          placeholder="example@mail.com"
        /></strong>
      </label>
      <label>
        <strong>Phone:
        <input
          type="tel"
          value={contactLinks.phone}
          onChange={e => setContactLinks(prev => ({ ...prev, phone: e.target.value }))}
          placeholder="Phone number"
        /></strong>
      </label>
    </section>
  );
}
