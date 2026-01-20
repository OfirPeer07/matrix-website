import React, { useState } from "react";
import "./InstagramProfile.css";

const PROFILE = {
  user: "morkoen",
  name: "Mor Koen",
  bio: "Product • Design • Code\nBuilding guides for juniors",
  avatar:
    "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=160",
  stats: {
    posts: 24,
    followers: "1,204",
    following: 312,
  },
};

const GRID = Array.from({ length: 18 });

export default function InstagramProfile() {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className="ig-profile-root">

      {/* Header */}
      <header className="ig-profile-header">
        <h2>{PROFILE.user}</h2>
        <div className="header-actions">
          <span>＋</span>
          <span>☰</span>
        </div>
      </header>

      {/* Info */}
      <section className="ig-profile-info">
        <img src={PROFILE.avatar} className="profile-avatar" alt="" />

        <div className="profile-stats">
          <Stat label="Posts" value={PROFILE.stats.posts} />
          <Stat label="Followers" value={PROFILE.stats.followers} />
          <Stat label="Following" value={PROFILE.stats.following} />
        </div>
      </section>

      {/* Bio */}
      <section className="ig-profile-bio">
        <strong>{PROFILE.name}</strong>
        {PROFILE.bio.split("\n").map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </section>

      {/* Actions */}
      <section className="ig-profile-actions">
        <button>Edit profile</button>
        <button>Share profile</button>
      </section>

      {/* Tabs */}
      <nav className="ig-profile-tabs">
        <button
          className={activeTab === "posts" ? "active" : ""}
          onClick={() => setActiveTab("posts")}
        >
          ▦
        </button>
        <button
          className={activeTab === "reels" ? "active" : ""}
          onClick={() => setActiveTab("reels")}
        >
          ▶
        </button>
        <button
          className={activeTab === "tagged" ? "active" : ""}
          onClick={() => setActiveTab("tagged")}
        >
          ⌂
        </button>
      </nav>

      {/* Grid */}
      <section className="ig-profile-grid">
        {GRID.map((_, i) => (
          <div key={i} className="grid-item" />
        ))}
      </section>

    </div>
  );
}

/* ===== Sub ===== */
function Stat({ label, value }) {
  return (
    <div className="stat">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
