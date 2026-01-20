import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./InstagramFeed.css";

/* ===== Mock Data ===== */
const POSTS = [
  {
    id: 1,
    user: "morkoen",
    location: "Tel-Aviv, תל-אביב",
    avatar:
      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=80",
    images: [
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1200",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1200",
    ],
    caption: "התמונה הרביעית לקחה בגדול.",
    tags: ["#תל-אביב", "#שבת", "#שוטוב"],
    likedBy: "amir_gecht",
    time: "2 days ago",
  },
];

/* ===== Component ===== */
export default function InstagramFeed() {
  const [liked, setLiked] = useState({});
  const [carousel, setCarousel] = useState({});
  const [commentsPost, setCommentsPost] = useState(null);

  return (
    <div className="ig-root">

      {/* ===== Stories ===== */}
      <div className="ig-stories">
        <div className="story own">
          <div className="ring">
            <img src={POSTS[0].avatar} alt="" />
          </div>
          <span>Your story</span>
        </div>

        {POSTS.map(p => (
          <div key={p.id} className="story">
            <div className="ring">
              <img src={p.avatar} alt="" />
            </div>
            <span>{p.user}</span>
          </div>
        ))}
      </div>

      {/* ===== Feed ===== */}
      {POSTS.map(post => {
        const index = carousel[post.id] || 0;
        const isLiked = liked[post.id];

        return (
          <article key={post.id} className="ig-post">

            {/* Header */}
            <header className="ig-post-header">
              <div className="ig-user">
                <img src={post.avatar} alt="" />
                <div className="ig-user-meta">
                  <div className="ig-username">{post.user}</div>
                  <div className="ig-location">{post.location}</div>
                </div>
              </div>
              <button className="ig-more">⋯</button>
            </header>

            {/* Media */}
            <div
              className="ig-media"
              onDoubleClick={() =>
                setLiked(l => ({ ...l, [post.id]: true }))
              }
            >
              <motion.img
                key={index}
                src={post.images[index]}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -70 && index < post.images.length - 1)
                    setCarousel(c => ({ ...c, [post.id]: index + 1 }));
                  if (info.offset.x > 70 && index > 0)
                    setCarousel(c => ({ ...c, [post.id]: index - 1 }));
                }}
              />

              {/* Carousel dots */}
              {post.images.length > 1 && (
                <div className="ig-dots">
                  {post.images.map((_, i) => (
                    <span key={i} className={i === index ? "active" : ""} />
                  ))}
                </div>
              )}

              {/* Big heart */}
              <AnimatePresence>
                {isLiked && (
                  <motion.div
                    className="ig-big-heart"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    ♥
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="ig-actions">
              <div className="left">
                <button
                  className={`ig-icon ${isLiked ? "liked" : ""}`}
                  onClick={() =>
                    setLiked(l => ({ ...l, [post.id]: !l[post.id] }))
                  }
                >
                  {isLiked ? "♥" : "♡"}
                </button>
                <button
                  className="ig-icon"
                  onClick={() => setCommentsPost(post)}
                >
                  💬
                </button>
                <button className="ig-icon">✈︎</button>
              </div>
              <button className="ig-icon">🔖</button>
            </div>

            {/* Meta */}
            <div className="ig-likes">
              Liked by <strong>{post.likedBy}</strong> and others
            </div>

            <div className="ig-caption">
              <strong>{post.user}</strong> {post.caption}
            </div>

            <div className="ig-tags">
              {post.tags.map(t => (
                <span key={t}>{t}</span>
              ))}
            </div>

            <div className="ig-time">{post.time}</div>

          </article>
        );
      })}

      {/* ===== Comments Sheet ===== */}
      <AnimatePresence>
        {commentsPost && (
          <motion.div
            className="ig-comments-sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            drag="y"
            dragConstraints={{ top: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120) setCommentsPost(null);
            }}
          >
            <div className="sheet-handle" />
            <h3>Comments</h3>
            <p>No comments yet.</p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
