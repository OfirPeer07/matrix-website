// src/components/Neo/Guides/GuidesFeed.jsx
import React, { useMemo, useState, useRef, useEffect } from "react";
import "./GuidesFeed.css";
import GuidesReels from "./GuidesReels"; // ← שימוש בקיים שלך (GuidesReels.jsx)

/**
 * Instagram-like Guides feed inside the iPhone mockup.
 * Views: feed | post | profile | reels
 * Bottom bar: Home / Search / Add / Reels / Profile
 * Search opens only when tapping the bar's Search.
 */

// ---------- FEED DEMO DATA ----------
const demoPosts = [
  {
    id: "p1",
    author: "Neo Academy",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&auto=format",
    minutes: 7,
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=1200&auto=format&fit=crop",
    title: { en: "Intro to React Hooks", he: "מבוא ל-React Hooks" },
    tags: ["React", "Hooks", "JS"],
    likes: 128,
    body: {
      en: `Hooks let you use state and other React features without writing a class.
They are fully opt-in, but once you try them you may never go back.

Quick start:
1) useState for local state
2) useEffect for side-effects
3) useMemo/useCallback to optimize re-renders

Pro tip: co-locate hooks close to where state is used.
Open the full guide for code snippets.`,
      he: `Hooks מאפשרים שימוש בסטייט ותכונות נוספות של React ללא מחלקות.
זה אופציונלי, אבל אחרי שמנסים — קשה לחזור אחורה.

התחלה מהירה:
1) useState לסטייט מקומי
2) useEffect לפעולות צד
3) useMemo/useCallback לאופטימיזציה של רינדורים

טיפ: למקם hooks קרוב לשימוש בסטייט ולשמור על Effects ממוקדים.
פתחו את המדריך המלא לדוגמאות קוד.`,
    },
  },
  {
    id: "p2",
    author: "UI Club",
    avatar:
      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=100&h=100&fit=crop&auto=format",
    minutes: 5,
    image:
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1200&auto=format&fit=crop",
    title: { en: "CSS animations you'll ship", he: "אנימציות CSS שבאמת שולחים" },
    tags: ["CSS", "UI"],
    likes: 96,
    body: {
      en: `Motion adds meaning. Prefer transform + opacity for silky, GPU-friendly animations.`,
      he: `תנועה מוסיפה משמעות. העדיפו transform + opacity לאנימציות חלקות על ה-GPU.`,
    },
  },
  {
    id: "p3",
    author: "Dev Snacks",
    avatar:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=100&h=100&fit=crop&auto=format",
    minutes: 9,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&auto=format&fit=crop",
    title: { en: "JS debugging patterns", he: "דפוסי דיבוג ב-JS" },
    tags: ["JS"],
    likes: 203,
    body: {
      en: `Console with purpose, use breakpoints liberally, and learn the Sources tab.`,
      he: `קונסול עם מטרה, ברייקפוינטים בנדיבות, ולהכיר את לשונית Sources.`,
    },
  },
];

// ---------- STRINGS ----------
const dict = {
  en: {
    guides: "Guides",
    feed: "Feed",
    profile: "Profile",
    likes: "likes",
    readMore: "Read more",
    readLess: "Read less",
    minutes: "min",
    search: "Search",
    recent: "Recent searches",
    clearAll: "Clear all",
    caughtUp: "You're all caught up",
    older: "View older posts",
  },
  he: {
    guides: "מדריכים",
    feed: "פיד",
    profile: "פרופיל",
    likes: "לייקים",
    readMore: "קרא עוד",
    readLess: "קרא פחות",
    minutes: "דק׳",
    search: "חיפוש",
    recent: "חיפושים אחרונים",
    clearAll: "נקה הכל",
    caughtUp: "קיבלת הכל",
    older: "צפה בפוסטים קודמים",
  },
};

function useRTL(lang) {
  useEffect(() => {
    const root = document.querySelector(".screen-ui");
    if (!root) return;
    root.setAttribute("dir", lang === "he" ? "rtl" : "ltr");
  }, [lang]);
}

/** Simple icon set (SVG, no library) */
const Icon = {
  Home: (p) => (
    <svg viewBox="0 0 24 24" width="22" height="22" {...p}>
      <path
        d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-10.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Search: (p) => (
    <svg viewBox="0 0 24 24" width="22" height="22" {...p}>
      <circle cx="11" cy="11" r="7.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16.8 16.8 21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  Plus: (p) => (
    <svg viewBox="0 0 24 24" width="22" height="22" {...p}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  Reels: (p) => (
    <svg viewBox="0 0 24 24" width="22" height="22" {...p}>
      <rect x="3" y="4" width="18" height="16" rx="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 9h18M9 4l3 5M15 4l3 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 11.5v5l4-2.5-4-2.5Z" fill="currentColor" />
    </svg>
  ),
  User: (p) => (
    <svg viewBox="0 0 24 24" width="22" height="22" {...p}>
      <circle cx="12" cy="9" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 20a7 7 0 0 1 14 0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  Dots: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" {...p}>
      <circle cx="5" cy="12" r="1.6" fill="currentColor" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      <circle cx="19" cy="12" r="1.6" fill="currentColor" />
    </svg>
  ),
  Heart: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" {...p}>
      <path d="M12 20s-7-4.7-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.3-7 10-7 10Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  Save: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" {...p}>
      <path d="M5 4h14v16l-7-4-7 4V4Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  ),
  Back: (p) => (
    <svg viewBox="0 0 24 24" width="22" height="22" {...p}>
      <path d="M15 5 8 12l7 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

export default function GuidesFeed({ reelsItems }) {
  const [theme, setTheme] = useState("dark");
  const [lang, setLang] = useState("he");
  const [view, setView] = useState("feed"); // feed | post | profile | reels
  const [selected, setSelected] = useState(null);
  const [banner, setBanner] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  useRTL(lang);
  const t = dict[lang];
  const listRef = useRef(null);

  const posts = useMemo(() => demoPosts, []);

  // pull-to-refresh banner
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    let pulling = false,
      startY = 0;

    const onTouchStart = (e) => {
      if (el.scrollTop <= 0) {
        pulling = true;
        startY = e.touches[0].clientY;
      }
    };
    const onTouchMove = (e) => {
      if (!pulling) return;
      const dy = e.touches[0].clientY - startY;
      if (dy > 65 && el.scrollTop <= 0) {
        showPullBanner();
        pulling = false;
      }
    };
    const onTouchEnd = () => (pulling = false);
    const onWheel = (e) => {
      if (el.scrollTop <= 0 && e.deltaY < -40) showPullBanner();
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("wheel", onWheel, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("wheel", onWheel);
    };
  }, []);

  const showPullBanner = () => {
    setBanner(true);
    setTimeout(() => setBanner(false), 1400);
  };

  const colors = {
    bg: theme === "dark" ? "#0b0c0e" : "#f7f8fa",
    card: theme === "dark" ? "#17181c" : "#ffffff",
    cardRaised: theme === "dark" ? "#1b1d22" : "#ffffff",
    text: theme === "dark" ? "#e8eaed" : "#0b0c0e",
    sub: theme === "dark" ? "#a4a8b3" : "#4b5563",
    pill: theme === "dark" ? "#20232a" : "#eef1f5",
    divider: theme === "dark" ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.08)",
  };

  const openPost = (p) => {
    setSelected(p);
    setView("post");
  };

  // Default reels demo (used only if you לא מעביר reelsItems בפרופס)
  const demoReels = [
    {
      id: "r1",
      src: "/assets/reels/clip1.mp4",
      poster: "/assets/reels/clip1.jpg",
      caption: "State & Effects — quick tip",
      username: "neoacademy",
      timestamp: "2025-08-20T12:00:00Z",
    },
    {
      id: "r2",
      src: "/assets/reels/clip2.mp4",
      poster: "/assets/reels/clip2.jpg",
      caption: "CSS grid layout in 60s",
      username: "uiclub",
    },
  ];

  return (
    <div className={`gf-root ${theme}`} style={{ background: colors.bg }}>
      {/* Header */}
      <div className="gf-top">
        <div className="left">
          <strong>{t.guides}</strong>
        </div>
        <div className="right">
          {/* מציג את האייקון של המצב הבא */}
          <button className="icon-btn" title="Toggle theme" onClick={() => setTheme((s) => (s === "dark" ? "light" : "dark"))}>
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <button className="icon-btn lang" title="Language" onClick={() => setLang((s) => (s === "en" ? "he" : "en"))}>
            {lang === "en" ? "HE" : "EN"}
          </button>
        </div>
      </div>

      {/* Scrollable content area */}
      <div className="gf-scroll" ref={listRef}>
        {banner && (
          <div className="gf-banner" role="status" aria-live="polite">
            <div className="ring" />
            <div className="txt">
              <div className="title">{t.caughtUp}</div>
              <div className="sub">{t.older}</div>
            </div>
          </div>
        )}

        {view === "feed" && (
          <div className="gf-feed">
            {posts.map((p) => (
              <article
                key={p.id}
                className="gf-card"
                style={{ background: colors.card, color: colors.text, borderColor: colors.divider }}
              >
                <header className="gf-card-head">
                  <img src={p.avatar} alt="" className="avatar" />
                  <div className="meta">
                    <div className="author">{p.author}</div>
                    <div className="time">
                      {p.minutes} {t.minutes} · guide
                    </div>
                  </div>
                  <button className="dots" aria-label="More">
                    <Icon.Dots />
                  </button>
                </header>

                <button className="gf-image-wrap" onClick={() => openPost(p)} aria-label="Open guide">
                  <img className="gf-image" src={p.image} alt="" />
                </button>

                <div className="gf-card-body">
                  <div className="title">{p.title[lang]}</div>
                  <div className="tags">
                    {p.tags.map((tg) => (
                      <span key={tg} className="pill" style={{ background: colors.pill }}>
                        {tg}
                      </span>
                    ))}
                  </div>

                  <div className="actions">
                    <button className="like" aria-label="Like">
                      <Icon.Heart />
                    </button>
                    <button className="save" aria-label="Save">
                      <Icon.Save />
                    </button>
                    <div className="spacer" />
                    <div className="likes">
                      {p.likes.toLocaleString()} {t.likes}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {view === "post" && selected && (
          <PostView
            p={selected}
            colors={colors}
            lang={lang}
            t={t}
            onBack={() => setView("feed")}
            onOpenProfile={() => setView("profile")}
          />
        )}

        {view === "profile" && (
          <ProfileView
            posts={demoPosts}
            t={t}
            colors={colors}
            onBack={() => setView("feed")}
            onOpen={(p) => {
              setSelected(p);
              setView("post");
            }}
          />
        )}

        {view === "reels" && (
          <GuidesReels
            title="Guides Reels"
            items={Array.isArray(reelsItems) && reelsItems.length ? reelsItems : demoReels}
            onExit={() => setView("feed")} // אופציונלי: אם יש לך כפתור Back בתוך הרילס
          />
        )}
      </div>

      {/* Search sheet (full screen inside the phone) */}
      {showSearch && <SearchSheet t={t} theme={theme} onClose={() => setShowSearch(false)} />}

      {/* Bottom nav (no visual changes) */}
      <nav className="gf-nav" style={{ background: colors.cardRaised, borderTopColor: colors.divider, color: colors.text }}>
        <button className={`nav-btn ${view === "feed" ? "active" : ""}`} onClick={() => setView("feed")}>
          <Icon.Home />
          <span>{t.feed}</span>
        </button>

        <button className="nav-btn" onClick={() => setShowSearch(true)}>
          <Icon.Search />
          <span>{t.search}</span>
        </button>

        <button className="nav-btn big" aria-label="Add">
          <Icon.Plus />
        </button>

        <button className={`nav-btn ${view === "reels" ? "active" : ""}`} onClick={() => setView("reels")} aria-label="Reels">
          <Icon.Reels />
          <span>Reels</span>
        </button>

        <button className={`nav-btn ${view === "profile" ? "active" : ""}`} onClick={() => setView("profile")}>
          <Icon.User />
          <span>{t.profile}</span>
        </button>
      </nav>
    </div>
  );
}

/** Post detail */
function PostView({ p, colors, lang, t, onBack, onOpenProfile }) {
  const [expanded, setExpanded] = useState(false);
  const text = p.body[lang];
  const cut = text.split("\n").slice(0, 2).join("\n");

  return (
    <div className="gf-post">
      <div className="gf-post-top">
        <button className="back" onClick={onBack} aria-label="Back">
          <Icon.Back />
        </button>
        <button className="who" onClick={onOpenProfile}>
          <img src={p.avatar} alt="" />
          <div className="meta">
            <div className="author">{p.author}</div>
            <div className="time">
              {p.minutes} {t.minutes} · guide
            </div>
          </div>
        </button>
        <button className="dots" aria-label="More">
          <Icon.Dots />
        </button>
      </div>

      <div className="gf-image-wrap">
        <img className="gf-image" src={p.image} alt="" />
      </div>

      <div className="gf-post-body">
        <h3>{p.title[lang]}</h3>
        <div className="tags">{p.tags.map((tg) => <span key={tg} className="pill">{tg}</span>)}</div>

        <p className={`copy ${expanded ? "expanded" : ""}`}>{expanded ? text : cut}</p>
        <button className="link" onClick={() => setExpanded((s) => !s)}>
          {expanded ? t.readLess : t.readMore}
        </button>
      </div>
    </div>
  );
}

/** Profile grid */
function ProfileView({ posts, t, colors, onBack, onOpen }) {
  return (
    <div className="gf-profile">
      <div className="gf-post-top">
        <button className="back" onClick={onBack} aria-label="Back">
          <Icon.Back />
        </button>
        <div className="title-strong">{t.profile}</div>
        <span />
      </div>

      <div className="gf-profile-head">
        <img
          className="avatar lg"
          src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=160&h=160&fit=crop&auto=format"
          alt=""
        />
        <div className="stats">
          <div>
            <strong>24</strong>
            <span>guides</span>
          </div>
          <div>
            <strong>11k</strong>
            <span>followers</span>
          </div>
          <div>
            <strong>302</strong>
            <span>following</span>
          </div>
        </div>
      </div>

      <div className="gf-grid">
        {posts.map((p) => (
          <button key={p.id} className="tile" onClick={() => onOpen(p)}>
            <img src={p.image} alt="" />
          </button>
        ))}
      </div>
    </div>
  );
}

/** Full-screen search sheet */
function SearchSheet({ t, theme, onClose }) {
  const [recent, setRecent] = useState([
    {
      id: "r1",
      title: "React",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&h=60&fit=crop&auto=format",
    },
    {
      id: "r2",
      title: "CSS grid",
      avatar:
        "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=60&h=60&fit=crop&auto=format",
    },
    {
      id: "r3",
      title: "JavaScript",
      avatar:
        "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=60&h=60&fit=crop&auto=format",
    },
  ]);
  const clearAll = () => setRecent([]);

  return (
    <div className={`gf-search-sheet ${theme}`} role="dialog" aria-modal="true">
      <div className="sheet-head">
        <button className="close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <div className="title">{t.search}</div>
        <span />
      </div>

      <div className="sheet-body">
        <div className="section-head">
          <span>{t.recent}</span>
          {!!recent.length && (
            <button className="link" onClick={clearAll}>
              {t.clearAll}
            </button>
          )}
        </div>

        <div className="recent-list">
          {recent.length === 0 ? (
            <div className="empty">—</div>
          ) : (
            recent.map((r) => (
              <div key={r.id} className="row">
                <img src={r.avatar} alt="" />
                <span>{r.title}</span>
                <button className="x" aria-label="Remove">
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
