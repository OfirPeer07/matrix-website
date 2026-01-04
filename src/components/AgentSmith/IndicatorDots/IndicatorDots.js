import React, { useEffect, useState, useRef } from 'react';
import '../../../styles/indicators/IndicatorDots.css';

/**
 * NEW GOALS:
 * - Zero layout changes after first render
 * - No mobile/tablet logic (everything uses desktop styling)
 * - No dynamic classes that might shift the layout
 * - Stable observer configuration
 */

const IndicatorDots = ({ experienceRef, whatCanBeDoneRef, photoCarouselRef }) => {
  const [activeSection, setActiveSection] = useState('experience');
  const indicatorRef = useRef(null);

  // Stable, clean scroll-to-section
  const scrollToSection = (ref, sectionName) => {
    if (!ref?.current) return;
    ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveSection(sectionName);
  };

  // IntersectionObserver to track visible section
  useEffect(() => {
    const sectionRefs = [
      { ref: experienceRef, name: 'experience' },
      { ref: whatCanBeDoneRef, name: 'whatCanBeDone' },
      { ref: photoCarouselRef, name: 'carousel' },
    ];

    // constant settings → prevent layout jumps
    const observerSettings = {
      threshold: 0.6,
      rootMargin: '0px',
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const match = sectionRefs.find(s => s.ref.current === entry.target);
          if (match) setActiveSection(match.name);
        }
      });
    }, observerSettings);

    sectionRefs.forEach(({ ref }) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, [experienceRef, whatCanBeDoneRef, photoCarouselRef]);

  return (
    <div className="indicator__list-wrap" ref={indicatorRef}>
      <div className="indicator__list">
        
        {/* Experience */}
        <button
          className={`indicator__item ${activeSection === 'experience' ? 'indicator__item--active' : ''}`}
          onClick={() => scrollToSection(experienceRef, 'experience')}
          aria-label="גלול לניסיון שלי"
        >
          <span className="indicator__dot-wrap">
            <span className="indicator__dot">
              <span className="indicator__dot-inner"></span>
            </span>
            <span className="indicator__label">ניסיון</span>
          </span>
        </button>

        {/* What Can Be Done */}
        <button
          className={`indicator__item ${activeSection === 'whatCanBeDone' ? 'indicator__item--active' : ''}`}
          onClick={() => scrollToSection(whatCanBeDoneRef, 'whatCanBeDone')}
          aria-label="גלול למה אפשר לעשות"
        >
          <span className="indicator__dot-wrap">
            <span className="indicator__dot">
              <span className="indicator__dot-inner"></span>
            </span>
            <span className="indicator__label">מה לעשות</span>
          </span>
        </button>

        {/* Carousel */}
        <button
          className={`indicator__item ${activeSection === 'carousel' ? 'indicator__item--active' : ''}`}
          onClick={() => scrollToSection(photoCarouselRef, 'carousel')}
          aria-label="גלול להרכבות"
        >
          <span className="indicator__dot-wrap">
            <span className="indicator__dot">
              <span className="indicator__dot-inner"></span>
            </span>
            <span className="indicator__label">צחוקים</span>
          </span>
        </button>

      </div>
    </div>
  );
};

export default IndicatorDots;
