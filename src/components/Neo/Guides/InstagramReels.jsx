// src/components/Neo/Guides/InstagramReels.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./InstagramReels.css";

const REELS = [
  {
    id: 1,
    user: "junior.playbook",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120",
    caption: "From zero experience to a first interview: real project + one-page CV.",
    likes: "48.3K",
    comments: "1,204",
    reposts: "742",
    shares: "9.8K",
    audio: "Junior Guides - First interview",
    videoUrl: "/vids/high-tech-interview.mp4",
  },
  {
    id: 2,
    user: "cv.tips.il",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=120",
    caption: "One-page CV in 30 minutes: role, flagship project, key technologies.",
    likes: "31.6K",
    comments: "842",
    reposts: "516",
    shares: "6.1K",
    audio: "CV Guide - Quick checklist",
    videoUrl: "/vids/typing.mp4",
  },
  {
    id: 3,
    user: "junior.network",
    avatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=120",
    caption: "Everything is possible: small daily consistency + a clear goal.",
    likes: "62.2K",
    comments: "1,877",
    reposts: "1,103",
    shares: "12.4K",
    audio: "Mindset - Everything is possible",
    videoUrl: "/vids/vsCode-project.mp4",
  },
  {
    id: 4,
    user: "junior.guides",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120",
    caption: "If you were waiting for a sign — this is it. Stay focused and keep going.",
    likes: "71.4K",
    comments: "2,104",
    reposts: "1,402",
    shares: "15.7K",
    audio: "Junior Guides - Keep going",
    videoUrl: "/vids/waiting-for-you.mp4",
  },
];

const FRIENDS = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60",
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=60",
  "https://images.unsplash.com/photo-1544725176-7c40e5a2c9f9?w=60",
];

export default function InstagramReels() {
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeReel, setActiveReel] = useState(0);
  const [uiReelIndex, setUiReelIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showLikeBurst, setShowLikeBurst] = useState(false);
  const wheelLockRef = useRef(false);
  const changeLockRef = useRef(false);
  const progressTimerRef = useRef(null);
  const suppressClickRef = useRef(false);
  const tapStateRef = useRef({ time: 0, x: 0, y: 0 });
  const videoRef = useRef(null);

  useEffect(() => {
    document.body.classList.add("reel-mode");
    return () => {
      document.body.classList.remove("reel-mode");
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    setProgress(0);
    const timeout = setTimeout(() => {
      updateProgress();
      const video = videoRef.current;
      if (video && !video.paused) {
        startProgressTick();
      }
    }, 120);
    return () => clearTimeout(timeout);
  }, [activeReel]);

  const updateProgress = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const current = Math.max(video.currentTime, 0);
    setProgress((current / video.duration) * 100);
  };

  const startProgressTick = () => {
    if (progressTimerRef.current) return;
    progressTimerRef.current = setInterval(() => {
      updateProgress();
    }, 120);
  };

  const stopProgressTick = () => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  };

  const handleTimeUpdate = () => {
    updateProgress();
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    setProgress(0);
    startProgressTick();
  };
  const activeReelData = REELS[activeReel % REELS.length];
  const uiReelData = REELS[uiReelIndex % REELS.length];
  const videoSrc = `${process.env.PUBLIC_URL || ""}${activeReelData.videoUrl}`;

  const changeReel = (dir) => {
    if (changeLockRef.current) return;
    changeLockRef.current = true;
    setTimeout(() => {
      changeLockRef.current = false;
    }, 520);
    setDirection(dir);
    setProgress(0);
    setIsPaused(false);
    stopProgressTick();
    setActiveReel((current) => (current + dir + REELS.length) % REELS.length);
  };


  const handleWheel = (event) => {
    event.preventDefault();
    if (wheelLockRef.current) return;
    if (Math.abs(event.deltaY) < 30) return;
    wheelLockRef.current = true;
    changeReel(event.deltaY > 0 ? 1 : -1);
    setTimeout(() => {
      wheelLockRef.current = false;
    }, 600);
  };

  const handleTogglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPaused(false);
      startProgressTick();
    } else {
      video.pause();
      setIsPaused(true);
      stopProgressTick();
    }
  };

  const handleSurfaceClick = (event) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    const target = event.target;
    if (
      target.closest(".interaction-sidebar") ||
      target.closest(".reels-top") ||
      target.closest(".content-metadata") ||
      target.closest("button")
    ) {
      return;
    }
    if (
      !target.closest(".video-wrapper") &&
      !target.closest(".ui-overlay-gradient")
    ) {
      return;
    }
    handleTogglePlay();
  };

  const handleVideoClick = (event) => {
    event.stopPropagation();
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    handleTogglePlay();
  };

  const handleSurfaceTap = (event) => {
    if (event.button !== 0) return;
    if (suppressClickRef.current) return;
    const now = event.timeStamp;
    const { time, x, y } = tapStateRef.current;
    const dx = Math.abs(event.clientX - x);
    const dy = Math.abs(event.clientY - y);
    const isDoubleTap = now - time < 280 && dx < 24 && dy < 24;
    tapStateRef.current = { time: now, x: event.clientX, y: event.clientY };
    if (isDoubleTap) {
      setIsLiked(true);
      setShowLikeBurst(true);
      setTimeout(() => setShowLikeBurst(false), 420);
      suppressClickRef.current = true;
    }
  };

  return (
    <div
      className="reels-display-unit"
      onWheelCapture={handleWheel}
      onClick={handleSurfaceClick}
      onPointerUpCapture={handleSurfaceTap}
    >
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
        <AnimatePresence
          initial={false}
          custom={direction}
          mode="wait"
          onExitComplete={() => {
            setUiReelIndex(activeReel);
            setIsLiked(false);
          }}
        >
          <motion.div
            key={activeReelData.id}
            className="reel-swipe"
            custom={direction}
            initial={{
              y: direction > 0 ? "100%" : "-100%",
              opacity: 1,
              scale: 1,
            }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{
              y: direction > 0 ? "-100%" : "100%",
              opacity: 1,
              scale: 1,
            }}
            transition={{
              type: "tween",
              duration: 0.4,
              ease: [0.25, 0.6, 0.35, 1],
            }}
          >
            <video
              ref={videoRef}
              className="video-surface"
              src={videoSrc}
              autoPlay
              loop={false}
              muted={isMuted}
              preload="auto"
              playsInline
              onClick={handleVideoClick}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onDurationChange={handleLoadedMetadata}
              onLoadedData={handleLoadedMetadata}
              onPlay={startProgressTick}
              onPause={stopProgressTick}
              onEnded={() => changeReel(1)}
            />
          </motion.div>
        </AnimatePresence>

        {showLikeBurst && (
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 20,
              pointerEvents: "none",
            }}
          >
            <svg viewBox="0 0 24 24" width="92" height="92" fill="none">
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41.81 4.5 2.09C12.09 4.81 13.76 4 15.5 4 18 4 20 6 20 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="rgba(255,255,255,0.95)"
              />
            </svg>
          </div>
        )}

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
          <span>{uiReelData.likes}</span>
        </div>

        <div className="icon-group">
          <svg viewBox="0 0 24 24" className="ig-icon no-fill">
            <path d="M6 6h12a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4H10l-4 3v-3H6a4 4 0 0 1-4-4v-6a4 4 0 0 1 4-4z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{uiReelData.comments}</span>
        </div>

        <div className="icon-group">
          <svg viewBox="0 0 24 24" className="ig-icon no-fill">
            <path d="M16 6l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20 10H9a4 4 0 0 0-4 4v1" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 18l-4-4 4-4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 14h11a4 4 0 0 0 4-4V9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{uiReelData.reposts}</span>
        </div>

        <div className="icon-group">
          <svg viewBox="0 0 24 24" className="ig-icon no-fill">
            <path d="M3.5 11.8L20.5 4.5 13.8 21.5 11 13 3.5 11.8z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11 13l4.7 3.3 2.3-8.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{uiReelData.shares}</span>
        </div>

        <div className="icon-group">
          <span className="more-dots">...</span>
        </div>

        <div className="audio-thumb-container">
          <img src={uiReelData.avatar} className="audio-mini-img" alt="" />
        </div>
      </aside>

      <section className="content-metadata">
        <div className="user-identity">
          <img src={uiReelData.avatar} className="user-avatar" alt="" />
          <span className="user-name">{uiReelData.user}</span>
          <button className="follow-pill-2026">עקוב</button>
        </div>

        <div className="reel-caption">{uiReelData.caption}</div>

        <div className="audio-glass-pill">
          <span className="spinning-icon" aria-hidden />
          <span>{uiReelData.audio}</span>
        </div>
      </section>
    </div>
  );
}
