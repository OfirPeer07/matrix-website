import React, { useState } from "react";
import { useLocaleContext } from "../../../context/LocaleContext";
import "./InstagramProfile.css";

const translations = {
  en: {
    profile: {
      user: "junior.guides.il",
      name: "Junior Guides",
      bio: [
        "Your go-to place for junior career tips and real project ideas.",
        "CV | Portfolio | Interview prep | Networking",
      ],
      stats: { posts: 42, followers: "8.4K", following: 213 }
    },
    highlights: [
      { id: "new", label: "New", new: true },
      { id: "cv", label: "CV tips", image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=120" },
      { id: "portfolio", label: "Portfolio", image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=120" },
      { id: "networking", label: "Networking", image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=120" },
      { id: "interviews", label: "Interviews", image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120" },
    ],
    share: "Share your profile...",
    posts: "Posts",
    followers: "Followers",
    following: "Following",
    edit: "Edit Profile",
    shareBtn: "Share Profile",
    reelsLabel: "Reels",
    taggedLabel: "Tagged"
  },
  he: {
    profile: {
      user: "junior.guides.il",
      name: "מדריכי ג'וניור",
      bio: [
        "המקום שלך לטיפים לקריירה ורעיונות לפרויקטים אמיתיים.",
        "קו\"ח | פורטפוליו | הכנה לראיונות | נטוורקינג",
      ],
      stats: { posts: 42, followers: "8.4K", following: 213 }
    },
    highlights: [
      { id: "new", label: "חדש", new: true },
      { id: "cv", label: "טיפים לקו\"ח", image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=120" },
      { id: "portfolio", label: "פורטפוליו", image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=120" },
      { id: "networking", label: "נטוורקינג", image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=120" },
      { id: "interviews", label: "ראיונות", image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120" },
    ],
    share: "שתף את הפרופיל שלך...",
    posts: "פוסטים",
    followers: "עוקבים",
    following: "עוקבים אחרי",
    edit: "ערוך פרופיל",
    shareBtn: "שתף פרופיל",
    reelsLabel: "רילס",
    taggedLabel: "תיוגים"
  }
};

const GRID = [
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400",
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400",
  "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400",
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400",
  "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400",
];

export default function InstagramProfile() {
  const { locale } = useLocaleContext();
  const t = translations[locale];
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
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V8a4 4 0 1 1 8 0v3" />
          </svg>
          <span className="handle">{t.profile.user}</span>
          <svg className="chevron-icon" viewBox="0 0 24 24" aria-hidden>
            <path d="M7 10l5 5 5-5" />
          </svg>
          <span className="handle-dot" aria-hidden />
        </div>

        <div className="top-actions">
          <button className="top-icon" aria-label="Threads">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" />
              <path d="M9.1 12.2c0-2.3 1.8-3.7 4.4-3.7 2.7 0 4.5 1.5 4.5 3.9 0 2.6-2 4.2-4.9 4.2-2.9 0-4.4-1.5-4.5-3.6" />
              <path d="M10.3 12.1c.8 1.1 2.2 1.8 3.9 1.8" />
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
          <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160" className="profile-avatar" alt="" />
          <span className="avatar-plus">+</span>
          <div className="share-pill">{t.share}</div>
        </div>

        <div className="profile-meta">
          <div className="profile-name">{t.profile.name}</div>
          <div className="profile-stats">
            <Stat label={t.posts} value={t.profile.stats.posts} />
            <Stat label={t.followers} value={t.profile.stats.followers} />
            <Stat label={t.following} value={t.profile.stats.following} />
          </div>
        </div>
      </section>

      <section className="ig-profile-bio">
        {t.profile.bio.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </section>

      <section className="ig-profile-actions">
        <button>{t.edit}</button>
        <button>{t.shareBtn}</button>
      </section>

      <section className="ig-profile-highlights">
        {t.highlights.map(item => (
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
          aria-label={t.posts}
        >
          <svg viewBox="0 0 24 24">
            <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
          </svg>
        </button>
        <button
          className={activeTab === "reels" ? "active" : ""}
          onClick={() => setActiveTab("reels")}
          aria-label={t.reelsLabel}
        >
          <svg viewBox="0 0 24 24">
            <rect x="4" y="4" width="16" height="16" rx="4" />
            <path d="M11 9l6 3-6 3z" />
          </svg>
        </button>
        <button
          className={activeTab === "tagged" ? "active" : ""}
          onClick={() => setActiveTab("tagged")}
          aria-label={t.taggedLabel}
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
