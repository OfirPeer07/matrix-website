
import React from 'react';

export default function ProfileHeader({ profile, setProfile }) {
  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        setProfile(prev => ({ ...prev, photo: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <section className="editor-section">
      <h2>Personal Information</h2>
      <label>
        <strong>First Name:</strong>
        <input
          type="text"
          name="given-name"
          autoComplete="given-name"
          value={profile.firstName || ''}
          onChange={e => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
          placeholder="Enter your first name"
        />
      </label>
      <label>
        <strong>Last Name:</strong>
        <input
          type="text"
          name="family-name"
          autoComplete="family-name"
          value={profile.lastName || ''}
          onChange={e => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
          placeholder="Enter your last name"
        />
      </label>
      <label>
        <strong>Role / Position:</strong>
        <input
          type="text"
          name="job-title"
          autoComplete="organization-title"
          value={profile.role || ''}
          onChange={e => setProfile(prev => ({ ...prev, role: e.target.value }))}
          placeholder="e.g. React Developer"
        />
      </label>
      <label>
        <strong>Profile Photo:</strong>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </label>
    </section>
  );
}
