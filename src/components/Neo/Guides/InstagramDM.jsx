// src/components/Neo/Guides/InstagramDM.jsx
import React from "react";
import "./InstagramDM.css";

const THREADS = [
  {
    id: 1,
    user: "mentor_tal",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80",
    lastMessage: "שלח/י את ה-CV ונעבור יחד על תיקונים.",
    time: "2h",
    unread: true,
  },
  {
    id: 2,
    user: "recruiter_neta",
    avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a2c9f9?w=80",
    lastMessage: "ראיתי את הפרויקט שלך, יש משרה שיכולה להתאים.",
    time: "1d",
    unread: false,
  },
  {
    id: 3,
    user: "junior_club",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80",
    lastMessage: "מחר ב-19:00 סשן שאלות על ראיונות.",
    time: "3d",
    unread: false,
  },
];

export default function InstagramDM({ onBack }) {
  return (
    <div className="ig-dm-root">
      <header className="ig-dm-header">
        <button
          className="dm-back"
          onClick={onBack}
          aria-label="Back"
        >
          ‹
        </button>

        <h2>junior.guides</h2>

        <span className="dm-new">+</span>
      </header>

      <div className="ig-dm-search">
        <input placeholder="חיפוש" />
      </div>

      <section className="ig-dm-list">
        {THREADS.map(t => (
          <div
            key={t.id}
            className={`dm-thread ${t.unread ? "unread" : ""}`}
          >
            <img src={t.avatar} alt="" />

            <div className="dm-content">
              <div className="dm-top">
                <strong>{t.user}</strong>

                <span className="dm-meta">
                  {t.unread && <span className="dm-dot" />}
                  <span className="dm-time">{t.time}</span>
                </span>
              </div>

              <div className="dm-message">{t.lastMessage}</div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
