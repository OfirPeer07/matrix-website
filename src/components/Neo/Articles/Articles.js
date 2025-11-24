import React, { useEffect, useRef, useState } from "react";
import "./Articles.css";
import OrbitalSphere3D from "./OrbitalSphere3D";
import { locales } from "./Articles_he";

function useLocale() {
  const [localeKey, setLocaleKey] = useState(() => {
    const saved = typeof window !== "undefined"
      ? window.localStorage.getItem("localeKey")
      : null;
    return saved || "en";
  });

  useEffect(() => {
    if (typeof document !== "undefined") {
      const l = locales[localeKey];
      document.documentElement.setAttribute("lang", l.lang);
      document.documentElement.setAttribute("dir", l.dir);
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem("localeKey", localeKey);
    }
  }, [localeKey]);

  const t = locales[localeKey];
  return { t, localeKey, setLocaleKey };
}

/** --- Modal --- **/
function ArticleModal({ article, t, onClose, restoreFocusTo }) {
  const closeCtaRef = useRef(null);

  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => { closeCtaRef.current?.focus(); }, []);

  // Focus trap
  useEffect(() => {
    const modal = document.querySelector(".modal");
    if (!modal) return;
    const q = 'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';
    const focusable = modal.querySelectorAll(q);
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    function trap(e) {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    }
    modal.addEventListener("keydown", trap);
    return () => modal.removeEventListener("keydown", trap);
  }, [article]);

  if (!article) return null;

  function handleClose() {
    onClose();
    if (restoreFocusTo?.current && typeof restoreFocusTo.current.focus === "function") {
      restoreFocusTo.current.focus();
    }
  }

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-desc">
        <div className="modal-hero" aria-hidden>
          {article.image ? (
            <img src={article.image} alt="" loading="lazy" decoding="async" />
          ) : (
            <div className="modal-hero-fallback" />
          )}
        </div>

        <header className="modal-header">
          <h3 id="modal-title" className="modal-title" dir={t.dir}>{article.title}</h3>
        </header>

        <div className="modal-meta">
          <span className="modal-tag">{article.tag}</span>
          <span className="modal-dot" aria-hidden>•</span>
          <time className="modal-date" dateTime={article.date}>
            {new Date(article.date).toLocaleDateString(t.dateLocale, { year: "numeric", month: "short", day: "2-digit" })}
          </time>
          <span className="modal-dot" aria-hidden>•</span>
          <span className="modal-read">
            {article.readTime} {t.ui.readTimeSuffix}
          </span>
        </div>

        <div id="modal-desc" className="modal-body" dir={t.dir}>
          {article.body.split("\n").map((p, i) => <p key={i}>{p}</p>)}
        </div>

        <footer className="modal-footer">
          <button ref={closeCtaRef} className="btn-ghost" onClick={handleClose}>{t.ui.closeCta}</button>
          <a className="btn-accent" href="#" onClick={(e) => e.preventDefault()}>{t.ui.readCta}</a>
        </footer>
      </div>
    </div>
  );
}

export default function Articles() {
  const { t, localeKey, setLocaleKey } = useLocale();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // NEW: toggle class on <html> to hide .sidebar while modal is open
  useEffect(() => {
    const root = document.documentElement;
    if (isModalOpen) root.classList.add("hide-sidebar");
    else root.classList.remove("hide-sidebar");
    return () => root.classList.remove("hide-sidebar");
  }, [isModalOpen]);

  const [page, setPage] = useState(1);
  const pageSize = 8;
  const displayedArticles = t.articles.slice(0, page * pageSize);
  const hasMore = displayedArticles.length < t.articles.length;
  const sentinelRef = useRef(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) setPage(p => (hasMore ? p + 1 : p));
    }, { rootMargin: "400px" });
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, localeKey]);

  useEffect(() => {
    const cards = document.querySelectorAll(".article-card");
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("is-inview"); });
    }, { rootMargin: "80px" });
    cards.forEach(c => io.observe(c));
    return () => io.disconnect();
  }, [displayedArticles, localeKey]);

  const openerRef = useRef(null);

  return (
    <div className="memory-page" dir={t.dir}>
      <div className="locale-switch fixed">
        <button
          className="btn-locale"
          disabled={isModalOpen}
          aria-disabled={isModalOpen}
          title={isModalOpen ? t.ui.closeCta : undefined}
          onClick={() => { if (!isModalOpen) setLocaleKey(localeKey === "en" ? "he" : "en"); }}
          aria-label="Toggle language"
        >
          {t.ui.toggleLabel}
        </button>
      </div>

      <div className="freeze-layout" dir="ltr">
        <section className="memory-hero" aria-labelledby="hero-title">
          <div className="hero-copy" dir={t.dir}>
            <h1 id="hero-title" className="hero-title">
              {t.ui.heroTitleTop}<br /><span className="accent">{t.ui.heroTitleAccent}</span>
            </h1>
            <p className="hero-sub">{t.ui.heroSub}</p>
          </div>

          <div className="hero-visual" aria-hidden>
            <div className="canvas-safe sphere-hero">
              <OrbitalSphere3D
                width={700}
                height={700}
                pointCount={2000}
                sphereRadius={1.25}
                autoSize
                dotScale={0.75}
                baseColor="#010101ff"
                beadColor="#00e608"
                envIntensity={100.8}
                beadRoughness={100}
                beadMetalness={0.05}
                rimEnabled
                rimColor="#00e608"
                rimScale={1.06}
                rimAlpha={1.2}
                rimPower={2.0}
                sensitivity={0.2}
                returnBoost={0.2}
                kickRadius={0.1}
                kickStrength={1.5}
                returnSpring={0.2}
                velDamping={0.92}
                maxVel={4.5}
              />
            </div>
          </div>
        </section>

        <section className="articles-preview" aria-labelledby="preview-heading">
          <div className="ap-head" dir={t.dir}>
            <h2 id="preview-heading">{t.ui.sectionTitle}</h2>
            <p className="ap-sub">{t.ui.sectionSub}</p>
          </div>

          <ul className="articles-grid" role="list">
            {displayedArticles.map((a) => (
              <li key={a.id} className="article-card" role="article" aria-labelledby={`t-${a.id}`}>
                <button
                  className="card-link"
                  aria-describedby={`e-${a.id}`}
                  ref={(el) => { if (el && document.activeElement === el) openerRef.current = el; }}
                  onClick={(e) => {
                    openerRef.current = e.currentTarget;
                    window.setOpenArticle && window.setOpenArticle(a);
                  }}
                >
                  <div className="card-media" aria-hidden>
                    {a.image ? <img src={a.image} alt="" loading="lazy" decoding="async" /> : <div className="card-media-fallback" />}
                  </div>

                  <div className="card-body" dir={t.dir}>
                    <div className="card-tag" aria-label={`Tag ${a.tag}`}>{a.tag}</div>
                    <h3 id={`t-${a.id}`} className="card-title">{a.title}</h3>
                    <p id={`e-${a.id}`} className="card-excerpt">{a.excerpt}</p>
                  </div>

                  <div className="card-meta" aria-label="Article metadata">
                    <time dateTime={a.date} className="meta-date">
                      {new Date(a.date).toLocaleDateString(t.dateLocale, { year: "numeric", month: "short", day: "2-digit" })}
                    </time>
                    <span className="dot" aria-hidden>•</span>
                    <span className="meta-read">{a.readTime} {t.ui.readTimeSuffix}</span>
                    <span className="spacer" />
                    <span className="cta">{t.ui.openCta}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>

          {hasMore && <div ref={sentinelRef} aria-hidden style={{ height: 1 }} />}
        </section>
      </div>

      <ArticleController
        t={t}
        restoreFocusTo={openerRef}
        onOpenChange={(open) => setIsModalOpen(open)}
      />
    </div>
  );
}

/** Controller */
function ArticleController({ t, restoreFocusTo, onOpenChange }) {
  const [openArticle, setOpenArticle] = useState(null);

  useEffect(() => {
    window.setOpenArticle = (a) => { setOpenArticle(a); onOpenChange?.(!!a); };
    return () => { delete window.setOpenArticle; };
  }, [onOpenChange]);

  return (
    <ArticleModal
      article={openArticle}
      t={t}
      onClose={() => { setOpenArticle(null); onOpenChange?.(false); }}
      restoreFocusTo={restoreFocusTo}
    />
  );
}
