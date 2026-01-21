import React, { useState } from "react";
import "./InstagramProfile.css";

const PROFILE = {
  user: "ofirpeer7",
  name: "Ofir Peer",
  bio: [
    "Live * Life * You * Will * Remember",
    "Try sharing a song...",
  ],
  avatar:
    "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=160",
  stats: {
    posts: 75,
    followers: "16.6K",
    following: 172,
  },
};

const HIGHLIGHTS = [
  { id: "new", label: "New", new: true },
  {
    id: "friday",
    label: "My Friday",
    image:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120",
  },
  {
    id: "dog",
    label: "My Dog",
    image:
      "https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=120",
  },
  {
    id: "vietnam",
    label: "Vietnam",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=120",
  },
  {
    id: "netherlands",
    label: "Netherlands",
    image:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=120",
  },
];

const GRID = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600",
  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600",
  "https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=600",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",
];

export default function InstagramProfile() {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className="ig-profile-root">
      <header className="ig-profile-topbar">
        <button className="top-icon" aria-label="Create">
          <svg viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>

        <div className="top-center">
          <svg className="lock-icon" viewBox="0 0 24 24" aria-hidden>
            <path d="M7 10V8a5 5 0 0 1 10 0v2" />
            <rect x="5" y="10" width="14" height="10" rx="2" />
          </svg>
          <span className="handle">{PROFILE.user}</span>
          <svg className="chevron-icon" viewBox="0 0 24 24" aria-hidden>
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>

        <div className="top-actions">
          <button className="top-icon" aria-label="Threads">
            <svg viewBox="0 0 24 24">
              <path d="M7 8c2-2 6-2 8 0 2 2 2 6 0 8s-6 2-8 0" />
              <path d="M9 10c1-1 5-1 6 0 1 1 1 3 0 4s-5 1-6 0" />
            </svg>
          </button>
          <button className="top-icon" aria-label="Menu">
            <svg viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      <section className="ig-profile-info">
        <div className="avatar-wrap">
          <img src={PROFILE.avatar} className="profile-avatar" alt="" />
          <span className="avatar-plus">+</span>
          <div className="share-pill">Try sharing a song...</div>
        </div>

        <div className="profile-meta">
          <div className="profile-name">{PROFILE.name}</div>
          <div className="profile-stats">
            <Stat label="posts" value={PROFILE.stats.posts} />
            <Stat label="followers" value={PROFILE.stats.followers} />
            <Stat label="following" value={PROFILE.stats.following} />
          </div>
        </div>
      </section>

      <section className="ig-profile-bio">
        {PROFILE.bio.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </section>

      <section className="ig-profile-actions">
        <button>Edit profile</button>
        <button>Share profile</button>
      </section>

      <section className="ig-profile-highlights">
        {HIGHLIGHTS.map(item => (
          <div key={item.id} className="highlight">
            <div className="highlight-ring">
              {item.new ? (
                <span className="highlight-plus">+</span>
              ) : (
                <img src={item.image} alt="" />
              )}
            </div>
            <span>{item.label}</span>
          </div>
        ))}
      </section>

      <nav className="ig-profile-tabs">
        <button
          className={activeTab === "posts" ? "active" : ""}
          onClick={() => setActiveTab("posts")}
          aria-label="Posts"
        >
          <svg viewBox="0 0 24 24">
            <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
          </svg>
        </button>
        <button
          className={activeTab === "reels" ? "active" : ""}
          onClick={() => setActiveTab("reels")}
          aria-label="Reels"
        >
          <svg viewBox="0 0 24 24">
            <rect x="4" y="4" width="16" height="16" rx="4" />
            <path d="M11 9l6 3-6 3z" />
          </svg>
        </button>
        <button
          className={activeTab === "tagged" ? "active" : ""}
          onClick={() => setActiveTab("tagged")}
          aria-label="Tagged"
        >
          <svg viewBox="0 0 24 24">
            <path d="M8 7a4 4 0 1 1 8 0c0 4-4 5-4 9 0-4-4-5-4-9z" />
            <circle cx="12" cy="7" r="2" />
          </svg>
        </button>
      </nav>

      <section className="ig-profile-grid">
        {GRID.map((src, i) => (
          <div key={i} className="grid-item">
            <img src={src} alt="" />
            <span className="reel-badge" />
          </div>
        ))}
      </section>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
