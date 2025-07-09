import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './AgentSmithBar.css';

function AgentSmithBar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [shiftAgentSmith, setShiftAgentSmith] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  const timersRef = useRef({ hoverLogo: null, hoverAgentSmith: null, closeMenu: null });
  
  // מצב התחלתי של מגע
  const touchStartRef = useRef({ y: 0 });

  // בדיקה אם המכשיר הוא נייד באמצעות User Agent
  useEffect(() => {
    const checkMobile = () => {
      // בדיקת User Agent כדי לזהות מכשירים ניידים
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      
      // רגקס לזיהוי מכשירים ניידים (טלפונים וטאבלטים)
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      
      // קביעת המצב לפי בדיקת הרגקס
      const isMobileDevice = mobileRegex.test(userAgent);
      setIsMobile(isMobileDevice);
      
      // הוספה או הסרה של קלאס 'mobile-device' מאלמנט ה-body
      if (isMobileDevice) {
        document.body.classList.add('mobile-device');
      } else {
        document.body.classList.remove('mobile-device');
      }
    };
    
    // בדיקה ראשונית
    checkMobile();
    
    // לא מוסיפים מאזין לשינוי גודל החלון כי אנחנו רוצים רק לבדוק את סוג המכשיר
  }, []);

  const handleMouseEnterLogo = () => {
    // במובייל אין צורך בטיפול באירועי מעבר עכבר
    if (isMobile) return;
    
    clearTimeout(timersRef.current.closeMenu);
    clearTimeout(timersRef.current.hoverAgentSmith);
    
    timersRef.current.hoverLogo = setTimeout(() => {
      setShiftAgentSmith(true);
      timersRef.current.hoverLogo = setTimeout(() => {
        setActiveMenu('logo');
      }, 400);
    }, 250);
  };

  const handleMouseEnterAgentSmith = () => {
    // במובייל אין צורך בטיפול באירועי מעבר עכבר
    if (isMobile) return;
    
    if (activeMenu === 'logo') return; // Prevent opening if the user is moving from logo menu
    clearTimeout(timersRef.current.closeMenu);
    
    timersRef.current.hoverAgentSmith = setTimeout(() => {
      setActiveMenu('agentSmithIcon');
    }, 250);
  };

  const handleMouseLeave = () => {
    // במובייל אין צורך בטיפול באירועי מעבר עכבר
    if (isMobile) return;
    
    clearTimeout(timersRef.current.hoverLogo);
    clearTimeout(timersRef.current.hoverAgentSmith);
    
    timersRef.current.closeMenu = setTimeout(() => {
      setActiveMenu(null);
      setShiftAgentSmith(false);
    }, 200);
  };

  const handleClickOutside = (event) => {
    // אם לחצו על הרקע הכהה (overlay) או מחוץ לתפריט במובייל
    if (isMobile && 
        activeMenu && 
        menuRef.current && 
        !event.target.closest('.dropdown-menu') && 
        !event.target.closest('.menu-icon')) {
      closeMenuWithAnimation();
      return;
    }
    
    // טיפול רגיל בלחיצה מחוץ לתפריט במחשב
    if (!isMobile && menuRef.current && !menuRef.current.contains(event.target)) {
      setActiveMenu(null);
      setShiftAgentSmith(false);
    }
  };

  // טיפול בלחיצה על אייקון במובייל
  const handleMobileIconClick = (menuType) => {
    if (!isMobile) return; // רק במובייל
    
    if (activeMenu === menuType) {
      // סגור את התפריט אם הוא כבר פתוח
      closeMenuWithAnimation();
    } else {
      // סגור תפריט קודם אם פתוח
      if (activeMenu) {
        closeMenuWithAnimation();
        // פתח את התפריט החדש אחרי שהתפריט הקודם נסגר
        setTimeout(() => {
          setActiveMenu(menuType);
          setIsClosing(false);
        }, 350);
      } else {
        // פתח את התפריט הנבחר
        setActiveMenu(menuType);
      }
      
      // וודא שהתפריט יוצג כראוי
      if (menuType === 'logo') {
        // אם פותחים את תפריט הלוגו, וודא שהמחשב לא מוזז
        setShiftAgentSmith(false);
      }
    }
  };

  // סגירת התפריט עם אנימציה
  const closeMenuWithAnimation = () => {
    if (!activeMenu) return;
    
    setIsClosing(true);
    setTimeout(() => {
      setActiveMenu(null);
      setIsClosing(false);
    }, 300); // זמן האנימציה
  };

  // טיפול בהחלקה למטה לסגירת התפריט
  const handleTouchStart = (e) => {
    touchStartRef.current.y = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    if (!activeMenu) return;
    
    const touchY = e.touches[0].clientY;
    const startY = touchStartRef.current.y;
    const deltaY = touchY - startY;
    
    // אם המשתמש החליק למטה מספיק, סגור את התפריט
    if (deltaY > 70) {
      closeMenuWithAnimation();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    
    // הוסף מאזינים לאירועי מגע במובייל
    if (isMobile) {
      document.addEventListener('touchstart', handleTouchStart);
      document.addEventListener('touchmove', handleTouchMove);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      
      // הסר מאזינים לאירועי מגע
      if (isMobile) {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchmove', handleTouchMove);
      }
      
      clearTimeout(timersRef.current.hoverLogo);
      clearTimeout(timersRef.current.hoverAgentSmith);
      clearTimeout(timersRef.current.closeMenu);
    };
  }, [isMobile]);

  // רנדור התפריט הנפתח במובייל
  const renderMobileMenu = () => {
    if (!isMobile || !activeMenu) return null;
    
    const isAgentSmithMenu = activeMenu === 'agentSmithIcon';
    
    // פונקציה לטיפול בלחיצה על קישור בתפריט
    const handleMenuLinkClick = () => {
      closeMenuWithAnimation();
    };
    
    return (
      <div 
        className={`mobile-dropdown-menu ${isClosing ? 'closing' : ''}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <div className="swipe-indicator"></div>
        <button 
          className="close-menu-btn" 
          onClick={() => closeMenuWithAnimation()}
          aria-label="סגור תפריט"
        >
          ✕
        </button>
        
        {isAgentSmithMenu ? (
          // תוכן תפריט המחשב
          <>
            <Link to="/agent-smith/troubleshooting-guides" onClick={handleMenuLinkClick}>מדריכי פתרון תקלות</Link>
            <Link to="/agent-smith/technology-news" onClick={handleMenuLinkClick}>חדשות טכנולוגיה</Link>
            <Link to="/agent-smith/building-computers" onClick={handleMenuLinkClick}>הרכבות מחשבים</Link>
          </>
        ) : (
          // תוכן תפריט הלוגו
          <>
            <Link to="/" onClick={handleMenuLinkClick}>דף ראשי</Link>
            <Link to="/agent-smith/works-with" onClick={handleMenuLinkClick}>ספקים וחברות</Link>
            <Link to="/thanks" onClick={handleMenuLinkClick}>תודות</Link>
            <Link to="/contact-us" onClick={handleMenuLinkClick}>צור קשר</Link>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="sidebar" ref={menuRef}>
      {isMobile && activeMenu && (
        <div className="mobile-overlay" onClick={() => closeMenuWithAnimation()}></div>
      )}
      
      {/* תפריט מובייל משותף */}
      {renderMobileMenu()}
      
      <ul>
        <li
          className={`agentSmithIcon ${shiftAgentSmith ? 'shift' : ''} ${isMobile && activeMenu === 'agentSmithIcon' ? 'active-mobile' : ''}`}
          onMouseEnter={!isMobile ? handleMouseEnterAgentSmith : undefined}
          onMouseLeave={!isMobile ? handleMouseLeave : undefined}
          onFocus={!isMobile ? handleMouseEnterAgentSmith : undefined}
          onBlur={!isMobile ? handleMouseLeave : undefined}
        >
          <Link 
            to="/agent-smith/AgentSmithDepartment" 
            className="menu-icon"
            onClick={(e) => {
              if (isMobile) {
                e.preventDefault();
                handleMobileIconClick('agentSmithIcon');
              }
            }}
          >
            <img src="/images/agentSmithIcon.png" alt="agentSmithIcon-section" />
          </Link>
          
          {/* תפריט המחשב במחשב (לא במובייל) */}
          {activeMenu === 'agentSmithIcon' && !isMobile && (
            <div className="dropdown-menu">
              <Link to="/agent-smith/troubleshooting-guides" onClick={() => setActiveMenu(null)}>מדריכי פתרון תקלות</Link>
              <Link to="/agent-smith/technology-news" onClick={() => setActiveMenu(null)}>חדשות טכנולוגיה</Link>
              <Link to="/agent-smith/building-computers" onClick={() => setActiveMenu(null)}>הרכבות מחשבים</Link>
            </div>
          )}
        </li>
        <li
          className={`${isMobile && activeMenu === 'logo' ? 'active-mobile' : ''}`}
          onMouseEnter={!isMobile ? handleMouseEnterLogo : undefined}
          onMouseLeave={!isMobile ? handleMouseLeave : undefined}
          onFocus={!isMobile ? handleMouseEnterLogo : undefined}
          onBlur={!isMobile ? handleMouseLeave : undefined}
        >
          <Link 
            to="/" 
            className="menu-icon"
            onClick={(e) => {
              if (isMobile) {
                e.preventDefault();
                handleMobileIconClick('logo');
              }
            }}
          >
            <img src="/images/logo.png" alt="logo-section" />
          </Link>
          
          {/* תפריט הלוגו במחשב (לא במובייל) */}
          {activeMenu === 'logo' && !isMobile && (
            <div className="dropdown-menu logo-menu">
              <Link to="/agent-smith/works-with" onClick={(e) => e.stopPropagation()}>ספקים וחברות</Link>
              <Link to="/thanks" onClick={() => { setActiveMenu(null); setShiftAgentSmith(false); }}>תודות</Link>
              <Link to="/contact-us" onClick={() => { setActiveMenu(null); setShiftAgentSmith(false); }}>צור קשר</Link>
            </div>
          )}
        </li>
      </ul>
    </div>
  );
}

export default AgentSmithBar;
