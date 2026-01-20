// src/components/Neo/Guides/InstagramFeed.jsx
import React, { useState, useEffect } from "react";
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

export default function InstagramFeed({
  showHeader = true,
  onOpenDM,
}) {
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
      {POSTS.map(post => (
        <Post
          key={post.id}
          post={post}
          onOpenComments={() => setCommentsPost(post)}
        />
      ))}

      {/* ===== Comments Sheet ===== */}
      <AnimatePresence>
        {commentsPost && (
          <motion.div
            className="ig-comments-sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28 }}
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

/* ===== Single Post ===== */
function Post({ post, onOpenComments }) {
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showHeart, setShowHeart] = useState(false);

  const like = () => {
    setLiked(true);
    setShowHeart(true);
  };

  useEffect(() => {
    if (!showHeart) return;
    const t = setTimeout(() => setShowHeart(false), 700);
    return () => clearTimeout(t);
  }, [showHeart]);

  return (
    <article className="ig-post">

      {/* Post Header */}
      <header className="ig-post-header">
        <div className="ig-user">
          <img src={post.avatar} alt="" />
          <div>
            <div className="ig-username">{post.user}</div>
            <div className="ig-location">{post.location}</div>
          </div>
        </div>
        <button className="ig-more">⋯</button>
      </header>

      {/* Media */}
      <div className="ig-media" onDoubleClick={like}>
        <motion.img
          key={index}
          src={post.images[index]}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={(_, info) => {
            if (info.offset.x < -90 && index < post.images.length - 1)
              setIndex(i => i + 1);
            if (info.offset.x > 90 && index > 0)
              setIndex(i => i - 1);
          }}
        />

        {/* Dots */}
        {post.images.length > 1 && (
          <div className="ig-dots">
            {post.images.map((_, i) => (
              <span
                key={i}
                className={i === index ? "active" : ""}
              />
            ))}
          </div>
        )}

        {/* Big Heart */}
        <AnimatePresence>
          {showHeart && (
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
            className={`ig-icon ${liked ? "liked" : ""}`}
            onClick={() => setLiked(l => !l)}
          >
            {liked ? "♥" : "♡"}
          </button>
          <button className="ig-icon" onClick={onOpenComments}>
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
}
