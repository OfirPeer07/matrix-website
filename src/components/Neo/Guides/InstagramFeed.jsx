// src/components/Neo/Guides/InstagramFeed.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./InstagramFeed.css";

/* ===== Mock Data ===== */
const STORIES = [
  {
    id: "own",
    user: "Your story",
    avatar:
      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=120",
    own: true,
  },
  {
    id: 1,
    user: "cv.tips.il",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120",
  },
  {
    id: 2,
    user: "portfolio.lab",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120",
  },
  {
    id: 3,
    user: "junior.network",
    avatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=120",
  },
];

const POSTS = [
  {
    id: 1,
    user: "junior.guides",
    music: "Junior Guides - Soft skills",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120",
    images: [
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200",
    ],
    caption:
      "Soft skills that help you stand out: show ownership, ask clear questions, and communicate progress.",
    tags: ["#softskills", "#portfolio", "#interviews"],
    likedBy: "ofirpeer7",
    time: "2 hours ago",
  },
  {
    id: 2,
    user: "interview.playbook",
    music: "Interview prep - Mock #3",
    avatar:
      "https://images.unsplash.com/photo-1544725176-7c40e5a2c9f9?w=120",
    images: [
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=1200",
    ],
    caption:
      "3 quick interview prep tips: clarify expectations, practice out loud, and review your highlights.",
    tags: ["#interviews", "#tips", "#preparation"],
    likedBy: "neta_dev",
    time: "3 hours ago",
  },
  {
    id: 3,
    user: "portfolio.lab",
    music: "Portfolio Lab - CV in 30 minutes",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120",
    images: [
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=1200",
    ],
    caption:
      "A one-page CV in 30 minutes: role, flagship project, and key technologies.",
    tags: ["#cv", "#jobsearch", "#career"],
    likedBy: "roni_ui",
    time: "1 hour ago",
  },
];

export default function InstagramFeed({
  showHeader = true,
  onOpenDM,
}) {
  const [commentsPost, setCommentsPost] = useState(null);

  return (
    <div className="ig-root">
      {showHeader && (
        <div className="ig-top">
          <div className="ig-status">
            <div className="ig-status-left">
              <span className="ig-time">19:24</span>
              <span className="ig-signal">
                <span />
                <span />
                <span />
                <span />
              </span>
            </div>
            <div className="ig-status-right">
              <span>LTE</span>
              <span className="ig-battery">
                <span>56</span>
                <span className="cell" />
                <span className="cap" />
              </span>
            </div>
          </div>

          <div className="ig-header">
            <button className="ig-header-btn" aria-label="Create">
              <svg viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
            </button>
            <div className="ig-logo">Instagram</div>
            <button className="ig-header-btn heart" aria-label="Activity">
              <svg viewBox="0 0 24 24">
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ===== Stories ===== */}
      <div className="ig-stories">
        {STORIES.map(story => (
          <div key={story.id} className={`story ${story.own ? "own" : ""}`}>
            <div className="ring-wrap">
              <div className="ring">
                <img src={story.avatar} alt="" />
              </div>
              {story.own && <span className="story-plus">+</span>}
            </div>
            <span>{story.user}</span>
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
            <p>Be the first to comment.</p>
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
            <div className="ig-music">
              <span className="ig-music-icon" aria-hidden />
              <span>{post.music}</span>
            </div>
          </div>
        </div>
        <button className="ig-more" aria-label="More">
          ...
        </button>
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
              <span key={i} className={i === index ? "active" : ""} />
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
              <HeartIcon filled />
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
            aria-label="Like"
          >
            <HeartIcon filled={liked} />
          </button>
          <button className="ig-icon big" onClick={onOpenComments} aria-label="Comment">
            <CommentIcon />
          </button>
          <button className="ig-icon big" aria-label="Share">
            <ShareIcon />
          </button>
        </div>
        <button className="ig-icon" aria-label="Save">
          <BookmarkIcon />
        </button>
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

function HeartIcon({ filled = false }) {
  if (filled) {
    return (
      <svg viewBox="0 0 24 24" className="fill">
        <path d="M12 21l-8.8-8.6a5.5 5.5 0 0 1 7.8-7.8l1 1 1-1a5.5 5.5 0 0 1 7.8 7.8z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 23 24">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg viewBox="1 0 20 24">
      <path
        d="M12 4c-4.4 0-8 3-8 6.7 0 2.1 1.2 4 3.2 5.1L7 20l3.2-2.1c.6.1 1.2.2 1.8.2 4.4 0 8-3 8-6.7S16.4 4 12 4z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path
        d="M21.5 4.5L4.5 11.2l7 2.3 2.3 7 7.7-16z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.5 13.5l3.8 3.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
    </svg>
  );
}
