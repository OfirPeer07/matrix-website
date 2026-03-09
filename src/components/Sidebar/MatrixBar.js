import React, {
  useEffect, useRef, useState, useCallback,
  forwardRef, useImperativeHandle, useMemo
} from 'react';
import { Link } from 'react-router-dom';
import neoIcon from '../../assets/images/neoIcon.png';
import logoIcon from '../../assets/images/logo.png';
import agentSmithIcon from '../../assets/images/agentSmithIcon.png';
import { useLocaleContext } from '../../context/LocaleContext';
import './MatrixBar.css';
import './MatrixBar.mobile.css';


/* ─── Utilities ─────────────────────────────────────────────────────── */
const isMobileDevice = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent || navigator.vendor || window.opera
  );

/* ─── Matrix Rain ────────────────────────────────────────────────────── */
const MATRIX_CHARS =
  'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン' +
  '0123456789ABCDEF<>[]{}|\\=+-*/';

function useMatrixRain(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const FS = 13;
    let drops = [], speeds = [], opacities = [], raf, columns;

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      columns = Math.floor(canvas.width / FS);
      drops = Array.from({ length: columns }, () => Math.random() * -canvas.height / FS);
      speeds = Array.from({ length: columns }, () => 0.3 + Math.random() * 0.6);
      opacities = Array.from({ length: columns }, () => 0.3 + Math.random() * 0.6);
    }

    function draw() {
      ctx.fillStyle = 'rgba(0,0,0,0.16)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${FS}px monospace`;
      for (let i = 0; i < columns; i++) {
        const ch = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
        const bright = Math.random() > 0.88;
        ctx.fillStyle = bright
          ? `rgba(190,255,190,${opacities[i]})`
          : `rgba(23,202,7,${opacities[i] * 0.75})`;
        ctx.fillText(ch, i * FS, drops[i] * FS);
        drops[i] += speeds[i];
        if (drops[i] * FS > canvas.height && Math.random() > 0.97)
          drops[i] = Math.random() * -12;
      }
      raf = requestAnimationFrame(draw);
    }

    resize();
    draw();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [canvasRef]);
}

function MatrixRainCanvas({ className = 'matrix-rain-canvas' }) {
  const ref = useRef(null);
  useMatrixRain(ref);
  return <canvas ref={ref} className={className} aria-hidden="true" />;
}

/* ─── Text Decode Hook ───────────────────────────────────────────────── */
const DECODE_CHARS = 'アイウエ0123456789ABCDEF#$%&@';

function useDecodeText(target, active, charDelay = 45) {
  const [display, setDisplay] = useState(target);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!active) { setDisplay(target); return; }

    let resolved = 0;
    let frame = 0;
    const len = target.length;

    function tick() {
      frame++;
      // Resolve one char every charDelay ms worth of frames (~60fps ≈ every charDelay/16 frames)
      const framesPerChar = Math.max(1, Math.round(charDelay / 16));
      if (frame % framesPerChar === 0 && resolved < len) resolved++;

      let str = '';
      for (let i = 0; i < len; i++) {
        if (i < resolved || target[i] === ' ') {
          str += target[i];
        } else {
          str += DECODE_CHARS[Math.floor(Math.random() * DECODE_CHARS.length)];
        }
      }
      setDisplay(str);
      if (resolved < len) rafRef.current = requestAnimationFrame(tick);
    }

    setDisplay(target.replace(/[^ ]/g, () => DECODE_CHARS[Math.floor(Math.random() * DECODE_CHARS.length)]));
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, target, charDelay]);

  return display;
}

/* ─── Decoded Link ───────────────────────────────────────────────────── */
function DecodedLink({ to, label, delay = 0, panelOpen }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!panelOpen) { setActive(false); return; }
    const t = setTimeout(() => setActive(true), delay);
    return () => clearTimeout(t);
  }, [panelOpen, delay]);

  const text = useDecodeText(label, active, 38);

  return (
    <Link to={to} className="panel-link">
      <span className="panel-link-bracket">[</span>
      <span className="panel-link-text">{text}</span>
      <span className="panel-link-bracket">]</span>
    </Link>
  );
}

/* ─── Section Data ───────────────────────────────────────────────────── */
const SECTIONS = {
  neoIcon: {
    id: 'neoIcon',
    title: { he: 'ניאו //', en: 'NEO //' },
    subtitle: { he: 'מחלקת סייבר', en: 'CYBER DIVISION' },
    links: [
      { to: '/neo/hacking/guides', label: { he: 'מדריכי סייבר', en: 'Hacking Guides' } },
      { to: '/neo/hacking/articles', label: { he: 'מאמרי סייבר', en: 'Hacking Articles' } },
      { to: '/neo/hacking/videos', label: { he: 'סרטוני סייבר', en: 'Hacking Videos' } },
    ],
  },
  logo: {
    id: 'logo',
    title: { he: 'מטריקס //', en: 'MATRIX //' },
    subtitle: { he: 'מערכת ראשית', en: 'MAIN SYSTEM' },
    links: [
      { to: '/neo/works-with', label: { he: 'ספקים וחברות', en: 'Partners & Orgs' } },
      { to: '/thanks', label: { he: 'תודות', en: 'Thanks' } },
      { to: '/contact-us', label: { he: 'צור קשר', en: 'Contact Us' } },
    ],
  },
  agentSmithIcon: {
    id: 'agentSmithIcon',
    title: { he: 'סמית\' //', en: 'SMITH //' },
    subtitle: { he: 'מחלקת בקרה', en: 'CONTROL DIVISION' },
    links: [
      { to: '/agent-smith/agent-smith-department/troubleshooting-guides', label: { he: 'פתרון תקלות', en: 'Troubleshooting' } },
      { to: '/agent-smith/agent-smith-department/technology-news', label: { he: 'חדשות טכנולוגיה', en: 'Tech News' } },
      { to: '/agent-smith/agent-smith-department/building-computers', label: { he: 'בניית מחשבים', en: 'Build PC' } },
    ],
  },
};

/* ─── Command Panel ──────────────────────────────────────────────────── */
function CommandPanel({ section, open, onMouseEnter, onMouseLeave, locale }) {
  const data = SECTIONS[section];
  return (
    <div
      className={`command-panel ${open ? 'panel-open' : ''}`}
      aria-hidden={!open}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Cyber-grid panel background */}
      <div className="panel-bg-grid" aria-hidden="true" />
      {data && (
        <div className="panel-inner">
          <div className="panel-header">
            <span className="panel-title">{data.title[locale]}</span>
            <span className="panel-subtitle">{data.subtitle[locale]}</span>
          </div>
          <div className="panel-links">
            {data.links.map((lk, i) => (
              <DecodedLink
                key={lk.to}
                to={lk.to}
                label={lk.label[locale]}
                delay={i * 90}
                panelOpen={open}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── MatrixBar ──────────────────────────────────────────────────────── */
const MatrixBar = forwardRef(function MatrixBar({ mode = 'both' }, ref) {
  const showNeo = mode === 'neo' || mode === 'both';
  const showSmith = mode === 'agent-smith' || mode === 'both';

  const { locale, toggleLocale } = useLocaleContext();
  const [activeSection, setActiveSection] = useState(null); // which panel is open
  const [panelOpen, setPanelOpen] = useState(false); // animation state
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(null);
  const [mobileClosing, setMobileClosing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const [showBar, setShowBar] = useState(true);


  const timers = useRef({});
  const barRef = useRef(null);
  const touchStartY = useRef(0);
  const lastScrollY = useRef(0);
  const logoScrollRef = useRef(null);

  useImperativeHandle(ref, () => ({
    scrollLogoIntoView: () => logoScrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }));

  useEffect(() => {
    const mobile = isMobileDevice();
    setIsMobile(mobile);
    document.body.classList.toggle('mobile-device', mobile);
  }, []);

  const clear = () => Object.values(timers.current).forEach(clearTimeout);

  /* ── Panel open / close ─────────────────────────────────────────── */
  const openPanel = useCallback((section) => {
    clear();
    if (activeSection === section && panelOpen) return;
    // Switch section instantly if already open
    if (panelOpen && activeSection !== section) {
      setActiveSection(section);
      return;
    }
    setActiveSection(section);
    timers.current.open = setTimeout(() => setPanelOpen(true), 0);
  }, [activeSection, panelOpen]);

  const closePanel = useCallback(() => {
    clear();
    timers.current.close = setTimeout(() => {
      setPanelOpen(false);
      timers.current.clear = setTimeout(() => setActiveSection(null), 320);
    }, 350); // grace period
  }, []);

  const cancelClose = useCallback(() => {
    clearTimeout(timers.current.close);
    clearTimeout(timers.current.clear);
  }, []);

  /* ── Scroll visibility ──────────────────────────────────────────── */
  const handleScroll = useCallback(() => {
    const el = document.querySelector('.content.has-navbar');
    if (!el) return;
    const y = el.scrollTop;
    const up = y < lastScrollY.current || y < 50;
    if (showBar !== up) setShowBar(up);
    if (!up) { setPanelOpen(false); setActiveSection(null); }
    lastScrollY.current = y;
  }, [showBar]);

  /* ── Click outside ──────────────────────────────────────────────── */
  const handleClickOutside = useCallback((e) => {
    if (!barRef.current) return;
    if (barRef.current.contains(e.target)) return;
    setPanelOpen(false);
    setActiveSection(null);
    clear();
  }, []);

  /* ── Touch (mobile) ─────────────────────────────────────────────── */
  const handleTouchStart = (e) => (touchStartY.current = e.touches[0].clientY);
  const handleTouchMove = useCallback((e) => {
    if (!mobileMenu) return;
    if (e.touches[0].clientY - touchStartY.current > 70) closeMobileMenu();
  }, [mobileMenu]); // eslint-disable-line

  const openMobileMenu = (section) => {
    if (mobileMenu === section) { closeMobileMenu(); return; }
    if (mobileMenu) {
      closeMobileMenu();
      setTimeout(() => setMobileMenu(section), 350);
    } else {
      setMobileMenu(section);
    }
  };

  const closeMobileMenu = () => {
    setMobileClosing(true);
    setTimeout(() => { setMobileMenu(null); setMobileClosing(false); }, 350);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    const el = document.querySelector('.content.has-navbar');
    if (el) el.addEventListener('scroll', handleScroll);
    else window.addEventListener('scroll', handleScroll);
    if (isMobile) {
      document.addEventListener('touchstart', handleTouchStart, { passive: true });
      document.addEventListener('touchmove', handleTouchMove, { passive: true });
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (el) el.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      clear();
    };
  }, [isMobile, handleClickOutside, handleTouchMove, handleScroll]);

  /* ── Icon renderer ──────────────────────────────────────────────── */
  const renderIcon = (sectionKey, src, alt, to) => {
    const isActive = activeSection === sectionKey && panelOpen;
    return (
      <li
        key={sectionKey}
        className={`bar-icon ${isActive ? 'icon-active' : ''}`}
        onMouseEnter={() => !isMobile && openPanel(sectionKey)}
        onMouseLeave={() => !isMobile && closePanel()}
      >
        <Link
          to={to}
          className="menu-icon"
          onClick={(e) => {
            if (isMobile) { e.preventDefault(); openMobileMenu(sectionKey); }
          }}
          aria-expanded={isActive}
        >
          <span className="icon-ring" />
          <img src={src} alt={alt} />
          <span className="icon-glow" />
          <span className="fx-scan" aria-hidden="true" />
        </Link>
      </li>
    );
  };

  /* ── Build item list — Logo always rightmost ────────────────────── */
  const items = useMemo(() => {
    const list = [];
    if (mode === 'neo') {
      // Logo on right (index 0 in RTL), Neo on left
      list.push(renderIcon('logo', logoIcon, locale === 'he' ? 'לוגו' : 'Logo', '/'));
      if (showNeo) list.push(renderIcon('neoIcon', neoIcon, locale === 'he' ? 'ניאו' : 'Neo', '/neo/hacking'));
    } else if (mode === 'agent-smith') {
      // Logo on right, Smith on left
      list.push(renderIcon('logo', logoIcon, locale === 'he' ? 'לוגו' : 'Logo', '/'));
      if (showSmith) list.push(renderIcon('agentSmithIcon', agentSmithIcon, locale === 'he' ? 'סוכן סמית\'' : 'Agent Smith', '/agent-smith/agent-smith-department'));
    } else {
      // Both mode: Logo | Neo | Smith (Logo on far right in RTL)
      list.push(renderIcon('logo', logoIcon, locale === 'he' ? 'לוגו' : 'Logo', '/'));

      // Global Language Toggle
      list.push(
        <li key="lang-toggle" className="bar-icon lang-toggle-item">
          <button
            className="menu-icon lang-btn"
            onClick={toggleLocale}
            title={locale === 'he' ? 'Switch to English' : 'החלף לעברית'}
          >
            <span className="icon-ring" />
            <span className="lang-text">{locale === 'he' ? 'EN' : 'HE'}</span>
            <span className="icon-glow" />
          </button>
        </li>
      );

      if (showNeo) list.push(renderIcon('neoIcon', neoIcon, locale === 'he' ? 'ניאו' : 'Neo', '/neo/hacking'));
      if (showSmith) list.push(renderIcon('agentSmithIcon', agentSmithIcon, locale === 'he' ? 'סוכן סמית\'' : 'Agent Smith', '/agent-smith/agent-smith-department'));
    }
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, showNeo, showSmith, activeSection, panelOpen, isMobile, locale, toggleLocale]);

  /* ── Mobile bottom sheet ────────────────────────────────────────── */
  const MobileSheet = () => {
    if (!isMobile || !mobileMenu) return null;
    const data = SECTIONS[mobileMenu];
    return (
      <>
        <div className="mobile-overlay" onClick={closeMobileMenu} />
        <div className={`mobile-sheet ${mobileClosing ? 'closing' : ''}`}
          onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}>
          <div className="swipe-indicator" />
          <button className="close-sheet-btn" onClick={closeMobileMenu} aria-label={locale === 'he' ? 'סגור' : 'Close'}>✕</button>
          <div className="sheet-header">
            <span className="sheet-title">{data?.title[locale]}</span>
            <span className="sheet-subtitle">{data?.subtitle[locale]}</span>
          </div>
          {data?.links.map((lk, i) => (
            <Link key={lk.to} to={lk.to} className="sheet-link" onClick={closeMobileMenu}
              style={{ animationDelay: `${i * 80}ms` }}>
              <span className="sheet-link-bracket">[</span>
              {lk.label[locale]}
              <span className="sheet-link-bracket">]</span>
            </Link>
          ))}
        </div>
      </>
    );
  };

  /* ── Intelligent Mobile Menu Logic ──────────────────────────────── */
  const mobileContent = useMemo(() => {
    if (!isMobile) return null;

    // Determine current priority section based on mode
    let currentSectionKey = 'logo';
    if (mode === 'neo') currentSectionKey = 'neoIcon';
    if (mode === 'agent-smith') currentSectionKey = 'agentSmithIcon';

    const primaryLinks = SECTIONS[currentSectionKey]?.links || [];

    // Other top-level destinations
    const otherDestinations = [];
    if (mode !== 'neo' && showNeo) otherDestinations.push({ to: '/neo/hacking', label: { he: 'ניאו', en: 'NEO' }, icon: neoIcon });
    if (mode !== 'agent-smith' && showSmith) otherDestinations.push({ to: '/agent-smith/agent-smith-department', label: { he: 'סמית\'', en: 'SMITH' }, icon: agentSmithIcon });
    if (mode !== 'both') otherDestinations.push({ to: '/', label: { he: 'ראשי', en: 'HOME' }, icon: logoIcon });

    return {
      primaryLinks,
      otherDestinations,
      title: SECTIONS[currentSectionKey]?.title[locale] || 'SYSTEM',
      subtitle: SECTIONS[currentSectionKey]?.subtitle[locale] || 'NEURAL LINK'
    };
  }, [isMobile, mode, locale, showNeo, showSmith]);

  /* ── Render ─────────────────────────────────────────────────────── */

  return (
    <>
      {/* Mobile Hamburger Trigger */}
      {isMobile && (
        <button
          className={`mobile-hamburger ${mobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle Menu"
        >
          <span className="ham-line" />
          <span className="ham-line" />
          <span className="ham-line" />
        </button>
      )}

      {/* Neural Link Overlay (Full Screen Mobile Nav) */}
      {isMobile && (
        <div className={`neural-link-overlay ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="neural-link-rain">
            <MatrixRainCanvas />
          </div>

          <div className="neural-link-content">
            <div className="neural-header">
              <span className="neural-title">{mobileContent?.title}</span>
              <div className="neural-status-line">
                <span className="status-dot pulsing" />
                <span className="status-text">{mobileContent?.subtitle?.toUpperCase()} // ACTIVE</span>
              </div>
            </div>

            {/* Primary Context Links */}
            <div className="neural-section">
              <div className="section-label">{locale === 'he' ? 'גישה לטרמינל //' : 'TERMINAL ACCESS //'}</div>
              <div className="neural-grid">
                {mobileContent?.primaryLinks.map((lk, i) => (
                  <Link key={lk.to} to={lk.to} className="neural-terminal-link" onClick={toggleMobileMenu}>
                    <span className="bracket">[</span>
                    <span className="label">{lk.label[locale]}</span>
                    <span className="bracket">]</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Global Destinations */}
            <div className="neural-section">
              <div className="section-label">{locale === 'he' ? 'ניווט מערכת //' : 'SYSTEM NAVIGATION //'}</div>
              <div className="neural-nav-group">
                {mobileContent?.otherDestinations.map(dest => (
                  <Link key={dest.to} to={dest.to} className="neural-nav-item" onClick={toggleMobileMenu}>
                    <img src={dest.icon} alt="" className="nav-icon" />
                    <span className="nav-label">{dest.label[locale]}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Global System Links (Contact Us, Thanks) */}
            <div className="neural-section">
              <div className="section-label">{locale === 'he' ? 'גישה גלובלית //' : 'GLOBAL ACCESS //'}</div>
              <div className="neural-grid">
                <Link to="/contact-us" className="neural-terminal-link" onClick={toggleMobileMenu}>
                  <span className="bracket">[</span>
                  <span className="label">{locale === 'he' ? 'צור קשר' : 'Contact Us'}</span>
                  <span className="bracket">]</span>
                </Link>
                <Link to="/thanks" className="neural-terminal-link" onClick={toggleMobileMenu}>
                  <span className="bracket">[</span>
                  <span className="label">{locale === 'he' ? 'תודות' : 'Thanks'}</span>
                  <span className="bracket">]</span>
                </Link>
              </div>
            </div>

            <div className="neural-footer">
              <button className="neural-action-btn" onClick={() => { toggleLocale(); }}>
                <span className="icon">🌐</span>
                <span>{locale === 'he' ? 'Switch to English' : 'החלף לעברית'}</span>
              </button>
            </div>
          </div>

        </div>
      )}

      <div
        ref={barRef}
        className={`sidebar ${showBar && !isMobile ? 'visible' : 'hidden'}`}
      >

        {/* Cyber-grid bar background elements */}
        <div className="bar-grid" aria-hidden="true" />
        <div className="bar-fog" aria-hidden="true" />
        <div className="bar-horizon" aria-hidden="true" />
        <div className="bar-scanlines" aria-hidden="true" />

        {/* Icon strip */}
        <ul className="icon-strip">{items}</ul>

        {/* Full-width command panel (desktop) */}
        {!isMobile && (
          <CommandPanel
            section={activeSection}
            open={panelOpen}
            onMouseEnter={cancelClose}
            onMouseLeave={closePanel}
            locale={locale}
          />
        )}

        {/* Mobile */}
        <MobileSheet />
      </div>
      <div ref={logoScrollRef} style={{ height: 1 }} />
    </>
  );
});

export default MatrixBar;
