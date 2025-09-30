import React, { useMemo, useState, useRef, useEffect } from "react";
import "./GuidesFeed.css";

/** ───────────────── Demo data ───────────────── */
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

Pro tip: co-locate hooks close to where state is used. Keep effects focused.
Open the full guide for code snippets.`,
      he: `Hooks מאפשרים שימוש בסטייט ותכונות נוספות של React ללא מחלקות.
זה אופציונלי, אבל אחרי שמנסים—קשה לחזור אחורה.

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
    title: { en: "CSS Animations you’ll actually ship", he: "אנימציות CSS שבאמת שולחים לפרוד׳" },
    tags: ["CSS", "UI"],
    likes: 96,
    body: {
      en: `Motion adds meaning. Use it to hint relationships, not to impress.
Prefer transform + opacity for silky, GPU-friendly animations.`,
      he: `תנועה מוסיפה משמעות. השתמשו בה לרמוז על יחסים, לא כדי להרשים.
העדיפו transform + opacity לאנימציות חלקות המואצות ב-GPU.`,
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
    title: { en: "JS Debugging Patterns", he: "דפוסי דיבאגינג ב-JS" },
    tags: ["JS"],
    likes: 203,
    body: {
      en: `Console with purpose, use breakpoints liberally, and learn the Sources tab.
Small logs > huge dumps.`,
      he: `קונסול עם מטרה, ברייקפוינטים בנדיבות, ולהכיר את לשונית Sources.
לוגים קטנים > הצפות.`,
    },
  },
];

const dict = {
  en: {
    guides: "Guides",
    feed: "Feed",
    profile: "Profile",
    likes: "likes",
    readMore: "Read more",
    readLess: "Read less",
    caughtUp: "You're all caught up",
    viewOlder: "View older posts",
    minutes: "min",
    searchTitle: "Recent searches",
    clearAll: "Clear all",
    searchPlaceholder: "Search guides",
  },
  he: {
    guides: "מדריכים",
    feed: "פיד",
    profile: "פרופיל",
    likes: "לייקים",
    readMore: "קרא עוד",
    readLess: "קרא פחות",
    caughtUp: "קיבלת הכל",
    viewOlder: "צפה בפוסטים קודמים",
    minutes: "דק׳",
    searchTitle: "חיפושים אחרונים",
    clearAll: "נקה הכל",
    searchPlaceholder: "חיפוש מדריכים",
  },
};

/** ───────────────── Utilities ───────────────── */
function useRTL(lang) {
  useEffect(() => {
    const root = document.querySelector(".screen-ui");
    if (!root) return;
    root.setAttribute("dir", lang === "he" ? "rtl" : "ltr");
  }, [lang]);
}

/** ───────────────── Icons (minimal, crisp) ───────────────── */
const Icon = {
  Home: ({ active }) => (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden>
      <path
        d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-5H10v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-10.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth={active ? 2.2 : 1.8}
        strokeLinejoin="round"
      />
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden>
      <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  PlusSquare: () => (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  Reels: () => (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden>
      <rect x="3.5" y="4" width="17" height="16.5" rx="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.5 8.5h17M8 4l3 4M13 4l3 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10 11.5l6 3.5-6 3.5v-7z" fill="currentColor" />
    </svg>
  ),
  User: ({ active }) => (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden>
      <circle cx="12" cy="9" r="4" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} />
      <path d="M5 20c1.5-3.5 5-5 7-5s5.5 1.5 7 5" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.8} strokeLinecap="round" />
    </svg>
  ),
};

/** ───────────────── Main component ───────────────── */
export default function GuidesFeed() {
  const [theme, setTheme] = useState("dark");   // 'dark' | 'light'
  const [lang, setLang] = useState("he");       // 'en' | 'he'
  const [tab, setTab] = useState("feed");       // feed | search | compose | reels | profile
  const [view, setView] = useState("feed");     // feed | post | profile  (inner pages)
  const [selected, setSelected] = useState(null);
  const [banner, setBanner] = useState(false);

  useRTL(lang);
  const t = dict[lang];

  // colors per theme
  const colors = {
    bg: theme === "dark" ? "#0b0c0e" : "#f7f8fa",
    card: theme === "dark" ? "#15171b" : "#ffffff",
    text: theme === "dark" ? "#e8eaed" : "#0a0b0e",
    pill: theme === "dark" ? "#1c1f25" : "#eef1f5",
  };

  /** pull-to-refresh feel on feed only */
  const listRef = useRef(null);
  useEffect(() => {
    if (tab !== "feed") return;
    const el = listRef.current;
    if (!el) return;
    let pulling = false;
    let startY = 0;
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
        showBanner();
        pulling = false;
      }
    };
    const onWheel = (e) => {
      if (el.scrollTop <= 0 && e.deltaY < -40) showBanner();
    };
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("wheel", onWheel);
    };
  }, [tab]);

  const showBanner = () => {
    setBanner(true);
    setTimeout(() => setBanner(false), 1400);
  };

  const openPost = (p) => {
    setSelected(p);
    setView("post");
  };

  // list once; feed doesn’t have text search anymore
  const posts = demoPosts;

  return (
    <div className={`gf-root ${theme}`} style={{ background: colors.bg }}>
      {/* Top bar */}
      <div className="gf-top">
        <div className="left"><strong>{t.guides}</strong></div>
        <div className="right">
          {/* show icon of the **other** mode to indicate what will happen */}
          <button
            className="icon-btn"
            title="Toggle theme"
            onClick={() => setTheme((s) => (s === "dark" ? "light" : "dark"))}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <button
            className="icon-btn"
            title="Language"
            onClick={() => setLang((s) => (s === "en" ? "he" : "en"))}
          >
            {lang === "en" ? "EN" : "HE"}
          </button>
        </div>
      </div>

      {/* Scrollable content area */}
      <div className="gf-scroll" ref={listRef}>
        {tab === "feed" && view === "feed" && (
          <>
            {banner && (
              <div className="gf-banner">
                <div className="ring" />
                <div className="txt">
                  <div className="title">{t.caughtUp}</div>
                  <div className="sub">{t.viewOlder}</div>
                </div>
              </div>
            )}

            <div className="gf-feed">
              {posts.map((p) => (
                <article
                  key={p.id}
                  className="gf-card"
                  style={{ background: colors.card, color: colors.text }}
                >
                  <header className="gf-card-head">
                    <img src={p.avatar} alt="" className="avatar" />
                    <div className="meta">
                      <div className="author">{p.author}</div>
                      <div className="time">
                        {p.minutes} {t.minutes} · guide
                      </div>
                    </div>
                    <button className="dots" aria-label="more">•••</button>
                  </header>

                  <div className="gf-image-wrap" onClick={() => openPost(p)}>
                    <img className="gf-image" src={p.image} alt="" />
                  </div>

                  <div className="gf-card-body">
                    <div className="title">{p.title[lang]}</div>
                    <div className="tags">
                      {p.tags.map((tg) => (
                        <span
                          key={tg}
                          className="pill"
                          style={{ background: colors.pill, color: colors.text }}
                        >
                          {tg}
                        </span>
                      ))}
                    </div>

                    <div className="actions">
                      <button className="like">♥</button>
                      <button className="save">🔖</button>
                      <div className="spacer" />
                      <div className="likes">
                        {p.likes.toLocaleString()} {t.likes}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {view === "post" && selected && (
          <PostView
            p={selected}
            lang={lang}
            t={t}
            onBack={() => setView("feed")}
            onOpenProfile={() => {
              setView("profile");
              setTab("profile");
            }}
          />
        )}

        {tab === "profile" && view !== "post" && (
          <ProfileView
            posts={demoPosts}
            t={t}
            onBack={() => {
              setTab("feed");
              setView("feed");
            }}
            onOpen={(p) => {
              setSelected(p);
              setView("post");
            }}
          />
        )}

        {tab === "search" && <SearchView lang={lang} t={t} />}
        {tab === "reels" && <EmptyCentered label="Reels" />}
        {tab === "compose" && <EmptyCentered label="Upload" />}
      </div>

      {/* Bottom bar – Instagram-like icons */}
      <nav className="gf-nav" style={{ background: colors.card, color: colors.text }}>
        <button
          className={`nav-btn ${tab === "feed" ? "active" : ""}`}
          onClick={() => { setTab("feed"); setView("feed"); }}
          aria-label="Feed"
        >
          <Icon.Home active={tab === "feed"} />
          <span>{t.feed}</span>
        </button>

        <button
          className={`nav-btn ${tab === "search" ? "active" : ""}`}
          onClick={() => setTab("search")}
          aria-label="Search"
        >
          <Icon.Search />
          <span>Search</span>
        </button>

        <button
          className={`nav-btn ${tab === "compose" ? "active" : ""}`}
          onClick={() => setTab("compose")}
          aria-label="Upload"
        >
          <Icon.PlusSquare />
        </button>

        <button
          className={`nav-btn ${tab === "reels" ? "active" : ""}`}
          onClick={() => setTab("reels")}
          aria-label="Reels"
        >
          <Icon.Reels />
          <span>Reels</span>
        </button>

        <button
          className={`nav-btn ${tab === "profile" ? "active" : ""}`}
          onClick={() => setTab("profile")}
          aria-label="Profile"
        >
          <Icon.User active={tab === "profile"} />
          <span>{t.profile}</span>
        </button>
      </nav>
    </div>
  );
}

/** ───────────────── Post view ───────────────── */
function PostView({ p, lang, t, onBack, onOpenProfile }) {
  const [expanded, setExpanded] = useState(false);
  const text = p.body[lang];
  const short = text.split("\n").slice(0, 2).join("\n");

  return (
    <div className="gf-post">
      <div className="gf-post-top">
        <button className="back" onClick={onBack} aria-label="Back">←</button>
        <div className="who" onClick={onOpenProfile}>
          <img src={p.avatar} alt="" />
          <div className="meta">
            <div className="author">{p.author}</div>
            <div className="time">{p.minutes} {t.minutes} · guide</div>
          </div>
        </div>
        <button className="dots" aria-label="more">•••</button>
      </div>

      <div className="gf-image-wrap">
        <img className="gf-image" src={p.image} alt="" />
      </div>

      <div className="gf-post-body">
        <h3>{p.title[lang]}</h3>
        <div className="tags">
          {p.tags.map((tg) => <span key={tg} className="pill">{tg}</span>)}
        </div>

        <p className={`copy ${expanded ? "expanded" : ""}`}>{expanded ? text : short}</p>
        <button className="link" onClick={() => setExpanded((s) => !s)}>
          {expanded ? t.readLess : t.readMore}
        </button>
      </div>
    </div>
  );
}

/** ───────────────── Profile (grid) ───────────────── */
function ProfileView({ posts, t, onBack, onOpen }) {
  return (
    <div className="gf-profile">
      <div className="gf-post-top">
        <button className="back" onClick={onBack} aria-label="Back">←</button>
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
          <div><strong>24</strong><span>guides</span></div>
          <div><strong>11k</strong><span>followers</span></div>
          <div><strong>302</strong><span>following</span></div>
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

/** ───────────────── Search view (opens only from bar) ───────────────── */
function SearchView({ lang, t }) {
  const [recent, setRecent] = useState(
    demoPosts.map((p) => ({
      id: p.id,
      title: p.title[lang],
      subtitle: `${p.author} · guide`,
      avatar: p.avatar,
    }))
  );

  const clearAll = () => setRecent([]);

  return (
    <div className="gf-search-view">
      <div className="sv-head">
        <div className="title">{t.searchTitle}</div>
        {recent.length ? (
          <button className="clear" onClick={clearAll}>{t.clearAll}</button>
        ) : (
          <span />
        )}
      </div>

      <div className="sv-input-wrap">
        <input
          className="sv-input"
          placeholder={t.searchPlaceholder}
          // (hook up to real search later)
        />
      </div>

      <ul className="sv-list">
        {recent.map((r) => (
          <li key={r.id} className="sv-item">
            <img src={r.avatar} alt="" className="sv-avatar" />
            <div className="sv-meta">
              <div className="sv-title">{r.title}</div>
              <div className="sv-sub">{r.subtitle}</div>
            </div>
            <button className="sv-remove" aria-label="remove">×</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** ───────────────── Placeholder screens ───────────────── */
function EmptyCentered({ label }) {
  return (
    <div className="empty-center">
      <div className="empty-icon">◎</div>
      <div className="empty-txt">{label}</div>
    </div>
  );
}
