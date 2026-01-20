import React, { useState, useRef, useEffect } from "react";
import "./InstagramReels.css";

const REEL_DATA = {
  user: "laughclips2333",
  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
  caption: "באנו לבקר שוק מחנה יהודה 📸 #vlog",
  likes: "2,572",
  comments: "47",
  reposts: "72",
  shares: "4,618",
  audio: "Elon clips · Original audio",
  videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
};

export default function InstagramReels() {
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const videoRef = useRef(null);

  /* Hide BottomToolbar while Reel is active */
  useEffect(() => {
    document.body.classList.add("reel-mode");
    return () => document.body.classList.remove("reel-mode");
  }, []);

  return (
    <div className="reels-display-unit">

      {/* Video wrapper enforces 9:16 and rounded corners */}
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
        />
      </div>

      {/* Bottom readability gradient */}
      <div className="ui-overlay-gradient" />

      {/* Interaction sidebar */}
      <aside className="interaction-sidebar">

        <div className="icon-group" onClick={() => setIsLiked(!isLiked)}>
          <svg viewBox="0 0 24 24" className={`ig-icon ${isLiked ? "active" : ""}`}>
            <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.071 2.5 12.194 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.03.044.06.091.092.14.032-.049.062-.096.092-.14a4.21 4.21 0 0 1 3.725-1.941z" />
          </svg>
          <span>{REEL_DATA.likes}</span>
        </div>

        <div className="icon-group">
          <svg viewBox="0 0 24 24" className="ig-icon">
            <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22z" />
          </svg>
          <span>{REEL_DATA.comments}</span>
        </div>

        <div className="icon-group">
          <svg viewBox="0 0 24 24" className="ig-icon no-fill">
            <path d="M19 1l3 3-3 3M5 23l-3-3 3-3M2 20h14c3.314 0 6-2.686 6-6V10M22 4H8c-3.314 0-6 2.686-6 6v4" />
          </svg>
          <span>{REEL_DATA.reposts}</span>
        </div>

        <div className="icon-group">
          <svg viewBox="0 0 24 24" className="ig-icon no-fill">
            <path d="M21 3L2.27 10.53a.5.5 0 0 0-.03.94l5.41 2.03 2.03 5.41a.5.5 0 0 0 .94-.03L18.47 6.53 21 3z" />
          </svg>
          <span>{REEL_DATA.shares}</span>
        </div>

        <div className="icon-group">
          <span className="more-dots">···</span>
        </div>

        <div className="audio-thumb-container">
          <img src={REEL_DATA.avatar} className="audio-mini-img" alt="audio" />
        </div>
      </aside>

      {/* Bottom metadata */}
      <section className="content-metadata">
        <div className="user-identity">
          <img src={REEL_DATA.avatar} className="user-avatar" alt="avatar" />
          <span className="user-name">{REEL_DATA.user}</span>
          <button className="follow-pill-2026">Follow</button>
        </div>

        <div className="reel-caption">{REEL_DATA.caption}</div>

        <div className="audio-glass-pill">
          <span className="spinning-icon">🎵</span>
          <span>{REEL_DATA.audio}</span>
        </div>
      </section>

    </div>
  );
}
