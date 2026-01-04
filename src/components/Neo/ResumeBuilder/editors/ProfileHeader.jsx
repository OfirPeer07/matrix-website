export default function ProfileHeader({ value = {}, onChange }) {
  const { firstName = "", lastName = "", role = "" } = value;

  return (
    <section>
      <h3>Profile</h3>
      <input
        placeholder="First name"
        value={firstName}
        onChange={e => onChange({ ...value, firstName: e.target.value })}
      />
      <input
        placeholder="Last name"
        value={lastName}
        onChange={e => onChange({ ...value, lastName: e.target.value })}
      />
      <input
        placeholder="Role"
        value={role}
        onChange={e => onChange({ ...value, role: e.target.value })}
      />
    </section>
  );
}