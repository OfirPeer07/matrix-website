export default function ContactLinks({ value = {}, onChange }) {
  const { email = "", phone = "" } = value;

  return (
    <section>
      <h3>Contact</h3>
      <input
        placeholder="Email"
        value={email}
        onChange={e => onChange({ ...value, email: e.target.value })}
      />
      <input
        placeholder="Phone"
        value={phone}
        onChange={e => onChange({ ...value, phone: e.target.value })}
      />
    </section>
  );
}