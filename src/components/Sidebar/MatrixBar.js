import React, {
  useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle
} from 'react';
import { Link } from 'react-router-dom';
import neoIcon from "../../assets/images/neoIcon.png";
import logoIcon from "../../assets/images/logo.png";
import agentSmithIcon from "../../assets/images/agentSmithIcon.png";
import './MatrixBar.css';

const isMobileDevice = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent || navigator.vendor || window.opera
  );

const MatrixBar = forwardRef(function MatrixBar({ mode = 'both' }, ref) {
  // mode: 'neo' | 'agent-smith' | 'both'
  const showNeo   = mode === 'neo' || mode === 'both';
  const showSmith = mode === 'agent-smith' || mode === 'both';
  const showLogo  = true; // logo always visible

  const [activeMenu, setActiveMenu] = useState(null); // 'logo' | 'neoIcon' | 'agentSmithIcon' | null
  const [isMobile, setIsMobile] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showBar, setShowBar] = useState(true);

  // מי זז שמאלה כשמרחפים על הלוגו
  const [shiftLeftNeighbor, setShiftLeftNeighbor] = useState(false);
  // דגל לחזרה איטית
  const [isReturning, setIsReturning] = useState(true);

  const menuRef = useRef(null);
  const timersRef = useRef({});
  const touchStartY = useRef(0);
  const lastScrollY = useRef(0);
  const logoScrollTargetRef = useRef(null);

  useImperativeHandle(ref, () => ({
    scrollLogoIntoView: () => logoScrollTargetRef.current?.scrollIntoView({ behavior: 'smooth' })
  }));

  useEffect(() => {
    const mobile = isMobileDevice();
    setIsMobile(mobile);
    document.body.classList.toggle('mobile-device', mobile);
  }, []);

  const clearAllTimeouts = () =>
    Object.values(timersRef.current).forEach((t) => clearTimeout(t));

  const closeMenuWithAnimation = useCallback(() => {
    if (!activeMenu) return;
    setIsClosing(true);
    setTimeout(() => { setActiveMenu(null); setIsClosing(false); }, 350);
  }, [activeMenu]);

  const handleClickOutside = useCallback((event) => {
    if (!menuRef.current) return;
    if (menuRef.current.contains(event.target)) return;

    if (isMobile) {
      const hit = event.target.closest('.dropdown-menu') || event.target.closest('.menu-icon');
      if (!hit) closeMenuWithAnimation();
    } else {
      // סגירה + חזרה איטית
      setActiveMenu(null);
      setIsReturning(true);
      setShiftLeftNeighbor(false);
      timersRef.current.returnDone = setTimeout(() => setIsReturning(false), 1050);
    }
  }, [isMobile, closeMenuWithAnimation]);

  const handleTouchStart = (e) => (touchStartY.current = e.touches[0].clientY);
  const handleTouchMove = useCallback((e) => {
    if (!activeMenu) return;
    const deltaY = e.touches[0].clientY - touchStartY.current;
    if (deltaY > 70) closeMenuWithAnimation();
  }, [activeMenu, closeMenuWithAnimation]);

  const handleScroll = () => {
    const y = window.scrollY;
    const up = y < lastScrollY.current;
    if (showBar !== up) setShowBar(up);
    lastScrollY.current = y;
  };

  // Desktop hover + shift behavior
  const onEnter = (type) => {
    if (isMobile) return;
    clearAllTimeouts();

    if (type === 'logo' && showLogo) {
      setIsReturning(false); // היציאה מהירה יותר
      timersRef.current.hoverLogo = setTimeout(() => {
        setShiftLeftNeighbor(true); // מזיזים את השכן השמאלי
        timersRef.current.hoverLogo = setTimeout(() => {
          setActiveMenu('logo');
        }, 475);
      }, 300);
    } else if (type === 'neoIcon' && showNeo) {
      timersRef.current.hoverNeo = setTimeout(() => setActiveMenu('neoIcon'), 350);
    } else if (type === 'agentSmithIcon' && showSmith) {
      timersRef.current.hoverSmith = setTimeout(() => setActiveMenu('agentSmithIcon'), 350);
    }
  };

  const onLeave = () => {
    if (isMobile) return;
    clearAllTimeouts();
    timersRef.current.close = setTimeout(() => {
      setActiveMenu(null);
      setIsReturning(true);       // חזרה איטית
      setShiftLeftNeighbor(false);
      timersRef.current.returnDone = setTimeout(() => setIsReturning(false), 1050);
    }, 300);
  };

  // בזמן ריחוף על התפריט – לא לסגור
  const onDropdownEnter = () => clearAllTimeouts();
  const onDropdownLeave = () => onLeave();

  // Mobile click
  const handleMobileIconClick = (menuType) => {
    if (!isMobile) return;
    if (activeMenu === menuType) {
      closeMenuWithAnimation();
    } else {
      if (activeMenu) {
        closeMenuWithAnimation();
        setTimeout(() => setActiveMenu(menuType), 350);
      } else {
        setActiveMenu(menuType);
      }
      if (menuType === 'logo') {
        logoScrollTargetRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);

    if (isMobile) {
      document.addEventListener('touchstart', handleTouchStart, { passive: true });
      document.addEventListener('touchmove', handleTouchMove, { passive: true });
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      clearAllTimeouts();
    };
  }, [isMobile, handleClickOutside, handleTouchMove]);

  // Mobile bottom-sheet
  const MobileMenu = () =>
    !isMobile || !activeMenu ? null : (
      <div className={`mobile-dropdown-menu ${isClosing ? 'closing' : ''}`}
           onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}>
        <div className="swipe-indicator" />
        <button className="close-menu-btn" onClick={closeMenuWithAnimation} aria-label="סגירת תפריט">✕</button>

        {activeMenu === 'logo' && (
          <>
            <Link to="/" onClick={closeMenuWithAnimation}>דף ראשי</Link>
            <Link to="/thanks" onClick={closeMenuWithAnimation}>תודות</Link>
            <Link to="/contact-us" onClick={closeMenuWithAnimation}>צור קשר</Link>
          </>
        )}

        {activeMenu === 'neoIcon' && showNeo && (
          <>
            <Link to="/neo/hacking/guides" onClick={closeMenuWithAnimation}>מדריכי סייבר</Link>
            <Link to="/neo/hacking/articles" onClick={closeMenuWithAnimation}>מאמרי סייבר</Link>
            <Link to="/neo/hacking/videos" onClick={closeMenuWithAnimation}>סרטוני סייבר</Link>
          </>
        )}

        {activeMenu === 'agentSmithIcon' && showSmith && (
          <>
            <Link to="/agent-smith/agent-smith-department/roubleshooting-guides" onClick={closeMenuWithAnimation}>מדריכי פתרון תקלות</Link>
            <Link to="/agent-smith/agent-smith-department/technology-news" onClick={closeMenuWithAnimation}>חדשות טכנולוגיה</Link>
          </>
        )}
      </div>
    );

  // --- Items (all drop-left) -------------------------------------------
  const renderNeo = () => (
    <li
      className={`neoIcon drop-left ${((mode === 'neo' || mode === 'both') && shiftLeftNeighbor) ? 'shift' : ''} ${isReturning ? 'is-returning' : ''} ${isMobile && activeMenu === 'neoIcon' ? 'active-mobile' : ''}`}
      onMouseEnter={() => onEnter('neoIcon')}
      onMouseLeave={onLeave}
      onFocus={() => onEnter('neoIcon')}
      onBlur={onLeave}
    >
      <Link
        to="/neo/hacking"
        className="menu-icon"
        onClick={(e) => { if (isMobile) { e.preventDefault(); handleMobileIconClick('neoIcon'); } }}
      >
        <img src={neoIcon} alt="Neo" />
        <span className="sweep" />
        {/* אפקטים */}
        <span className="fx-glitch" aria-hidden="true" />
        <span className="fx-scan" aria-hidden="true" />
        <span className="fx-ripple" aria-hidden="true" />
      </Link>
      {activeMenu === 'neoIcon' && !isMobile && (
        <div className="dropdown-menu" onMouseEnter={onDropdownEnter} onMouseLeave={onDropdownLeave}>
          <Link to="/neo/hacking/guides">מדריכי סייבר</Link>
          <Link to="/neo/hacking/articles">מאמרי סייבר</Link>
          <Link to="/neo/hacking/videos">סרטוני סייבר</Link>
        </div>
      )}
    </li>
  );

  const renderLogo = () => (
    <li
      className={`drop-left ${isMobile && activeMenu === 'logo' ? 'active-mobile' : ''}`}
      onMouseEnter={() => onEnter('logo')}
      onMouseLeave={onLeave}
      onFocus={() => onEnter('logo')}
      onBlur={onLeave}
    >
      <Link
        to="/"
        className="menu-icon"
        onClick={(e) => { if (isMobile) { e.preventDefault(); handleMobileIconClick('logo'); } }}
      >
        <img src={logoIcon} alt="Logo" />
        <span className="sweep" />
      </Link>
      {activeMenu === 'logo' && !isMobile && (
        <div className="dropdown-menu logo-menu" onMouseEnter={onDropdownEnter} onMouseLeave={onDropdownLeave}>
          <Link to="/neo/works-with">ספקים וחברות</Link>
          <Link to="/thanks">תודות</Link>
          <Link to="/contact-us">צור קשר</Link>
        </div>
      )}
    </li>
  );

  const renderSmith = () => (
    <li
      className={`agentSmithIcon drop-left ${(mode === 'agent-smith' && shiftLeftNeighbor) ? 'shift' : ''} ${isReturning ? 'is-returning' : ''} ${isMobile && activeMenu === 'agentSmithIcon' ? 'active-mobile' : ''}`}
      onMouseEnter={() => onEnter('agentSmithIcon')}
      onMouseLeave={onLeave}
      onFocus={() => onEnter('agentSmithIcon')}
      onBlur={onLeave}
    >
      <Link
        to="/agent-smith/agent-smith-department"
        className="menu-icon"
        onClick={(e) => { if (isMobile) { e.preventDefault(); handleMobileIconClick('agentSmithIcon'); } }}
      >
        <img src={agentSmithIcon} alt="Agent Smith" />
        <span className="sweep" />
        {/* אפקטים */}
        <span className="fx-glitch" aria-hidden="true" />
        <span className="fx-scan" aria-hidden="true" />
        <span className="fx-ripple" aria-hidden="true" />
      </Link>
      {activeMenu === 'agentSmithIcon' && !isMobile && (
        <div className="dropdown-menu" onMouseEnter={onDropdownEnter} onMouseLeave={onDropdownLeave}>
          <Link to="/agent-smith/agent-smith-department/troubleshooting-guides">מדריכי פתרון תקלות</Link>
          <Link to="/agent-smith/agent-smith-department/technology-news">חדשות טכנולוגיה</Link>
          <Link to="/agent-smith/agent-smith-department/building-computers">בניית מחשבים</Link>
        </div>
      )}
    </li>
  );

  // Build order (logo במרכז)
  let items = [];
  const withKey = (node, key) => React.cloneElement(node, { key });
  if (mode === 'neo') {
    if (showNeo) items.push(withKey(renderNeo(), 'neo'));
    if (showLogo) items.push(withKey(renderLogo(), 'logo'));
  } else if (mode === 'agent-smith') {
    if (showSmith) items.push(withKey(renderSmith(), 'smith'));
    if (showLogo) items.push(withKey(renderLogo(), 'logo'));
  } else {
    if (showNeo) items.push(withKey(renderNeo(), 'neo'));
    if (showLogo) items.push(withKey(renderLogo(), 'logo'));
    if (showSmith) items.push(withKey(renderSmith(), 'smith'));
  }

  return (
    <>
      <div className={`sidebar ${showBar ? 'visible' : 'hidden'}`} ref={menuRef}>
        {isMobile && activeMenu && <div className="mobile-overlay" onClick={closeMenuWithAnimation} />}
        <MobileMenu />
        <ul>{items}</ul>
      </div>
      <div ref={logoScrollTargetRef} style={{ height: 1 }} />
    </>
  );
});

export default MatrixBar;
