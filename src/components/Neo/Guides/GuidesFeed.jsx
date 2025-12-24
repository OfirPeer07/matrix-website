import React, {
  useMemo,
  useState,
  useEffect,
  useMemo as useMemo2,
  useRef,
} from "react";
import "./GuidesFeed.css";
import GuidesReels from "./GuidesReels";

/* --- Demo data --- */
const demoPosts = [
  {
    id: "p1",
    author: "UI Club",
    avatar:
      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=160&h=160&fit=crop&auto=format",
    minutes: 5,
    image:
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1200&auto=format&fit=crop",
    title: {
      en: "CSS animations you'll actually ship",
      he: "אנימציות CSS שבאמת שולחים",
    },
    tags: ["UI", "CSS"],
    likes: 96,
    body: { en: `Motion adds meaning.`, he: `תנועה מוסיפה משמעות.` },
  },
  {
    id: "p2",
    author: "Neo Academy",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&h=160&fit=crop&auto=format",
    minutes: 7,
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=1200&auto=format&fit=crop",
    title: { en: "Intro to React Hooks", he: "מבוא ל-React Hooks" },
    tags: ["React", "Hooks", "JS"],
    likes: 128,
    body: {
      en: `Hooks let you use state and other React features without classes.`,
      he: `Hooks מאפשרים שימוש ב-state ותכונות נוספות ללא מחלקות.`,
    },
  },
];

/* Reels demo */
const demoReels = [
  {
    id: "r1",
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    poster: "",
    caption: "State & Effects — quick tip",
    username: "neoacademy",
  },
  {
    id: "r2",
    src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    poster: "",
    caption: "CSS grid in 60s",
    username: "uiclub",
  },
];

const dict = {
  en: {
    guides: "Guides",
    feed: "Feed",
    profile: "Profile",
    minutes: "min",
    search: "Search",
    searchPlaceholder: "Search guides, authors, tags…",
    caughtUp: "You're All Caught Up",
    older: "View Older Posts",
  },
  he: {
    guides: "מדריכים",
    feed: "פיד",
    profile: "פרופיל",
    minutes: "דק׳",
    search: "חיפוש",
    searchPlaceholder: "חפשו מדריכים, כותבים או תגיות…",
    caughtUp: "הכול מעודכן!",
    older: "הצג פוסטים ישנים",
  },
};

/* RTL helper */
function useRTL(lang) {
  useEffect(() => {
    const el = document.querySelector(".screen-ui");
    if (el) el.setAttribute("dir", lang === "he" ? "rtl" : "ltr");
  }, [lang]);
}

/* ===== Icons ===== */
const Icon = {
  Heart: ({ filled = false, ...p }) =>
    filled ? (
      <svg viewBox="0 0 24 24" {...p}>
        <path
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
          fill="currentColor"
        />
      </svg>
    ) : (
      <svg viewBox="0 0 24 24" {...p}>
        <path
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </svg>
    ),
  Comment: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path
        d="M21 11.5c0 4.7-5 8.5-11.2 8.5-1.9 0-3.7-.3-5.3-.9L3 22l1.1-3.4C3.4 17.2 3 14.9 3 12.5 3 7.8 8 4 14.2 4 19.3 4 21 7.8 21 11.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Share: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path
        d="m21 3-18 8 6 2 2 6 10-16Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Save: ({ filled = false, ...p }) =>
    filled ? (
      <svg viewBox="0 0 24 24" {...p}>
        <path
          d="M18 3H6a1 1 0 0 0-1 1v17l7-4 7 4V4a1 1 0 0 0-1-1Z"
          fill="currentColor"
        />
      </svg>
    ) : (
      <svg viewBox="0 0 24 24" {...p}>
        <path
          d="M18 3H6a1 1 0 0 0-1 1v17l7-4 7 4V4a1 1 0 0 0-1-1Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
  Dots: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
    </svg>
  ),
  Back: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path
        d="M15 4.5 7.5 12 15 19.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  /* Toolbar */
  Home: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path
        d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-10.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Search: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <circle
        cx="11"
        cy="11"
        r="7.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M16.8 16.8 21 21"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
  Plus: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M12 8v8M8 12h8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
  Reels: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M3 9h18M9 4l3 5M15 4l3 5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path d="M12 11.5v5l4-2.5-4-2.5Z" fill="currentColor" />
    </svg>
  ),
  User: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <circle
        cx="12"
        cy="9"
        r="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M5 20a7 7 0 0 1 14 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
};

export default function GuidesFeed() {
  const [theme, setTheme] = useState("dark");
  const [lang, setLang] = useState("he");
  const [view, setView] = useState("feed"); // 'feed' | 'post' | 'reels' | 'profile' | 'search'
  const [selected, setSelected] = useState(null);
  const [liked, setLiked] = useState({});
  const [saved, setSaved] = useState({});
  const [query, setQuery] = useState("");
  const [caughtUp, setCaughtUp] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const scrollRef = useRef(null);
  const touchStartY = useRef(0);
  const pullDist = useRef(0);

  useRTL(lang);
  const t = dict[lang];
  const posts = useMemo(() => demoPosts, []);

  const openPost = (p) => {
    setSelected(p);
    setView("post");
  };
  const toggleLike = (id) => setLiked((m) => ({ ...m, [id]: !m[id] }));
  const toggleSave = (id) => setSaved((m) => ({ ...m, [id]: !m[id] }));
  const handleShare = async (post) => {
    const title = typeof post.title === "object" ? post.title[lang] : post.title;
    const shareData = {
      title,
      text: `${post.author} — ${title}`,
      url: window.location.href,
    };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(shareData.url);
        alert("Link copied");
      }
    } catch {}
  };

  /* ---- Pull to refresh (feed only) ---- */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const threshold = 55;

    function onStart(e) {
      if (el.scrollTop <= 0) {
        touchStartY.current = (e.touches?.[0]?.clientY ?? 0);
        pullDist.current = 0;
      } else {
        touchStartY.current = 0;
      }
    }
    function onMove(e) {
      if (!touchStartY.current) return;
      const y = e.touches?.[0]?.clientY ?? 0;
      pullDist.current = Math.max(0, y - touchStartY.current);
      if (pullDist.current > 0) {
        el.style.setProperty("--pull", Math.min(pullDist.current, 80) + "px");
        el.classList.add("pulling");
      }
      if (pullDist.current > threshold) {
        e.preventDefault();
      }
    }
    function onEnd() {
      if (!touchStartY.current) return;
      const dist = pullDist.current;
      touchStartY.current = 0;
      pullDist.current = 0;
      el.classList.remove("pulling");
      el.style.removeProperty("--pull");
      if (dist > threshold) doRefresh();
    }

    function doRefresh() {
      setIsRefreshing(true);
      // simulate fetch; decide there are no new posts
      setTimeout(() => {
        setIsRefreshing(false);
        setCaughtUp(true);
        // auto hide after a few seconds
        setTimeout(() => setCaughtUp(false), 2200);
      }, 800);
    }

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
    };
  }, [view]);

  // simple search over author + title + tags (both langs)
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return posts.filter((p) => {
      const title =
        typeof p.title === "object"
          ? Object.values(p.title).join(" ").toLowerCase()
          : String(p.title || "").toLowerCase();
      const author = (p.author || "").toLowerCase();
      const tags = (p.tags || []).join(" ").toLowerCase();
      return title.includes(q) || author.includes(q) || tags.includes(q);
    });
  }, [query, posts]);

  return (
    <div className={`gf-root ${theme}`}>
      {/* Header */}
      <div className="gf-top">
        <div className="left">
          <strong>{t.guides}</strong>
        </div>
        <div className="right">
          <button
            className="icon-btn"
            onClick={() => setTheme((s) => (s === "dark" ? "light" : "dark"))}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <button
            className="icon-btn"
            onClick={() => setLang((s) => (s === "en" ? "he" : "en"))}
          >
            {lang === "en" ? "HE" : "EN"}
          </button>
        </div>
      </div>

      {/* Screens */}
      <div className="gf-scroll" ref={scrollRef}>
        {view === "feed" && (
          <>
            <PullIndicator spinning={isRefreshing} />
            <FeedView
              posts={posts}
              liked={liked}
              saved={saved}
              lang={lang}
              t={t}
              openPost={openPost}
              toggleLike={toggleLike}
              toggleSave={toggleSave}
              handleShare={handleShare}
              goProfile={() => setView("profile")}
            />
            {(caughtUp || posts.length === 0) && (
              <CaughtUp
                title={t.caughtUp}
                older={t.older}
                onOlder={() => alert("Older posts")}
              />
            )}
          </>
        )}

        {view === "post" && selected && (
          <PostView
            p={selected}
            lang={lang}
            onBack={() => setView("feed")}
            isLiked={!!liked[selected.id]}
            isSaved={!!saved[selected.id]}
            onLike={() => toggleLike(selected.id)}
            onSave={() => toggleSave(selected.id)}
            onShare={() => handleShare(selected)}
          />
        )}

        {view === "reels" && (
          <GuidesReels
            title="Guides Reels"
            items={demoReels}
            onExit={() => setView("feed")}
          />
        )}

        {view === "profile" && (
          <ProfileView
            posts={posts}
            onBack={() => setView("feed")}
            onOpen={(p) => {
              setSelected(p);
              setView("post");
            }}
          />
        )}

        {view === "search" && (
          <SearchView
            query={query}
            setQuery={setQuery}
            results={results}
            onBack={() => {
              setQuery("");
              setView("feed");
            }}
            onOpen={(p) => {
              setSelected(p);
              setView("post");
            }}
            placeholder={t.searchPlaceholder}
          />
        )}
      </div>

      {/* Toolbar */}
      <BottomNav
        active={view === "post" ? "feed" : view}
        onFeed={() => setView("feed")}
        onReels={() => setView("reels")}
        onSearch={() => setView("search")}
        onAdd={() => console.log("add")}
        onProfile={() => setView("profile")}
      />
    </div>
  );
}

/* ===== Feed view ===== */
function FeedView({
  posts,
  liked,
  saved,
  lang,
  t,
  openPost,
  toggleLike,
  toggleSave,
  handleShare,
  goProfile,
}) {
  return (
    <div className="gf-feed">
      {posts.map((p) => {
        const isLiked = !!liked[p.id];
        const isSaved = !!saved[p.id];
        const likesCount = (p.likes || 0) + (isLiked ? 1 : 0);

        return (
          <article key={p.id} className="gf-card">
            <header className="gf-card-head">
              <img src={p.avatar} alt="" className="avatar" />
              <div className="meta">
                <button className="author as-link" onClick={goProfile}>
                  {p.author}
                </button>
                <div className="time">
                  guide · {p.minutes} {t.minutes}
                </div>
              </div>
              <button className="dots" aria-label="More">
                <Icon.Dots />
              </button>
            </header>

            {/* Feed image: 4:3 */}
            <button
              className="gf-image-wrap"
              onClick={() => openPost(p)}
              aria-label="Open post"
            >
              <img className="gf-image" src={p.image} alt="" />
            </button>

            {/* Actions */}
            <div className="actions">
              <div className="group-left">
                <button
                  className={`ig-btn like ${isLiked ? "liked" : ""}`}
                  onClick={() => toggleLike(p.id)}
                  aria-label="Like"
                >
                  <Icon.Heart className="svg" filled={isLiked} />
                </button>
                <button
                  className="ig-btn comment"
                  onClick={() => openPost(p)}
                  aria-label="Comment"
                >
                  <Icon.Comment className="svg" />
                </button>
                <button
                  className="ig-btn share"
                  onClick={() => handleShare(p)}
                  aria-label="Share"
                >
                  <Icon.Share className="svg" />
                </button>
              </div>
              <div className="spacer" />
              <button
                className={`ig-btn save ${isSaved ? "saved" : ""}`}
                onClick={() => toggleSave(p.id)}
                aria-label="Save"
              >
                <Icon.Save className="svg" />
              </button>
            </div>

            <div className="likes-line" dir="ltr">
              Liked by <strong>spacecase</strong> and{" "}
              <strong>{likesCount}</strong> others
            </div>

            <div className="title">
              {typeof p.title === "object" ? p.title[lang] : p.title}
            </div>
            <div className="tags">
              {p.tags.map((tg) => (
                <span key={tg} className="pill">
                  {tg}
                </span>
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
}

/* ===== Post detail (4:5) ===== */
function PostView({
  p,
  lang,
  onBack,
  isLiked,
  isSaved,
  onLike,
  onSave,
  onShare,
}) {
  const text = p.body?.[lang] || "";
  const [expanded, setExpanded] = useState(false);
  const cut = text.split("\n").slice(0, 2).join("\n");

  return (
    <div className="gf-post">
      <div className="gf-post-top">
        <button className="back" onClick={onBack} aria-label="Back">
          <Icon.Back className="svg" />
        </button>
        <div className="who">
          <img className="avatar" src={p.avatar} alt="" />
          <div className="meta">
            <div className="author">{p.author}</div>
            <div className="time">
              guide · {p.minutes} {dict.en.minutes}
            </div>
          </div>
        </div>
        <button className="dots" aria-label="More">
          <Icon.Dots className="svg" />
        </button>
      </div>

      <div className="gf-image-wrap post">
        <img className="gf-image" src={p.image} alt="" />
      </div>

      <div className="actions">
        <div className="group-left">
          <button
            className={`ig-btn like ${isLiked ? "liked" : ""}`}
            onClick={onLike}
            aria-label="Like"
          >
            <Icon.Heart className="svg" filled={isLiked} />
          </button>
          <button className="ig-btn comment" aria-label="Comment">
            <Icon.Comment className="svg" />
          </button>
          <button className="ig-btn share" onClick={onShare} aria-label="Share">
            <Icon.Share className="svg" />
          </button>
        </div>
        <div className="spacer" />
        <button
          className={`ig-btn save ${isSaved ? "saved" : ""}`}
          onClick={onSave}
          aria-label="Save"
        >
          <Icon.Save className="svg" />
        </button>
      </div>

      <div className="likes-line" dir="ltr">
        Liked by <strong>spacecase</strong> and{" "}
        <strong>{(p.likes || 0) + (isLiked ? 1 : 0)}</strong> others
      </div>

      <div className="gf-post-body">
        <p className={`copy ${expanded ? "expanded" : ""}`}>
          <strong>{p.author}</strong> {expanded ? text : cut}
        </p>
        {text && text.length > cut.length && (
          <button className="more" onClick={() => setExpanded((s) => !s)}>
            {expanded ? "Read less" : "Read more"}
          </button>
        )}
        <div className="tags">
          {p.tags?.map((tg) => (
            <span key={tg} className="pill">
              {tg}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ===== Profile ===== */
function ProfileView({ posts, onBack, onOpen }) {
  return (
    <div className="gf-profile">
      <div className="gf-post-top">
        <button className="back" onClick={onBack} aria-label="Back">
          <Icon.Back className="svg" />
        </button>
        <div className="title-strong">Profile</div>
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
          <button
            key={p.id}
            className="tile"
            onClick={() => onOpen(p)}
            aria-label={`Open ${p.title?.en || p.title}`}
          >
            <img src={p.image} alt="" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ===== Search ===== */
function SearchView({ query, setQuery, results, onBack, onOpen, placeholder }) {
  return (
    <div className="gf-search">
      <div className="gf-post-top">
        <button className="back" onClick={onBack} aria-label="Back">
          <Icon.Back className="svg" />
        </button>
        <div className="title-strong">Search</div>
        <span />
      </div>

      <div className="search-bar">
        <Icon.Search className="svg" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          aria-label="Search"
          autoFocus
        />
        {query && (
          <button className="clear" onClick={() => setQuery("")} aria-label="Clear">
            ✕
          </button>
        )}
      </div>

      {!query && <div className="hint">Try: “react”, “css”, “UI Club”…</div>}

      <div className="search-list">
        {results.map((p) => (
          <button key={p.id} className="search-item" onClick={() => onOpen(p)}>
            <img src={p.image} alt="" />
            <div className="info">
              <div className="ttl">
                {typeof p.title === "object" ? p.title.he || p.title.en : p.title}
              </div>
              <div className="sub">
                {p.author} · {p.tags.join(" • ")}
              </div>
            </div>
          </button>
        ))}
        {query && results.length === 0 && <div className="empty">No results</div>}
      </div>
    </div>
  );
}

/* ===== Pull indicator (top) ===== */
function PullIndicator({ spinning }) {
  return (
    <div className={`pull-indicator ${spinning ? "spin" : ""}`}>
      <div className="dot" />
    </div>
  );
}

/* ===== Caught Up ===== */
function CaughtUp({ title, older, onOlder }) {
  return (
    <div className="caughtup">
      <div className="ring">
        <div className="tick" />
      </div>
      <div className="caughtup-title">{title}</div>
      <button className="older" onClick={onOlder}>
        {older}
      </button>
    </div>
  );
}

/* ===== Toolbar ===== */
function BottomNav({ active = "feed", onFeed, onSearch, onAdd, onReels, onProfile }) {
  return (
    <nav className="gf-nav" role="navigation" aria-label="Instagram bottom bar">
      <button className={`nav-btn ${active === "feed" ? "active" : ""}`} onClick={onFeed}>
        <Icon.Home className="svg" />
        <span>Feed</span>
      </button>
      <button className={`nav-btn ${active === "search" ? "active" : ""}`} onClick={onSearch}>
        <Icon.Search className="svg" />
        <span>Search</span>
      </button>
      <button className="nav-btn big" onClick={onAdd} aria-label="Create">
        <Icon.Plus className="svg" />
      </button>
      <button className={`nav-btn ${active === "reels" ? "active" : ""}`} onClick={onReels}>
        <Icon.Reels className="svg" />
        <span>Reels</span>
      </button>
      <button className={`nav-btn ${active === "profile" ? "active" : ""}`} onClick={onProfile}>
        <Icon.User className="svg" />
        <span>Profile</span>
      </button>
    </nav>
  );
}
