// src/components/Neo/Guides/InstagramReels.jsx
import React, { useState, useRef, useEffect } from "react";
import "./InstagramReels.css";

const REEL_DATA = {
  user: "makehealthgreat",
  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120",
  caption: "Never feed your pet this",
  likes: "156K",
  comments: "857",
  reposts: "7,203",
  shares: "69.1K",
  audio: "Well Path - Original audio",
  videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
};

const FRIENDS = [
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=60",
];

export default function InstagramReels() {
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    document.body.classList.add("reel-mode");
    return () => document.body.classList.remove("reel-mode");
  }, []);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    setProgress((video.currentTime / video.duration) * 100);
  };

  return (
    <div className="reels-display-unit">
      <div className="reels-top">
        <div className="reels-header">
          <button className="reels-plus" aria-label="Create">
            <svg viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="reels-title">
            <span className="is-active">Reels</span>
            <span className="is-muted">Friends</span>
            <span className="friends-avatars">
              {FRIENDS.map((src, index) => (
                <img key={index} src={src} alt="" />
              ))}
            </span>
          </div>

          <span className="reels-top-actions" aria-hidden />
        </div>
      </div>

      <div className="video-wrapper">
        <video
          ref={videoRef}
          className="video-surface"
          src={REEL_DATA.videoUrl}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          onClick={() => setIsMuted(!isMuted)}
          onTimeUpdate={handleTimeUpdate}
        />

        <div className="reel-progress">
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="ui-overlay-gradient" />

      <aside className="interaction-sidebar">
        <div className="icon-group" onClick={() => setIsLiked(!isLiked)}>
          <svg viewBox="0 0 24 24" className={`ig-icon ${isLiked ? "active" : ""}`}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41.81 4.5 2.09C12.09 4.81 13.76 4 15.5 4 18 4 20 6 20 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{REEL_DATA.likes}</span>
        </div>

        <div className="icon-group">
          <svg viewBox="0 0 24 24" className="ig-icon no-fill">
            <path d="M6 6h12a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4H10l-4 3v-3H6a4 4 0 0 1-4-4v-6a4 4 0 0 1 4-4z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{REEL_DATA.comments}</span>
        </div>

        <div className="icon-group">
          <svg viewBox="0 0 24 24" className="ig-icon no-fill">
            <path d="M16 6l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20 10H9a4 4 0 0 0-4 4v1" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 18l-4-4 4-4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 14h11a4 4 0 0 0 4-4V9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{REEL_DATA.reposts}</span>
        </div>

        <div className="icon-group">
          <svg viewBox="0 0 24 24" className="ig-icon no-fill">
            <path d="M22 3L10.5 13.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 3l-6.5 18-3.5-7.5L3 10z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{REEL_DATA.shares}</span>
        </div>

        <div className="icon-group">
          <span className="more-dots">...</span>
        </div>

        <div className="audio-thumb-container">
          <img src={REEL_DATA.avatar} className="audio-mini-img" alt="" />
        </div>
      </aside>

      <section className="content-metadata">
        <div className="user-identity">
          <img src={REEL_DATA.avatar} className="user-avatar" alt="" />
          <span className="user-name">{REEL_DATA.user}</span>
          <button className="follow-pill-2026">Follow</button>
        </div>

        <div className="reel-caption">{REEL_DATA.caption}</div>

        <div className="audio-glass-pill">
          <span className="spinning-icon" aria-hidden />
          <span>{REEL_DATA.audio}</span>
        </div>
      </section>
    </div>
  );
}
