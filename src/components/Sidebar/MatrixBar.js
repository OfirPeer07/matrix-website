import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Link } from "react-router-dom";

import neoIcon from "../../assets/images/neoIcon.png";
import logoIcon from "../../assets/images/logo.png";
import agentSmithIcon from "../../assets/images/agentSmithIcon.png";

import "./MatrixBar.css";

const isMobileDevice = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent || navigator.vendor || window.opera
  );

const MatrixBar = forwardRef(function MatrixBar({ mode = "both" }, ref) {
  const showNeo = mode === "neo" || mode === "both";
  const showSmith = mode === "agent-smith" || mode === "both";
  const showLogo = true;

  const [activeMenu, setActiveMenu] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showBar, setShowBar] = useState(true);

  const [shiftLeftNeighbor, setShiftLeftNeighbor] = useState(false);
  const [isReturning, setIsReturning] = useState(true);

  const menuRef = useRef(null);
  const timersRef = useRef({});
  const touchStartY = useRef(0);
  const lastScrollY = useRef(0);
  const logoScrollTargetRef = useRef(null);

  useImperativeHandle(ref, () => ({
    scrollLogoIntoView: () =>
      logoScrollTargetRef.current?.scrollIntoView({ behavior: "smooth" }),
  }));

  useEffect(() => {
    const mobile = isMobileDevice();
    setIsMobile(mobile);
    document.body.classList.toggle("mobile-device", mobile);
  }, []);

  const clearAllTimeouts = () =>
    Object.values(timersRef.current).forEach(clearTimeout);

  const closeMenuWithAnimation = useCallback(() => {
    if (!activeMenu) return;
    setIsClosing(true);
    setTimeout(() => {
      setActiveMenu(null);
      setIsClosing(false);
    }, 350);
  }, [activeMenu]);

  const handleClickOutside = useCallback(
    (event) => {
      if (!menuRef.current) return;
      if (menuRef.current.contains(event.target)) return;

      if (isMobile) {
        const hit =
          event.target.closest(".dropdown-menu") ||
          event.target.closest(".menu-icon");
        if (!hit) closeMenuWithAnimation();
      } else {
        setActiveMenu(null);
        setIsReturning(true);
        setShiftLeftNeighbor(false);
        timersRef.current.returnDone = setTimeout(
          () => setIsReturning(false),
          1050
        );
      }
    },
    [isMobile, closeMenuWithAnimation]
  );

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = useCallback(
    (e) => {
      if (!activeMenu) return;
      const deltaY = e.touches[0].clientY - touchStartY.current;
      if (deltaY > 70) closeMenuWithAnimation();
    },
    [activeMenu, closeMenuWithAnimation]
  );

  const handleScroll = () => {
    const y = window.scrollY;
    const up = y < lastScrollY.current;
    if (showBar !== up) setShowBar(up);
    lastScrollY.current = y;
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    if (isMobile) {
      document.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      document.addEventListener("touchmove", handleTouchMove, {
        passive: true,
      });
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      clearAllTimeouts();
    };
  }, [isMobile, handleClickOutside, handleTouchMove]);

  const MobileMenu = () =>
    !isMobile || !activeMenu ? null : (
      <div className={`mobile-dropdown-menu ${isClosing ? "closing" : ""}`}>
        <button className="close-menu-btn" onClick={closeMenuWithAnimation}>
          ✕
        </button>

        {activeMenu === "logo" && (
          <>
            <Link to="/" onClick={closeMenuWithAnimation}>דף ראשי</Link>
            <Link to="/thanks" onClick={closeMenuWithAnimation}>תודות</Link>
            <Link to="/contact-us" onClick={closeMenuWithAnimation}>צור קשר</Link>
          </>
        )}

        {activeMenu === "neoIcon" && (
          <>
            <Link to="/neo/hacking/guides" onClick={closeMenuWithAnimation}>
              מדריכים
            </Link>
            <Link to="/neo/hacking/articles" onClick={closeMenuWithAnimation}>
              מאמרים
            </Link>
            <Link to="/neo/hacking/videos" onClick={closeMenuWithAnimation}>
              וידאו
            </Link>
          </>
        )}

        {activeMenu === "agentSmithIcon" && (
          <>
            <Link
              to="/agent-smith/agent-smith-department/troubleshooting-guides"
              onClick={closeMenuWithAnimation}
            >
              פתרון תקלות
            </Link>
            <Link
              to="/agent-smith/agent-smith-department/technology-news"
              onClick={closeMenuWithAnimation}
            >
              חדשות טכנולוגיה
            </Link>
          </>
        )}
      </div>
    );

  const renderNeo = () => (
    <li className="neoIcon drop-left">
      <Link to="/neo/hacking" className="menu-icon">
        <img src={neoIcon} alt="Neo" />
      </Link>
    </li>
  );

  const renderLogo = () => (
    <li className="drop-left">
      <Link to="/" className="menu-icon">
        <img src={logoIcon} alt="Logo" />
      </Link>
    </li>
  );

  const renderSmith = () => (
    <li className="agentSmithIcon drop-left">
      <Link to="/agent-smith/agent-smith-department" className="menu-icon">
        <img src={agentSmithIcon} alt="Agent Smith" />
      </Link>
    </li>
  );

  return (
    <>
      <div className={`sidebar ${showBar ? "visible" : "hidden"}`} ref={menuRef}>
        <MobileMenu />
        <ul>
          {showNeo && renderNeo()}
          {showLogo && renderLogo()}
          {showSmith && renderSmith()}
        </ul>
      </div>
      <div ref={logoScrollTargetRef} style={{ height: 1 }} />
    </>
  );
});

export default MatrixBar;
