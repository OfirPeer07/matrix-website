import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { Link } from 'react-router-dom';
import './NeoBar.css';
import { isMobileDevice } from './isMobileDevice';
import { MobileMenu } from './MobileMenu';

const NeoBar = forwardRef(function NeoBar(_, ref) {
  const [activeMenu, setActiveMenu] = useState(null);
  const [shiftHacking, setShiftHacking] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showBar, setShowBar] = useState(true);

  const menuRef = useRef(null);
  const timersRef = useRef({});
  const touchStartRef = useRef({ y: 0 });
  const lastScrollY = useRef(0);
  const logoScrollTargetRef = useRef(null);

  useImperativeHandle(ref, () => ({
    scrollLogoIntoView: () => {
      logoScrollTargetRef.current?.scrollIntoView({ behavior: 'smooth' });
    },
  }));

  useEffect(() => {
    const mobile = isMobileDevice();
    setIsMobile(mobile);
    document.body.classList.toggle('mobile-device', mobile);
  }, []);

  const clearAllTimeouts = () => {
    Object.values(timersRef.current).forEach(clearTimeout);
  };

  const closeMenuWithAnimation = useCallback(() => {
    if (!activeMenu) return;
    setIsClosing(true);
    setTimeout(() => {
      setActiveMenu(null);
      setIsClosing(false);
    }, 30);
  }, [activeMenu]);

  const handleClickOutside = useCallback((event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      if (isMobile) {
        if (
          !event.target.closest('.dropdown-menu') &&
          !event.target.closest('.menu-icon')
        ) {
          closeMenuWithAnimation();
        }
      } else {
        setActiveMenu(null);
        setShiftHacking(false);
      }
    }
  }, [isMobile, closeMenuWithAnimation]);

  const handleTouchStart = (e) => {
    touchStartRef.current.y = e.touches[0].clientY;
  };

  const handleTouchMove = useCallback((e) => {
    if (!activeMenu) return;
    const deltaY = e.touches[0].clientY - touchStartRef.current.y;
    if (deltaY > 70) closeMenuWithAnimation();
  }, [activeMenu, closeMenuWithAnimation]);

  const handleScroll = () => {
    const currentY = window.scrollY;
    const isScrollingUp = currentY < lastScrollY.current;
    if (showBar !== isScrollingUp) {
      setShowBar(isScrollingUp);
    }
    lastScrollY.current = currentY;
  };

  const handleMobileIconClick = (menuType) => {
    if (!isMobile) return;

    if (menuType === 'logo') {
      logoScrollTargetRef.current?.scrollIntoView({ behavior: 'smooth' });
      setShiftHacking(false);
    }

    if (activeMenu === menuType) {
      closeMenuWithAnimation();
    } else {
      if (activeMenu) {
        closeMenuWithAnimation();
        setTimeout(() => {
          setActiveMenu(menuType);
        }, 350);
      } else {
        setActiveMenu(menuType);
      }
    }
  };

  const handleMouseEnter = (type) => {
    if (isMobile) return;
    clearAllTimeouts();
    if (type === 'logo') {
      timersRef.current.hoverLogo = setTimeout(() => {
        setShiftHacking(true);
        timersRef.current.hoverLogo = setTimeout(() => {
          setActiveMenu('logo');
        }, 400);
      }, 250);
    } else if (type === 'neoIcon' && activeMenu !== 'logo') {
      timersRef.current.hoverHacking = setTimeout(() => {
        setActiveMenu('neoIcon');
      }, 250);
    }
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    clearAllTimeouts();
    timersRef.current.closeMenu = setTimeout(() => {
      setActiveMenu(null);
      setShiftHacking(false);
    }, 200);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);

    if (isMobile) {
      document.addEventListener('touchstart', handleTouchStart);
      document.addEventListener('touchmove', handleTouchMove);
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowBar(true);
      }
    };

    const handleCustomClick = (e) => {
      if (e.target.id === 'RedOrBluePill') {
        setShowBar((prev) => {
          if (prev) {
            setShowBar(false);
            setTimeout(() => setShowBar(true), 50);
            return false;
          }
          return true;
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleCustomClick);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleCustomClick);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      clearAllTimeouts();
    };
  }, [isMobile, handleClickOutside, handleTouchMove]);

  return (
    <>
      <div className={`sidebar ${showBar ? 'visible' : 'hidden'}`} ref={menuRef}>
        {isMobile && <div className="mobile-overlay" onClick={closeMenuWithAnimation}></div>}

        <MobileMenu
          isMobile={isMobile}
          activeMenu={activeMenu}
          isClosing={isClosing}
          onClose={closeMenuWithAnimation}
        />

        <ul>
          <li
            className={`neoIcon ${shiftHacking ? 'shift' : ''} ${isMobile && activeMenu === 'neoIcon' ? 'active-mobile' : ''}`}
            onMouseEnter={() => handleMouseEnter('neoIcon')}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              to="/neo/hacking"
              className="menu-icon"
              onClick={(e) => {
                if (isMobile) {
                  e.preventDefault();
                  handleMobileIconClick('neoIcon');
                }
              }}
            >
              <img src="/images/neoIcon.png" alt="neoHacking-section" />
            </Link>
            {activeMenu === 'neoIcon' && !isMobile && (
              <div className="dropdown-menu">
                <Link to="/neo/hacking/guides">מדריכי סייבר</Link>
                <Link to="/neo/hacking/articles">מאמרי סייבר</Link>
                <Link to="/neo/hacking/videos">סרטוני סייבר</Link>
              </div>
            )}
          </li>

          <li
            className={`${isMobile && activeMenu === 'logo' ? 'active-mobile' : ''}`}
            onMouseEnter={() => handleMouseEnter('logo')}
            onMouseLeave={handleMouseLeave}
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
            {activeMenu === 'logo' && !isMobile && (
              <div className="dropdown-menu logo-menu">
                <Link to="/neo/works-with">ספקים וחברות</Link>
                <Link to="/thanks">תודות</Link>
                <Link to="/contact-us">צור קשר</Link>
              </div>
            )}
          </li>
        </ul>
      </div>

      <div ref={logoScrollTargetRef} style={{ height: '1px' }}></div>
    </>
  );
});

export default NeoBar;
