import React, { useEffect, useRef } from "react";
import "./GuidesReels.css";

export default function GuidesReels({ items = [], title = "Reels" }) {
  const containerRef = useRef(null);
  const vidsRef = useRef({});

  useEffect(() => {
    if (!containerRef.current) return;
    const root = containerRef.current;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("data-id");
          const v = vidsRef.current[id];
          if (!v) return;
          if (entry.isIntersecting && entry.intersectionRatio > 0.65) {
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        });
      },
      { root, threshold: [0.25, 0.65, 0.9] }
    );

    const cards = root.querySelectorAll(".reel-card");
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [items.length]);

  return (
    <div className="reels-root">
      <header className="reels-top">
        <div className="title">{title}</div>
      </header>

      <div className="reels-list" ref={containerRef}>
        {items.length === 0 && (
          <div className="empty">No reels yet. Add a few videos.</div>
        )}

        {items.map((m) => (
          <article key={m.id} className="reel-card" data-id={m.id}>
            <div className="video-wrap">
              <video
                ref={(el) => (vidsRef.current[m.id] = el)}
                className="reel-video"
                src={m.src}
                muted
                loop
                playsInline
                preload="metadata"
                poster={m.poster || undefined}
              />
              <div className="grad" />
              <div className="overlay">
                {!!m.username && <span className="username">@{m.username}</span>}
                {!!m.caption && <p className="caption">{m.caption}</p>}
              </div>
            </div>
            <footer className="bar">
              <span className="left">{m.caption ? "Guide" : "—"}</span>
              <span className="time">
                {m.timestamp ? new Date(m.timestamp).toLocaleDateString() : ""}
              </span>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}
