import React, { useEffect, useRef, useState } from "react";
import "./Articles.css";
import OrbitalSphere3D from "./OrbitalSphere3D";
import { locales } from "./Articles_he";

function useLocale() {
  const [localeKey, setLocaleKey] = useState(() => {
    // try to restore from localStorage
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("localeKey") : null;
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

/** --- A11y-first Modal --- **/
function ArticleModal({ article, t, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => { closeRef.current?.focus(); }, []);

  if (!article) return null;

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-desc">
        <div className="modal-hero" aria-hidden>
          {article.image ? <img src={article.image} alt="" loading="lazy" /> : <div className="modal-hero-fallback" />}
        </div>        
        <header className="modal-header">
          {/* Language Toggle */}
          <h3 id="modal-title" className="modal-title">{article.title}</h3>
          <button ref={closeRef} className="modal-close" onClick={onClose} aria-label={t.ui.closeCta}>✕</button>
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

        <div id="modal-desc" className="modal-body">
          {article.body.split("\n").map((p, i) => <p key={i}>{p}</p>)}
        </div>

        <footer className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>{t.ui.closeCta}</button>
          <a className="btn-accent" href="#" onClick={(e) => e.preventDefault()}>{t.ui.readCta}</a>
        </footer>
      </div>
    </div>
  );
}

export default function Articles() {
  const { t, localeKey, setLocaleKey } = useLocale();
  const isRTL = t.dir === "rtl";

  return (
    <div className={`memory-page ${isRTL ? "rtl" : ""}`}>
      {/* ===== Hero ===== */}
        <div className="locale-switch">
          <button
          className="btn-locale"
          onClick={() => setLocaleKey(localeKey === "en" ? "he" : "en")}
          aria-label="Toggle language"
          >
            {t.ui.toggleLabel}
          </button>
        </div>
      <section className="memory-hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <h1 id="hero-title" className="hero-title">
            {t.ui.heroTitleTop}
            <br />
            <span className="accent">{t.ui.heroTitleAccent}</span>
          </h1>
          <p className="hero-sub">{t.ui.heroSub}</p>
        </div>

        <div className="hero-visual" aria-hidden>
          <div className="canvas-safe sphere-hero">
            <OrbitalSphere3D
              width={700}
              height={700}
              pointCount={1500}
              sphereRadius={1.2}
              autoSize
              dotScale={0.75}
              baseColor="#000000ff"
              beadColor="#ffffffff"
              envIntensity={100.8}
              beadRoughness={100}
              beadMetalness={0.05}
              rimEnabled
              rimColor="#ffffffff"
              rimAlpha={11.9}
              rimPower={11.6}
              rimScale={12.06}
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

      {/* ===== Articles Preview ===== */}
      <section className="articles-preview" aria-labelledby="preview-heading">
        <div className="ap-head">
          <h2 id="preview-heading">{t.ui.sectionTitle}</h2>
          <p className="ap-sub">{t.ui.sectionSub}</p>
        </div>

        <ul className="articles-grid" role="list">
          {t.articles.map((a) => (
            <li key={a.id} className="article-card">
              <button className="card-link" onClick={() => OrbitalSphere3D?.(a)} aria-label={`${a.title}`}>
                <div className="card-media" aria-hidden>
                  {a.image ? <img src={a.image} alt="" loading="lazy" /> : <div className="card-media-fallback" />}
                </div>

                <div className="card-body">
                  <div className="card-tag" aria-label={`Tag ${a.tag}`}>{a.tag}</div>
                  <h3 className="card-title">{a.title}</h3>
                  <p className="card-excerpt">{a.excerpt}</p>
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
      </section>

      {/* Modal — keep state here to retain across language switch if you prefer */}
      <ArticleController t={t} />
    </div>
  );
}

/** Controller to hold modal state separate from list render for clarity */
function ArticleController({ t }) {
  const [openArticle, setOpenArticle] = useState(null);

  // Expose setter to list via global function (lightweight approach).
  // In a real app you'd lift state or use context; here we keep it simple.
  useEffect(() => {
    window.setOpenArticle = setOpenArticle;
    return () => { delete window.setOpenArticle; };
  }, []);

  return (
    <ArticleModal article={openArticle} t={t} onClose={() => setOpenArticle(null)} />
  );
}