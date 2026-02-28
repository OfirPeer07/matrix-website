import React, { useEffect, useState, useRef } from 'react';
import '../../../styles/indicators/IndicatorDots.css';

/**
 * CLEAN + STABLE VERSION
 * -----------------------
 * - No mobile/tablet detection
 * - No dynamic classes
 * - No layout-changing states
 * - Observer settings are constant
 * - UI never changes after first paint
 */

const IndicatorDots = ({ RedOrBluePill, Escape }) => {
  const [activeSection, setActiveSection] = useState('introduction');
  const indicatorRef = useRef(null);

  // Clean & stable scroll-to-section
  const scrollToSection = (ref, sectionName) => {
    if (!ref.current) return;

    const sidebar = document.querySelector('.sidebar');

    if (sidebar) {
      sidebar.classList.add('fixed-during-scroll');
    }

    ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (sidebar) {
      const onScrollEnd = () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          sidebar.classList.remove('fixed-during-scroll');
          window.removeEventListener('scroll', onScrollEnd);
        }, 150);
      };

      let timeout = setTimeout(() => {
        sidebar.classList.remove('fixed-during-scroll');
      }, 500);

      window.addEventListener('scroll', onScrollEnd);
    }

    setActiveSection(sectionName);
  };

  // Stable observer with constant settings
  useEffect(() => {
    const sectionRefs = [
      { ref: Escape, name: 'Escape' },
      { ref: RedOrBluePill, name: 'RedOrBluePill' },
    ];

    const observerSettings = {
      threshold: 0.6,   // constant → prevents flickering
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const section = sectionRefs.find(s => s.ref.current === entry.target);
          if (section) setActiveSection(section.name);
        }
      });
    }, observerSettings);

    sectionRefs.forEach(({ ref }) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, [RedOrBluePill, Escape]);

  return (
    <div className="indicator__list-wrap" ref={indicatorRef}>
      <div className="indicator__list">

        {/* Escape */}
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

        {/* Pill */}
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
