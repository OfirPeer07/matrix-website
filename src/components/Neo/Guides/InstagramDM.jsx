// src/components/Neo/Guides/InstagramDM.jsx
import React from "react";
import "./InstagramDM.css";

const THREADS = [
  {
    id: 1,
    user: "amir_gecht",
    avatar: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=80",
    lastMessage: "יאללה נדבר מחר",
    time: "2h",
    unread: true,
  },
  {
    id: 2,
    user: "linoy_avraham",
    avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a2c9f9?w=80",
    lastMessage: "שלחתי לך את הקובץ",
    time: "1d",
    unread: false,
  },
  {
    id: 3,
    user: "simona_cataldo",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80",
    lastMessage: "🔥🔥🔥",
    time: "3d",
    unread: false,
  },
];

export default function InstagramDM({ onBack }) {
  return (
    <div className="ig-dm-root">

      {/* Header */}
      <header className="ig-dm-header">
        <button
          className="dm-back"
          onClick={onBack}
          aria-label="Back"
        >
          ←
        </button>

        <h2>morkoen</h2>

        <span className="dm-new">✎</span>
      </header>

      {/* Search */}
      <div className="ig-dm-search">
        <input placeholder="Search" />
      </div>

      {/* Threads */}
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
