import React, { useEffect, useState, useRef } from 'react';
import './IndicatorDots.css';

const IndicatorDots = ({ RedOrBluePill, Escape }) => {
  const [activeSection, setActiveSection] = useState('introduction');
  const [isMobile, setIsMobile] = useState(false);
  const indicatorRef = useRef(null);

  // בדיקה אם המכשיר הוא מובייל או טאבלט
  useEffect(() => {
    const checkMobile = () => {
      const mobileRegex = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i;
      const tabletRegex = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/;
      
      const isMobileDevice = mobileRegex.test(navigator.userAgent.toLowerCase());
      const isTablet = tabletRegex.test(navigator.userAgent.toLowerCase());
      
      setIsMobile(isMobileDevice || isTablet);
    };
    
    // בדיקה ראשונית
    checkMobile();
    
    // הוספת מאזין לשינוי גודל החלון
    window.addEventListener('resize', checkMobile);
    
    // ניקוי
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToSection = (ref, sectionName) => {
    if (!ref.current) return;
  
    const behavior = isMobile ? 'auto' : 'smooth';
    const sidebar = document.querySelector('.sidebar');
  
    if (sidebar) {
      sidebar.classList.add('fixed-during-scroll');
    }
  
    ref.current.scrollIntoView({ behavior, block: 'start' });
  
    if (sidebar && behavior === 'smooth') {
      // מאזין לגלילה כדי להסיר את הקלאס כשמתייצבים
      const onScrollEnd = () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          sidebar.classList.remove('fixed-during-scroll');
          window.removeEventListener('scroll', onScrollEnd);
        }, 150); // זמן קצר אחרי שהגלילה נגמרה
      };
  
      let timeout = setTimeout(() => {
        sidebar.classList.remove('fixed-during-scroll');
      }, 500); // fallback אם scroll לא זז
  
      window.addEventListener('scroll', onScrollEnd);
    } else if (sidebar) {
      // immediate removal אם לא גלילה חלקה
      sidebar.classList.remove('fixed-during-scroll');
    }
  
    setActiveSection(sectionName);
  };  

  useEffect(() => {
    const sectionRefs = [
      { ref: Escape, name: 'Escape' },
      { ref: RedOrBluePill, name: 'RedOrBluePill' },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = sectionRefs.find((s) => s.ref.current === entry.target);
            if (section) setActiveSection(section.name);
          }
        });
      },
      { 
        threshold: isMobile ? 0.2 : 0.6, // סף נמוך יותר למובייל וטאבלט
        rootMargin: isMobile ? '-10% 0px' : '0px' // מרווח שונה למובייל וטאבלט
      }
    );

    sectionRefs.forEach(({ ref }) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, [RedOrBluePill, Escape, isMobile]);

  return (
    <div className={`indicator__list-wrap ${isMobile ? 'mobile-device' : ''}`} ref={indicatorRef}>
      <div className="indicator__list">
        <button
          className={`indicator__item ${activeSection === 'Escape' ? 'indicator__item--active' : ''}`}
          onClick={() => scrollToSection(Escape, 'Escape')}
          aria-label="גלול לבריחה"
        >
          <span className="indicator__dot-wrap">
            <span className="indicator__dot">
              <span className="indicator__dot-inner"></span>
            </span>
            <span className="indicator__label">הבריחה</span>
          </span>
        </button>
        <button
          className={`indicator__item ${activeSection === 'RedOrBluePill' ? 'indicator__item--active' : ''}`}
          onClick={() => scrollToSection(RedOrBluePill, 'RedOrBluePill')}
          aria-label="גלול לכדור"
        >
          <span className="indicator__dot-wrap">
            <span className="indicator__dot">
              <span className="indicator__dot-inner"></span>
            </span>
            <span className="indicator__label">הכדור</span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default IndicatorDots;