import React, { useEffect, useState, useRef } from 'react';
import './IndicatorDots.css';

const IndicatorDots = ({ experienceRef, whatCanBeDoneRef, photoCarouselRef }) => {
  const [activeSection, setActiveSection] = useState('experience');
  const [isMobile, setIsMobile] = useState(false);
  const indicatorRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      const mobileRegex = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i;
      const tabletRegex = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/;
      
      const isMobileDevice = mobileRegex.test(navigator.userAgent.toLowerCase());
      const isTablet = tabletRegex.test(navigator.userAgent.toLowerCase());
      
      setIsMobile(isMobileDevice || isTablet);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToSection = (ref, sectionName) => {
    if (ref?.current) {
      const behavior = isMobile ? 'auto' : 'smooth';
      ref.current.scrollIntoView({ behavior, block: 'start' });
      setActiveSection(sectionName);
    }
  };

  useEffect(() => {
    const sectionRefs = [
      { ref: experienceRef, name: 'experience' },
      { ref: whatCanBeDoneRef, name: 'whatCanBeDone' },
      { ref: photoCarouselRef, name: 'carousel' },
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
        threshold: isMobile ? 0.2 : 0.6,
        rootMargin: isMobile ? '-10% 0px' : '0px'
      }
    );

    sectionRefs.forEach(({ ref }) => {
      if (ref?.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, [experienceRef, whatCanBeDoneRef, photoCarouselRef, isMobile]);

  return (
    <div className={`indicator__list-wrap ${isMobile ? 'mobile-device' : ''}`} ref={indicatorRef}>
      <div className="indicator__list">
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

        <button
          className={`indicator__item ${activeSection === 'whatCanBeDone' ? 'indicator__item--active' : ''}`}
          onClick={() => scrollToSection(whatCanBeDoneRef, 'whatCanBeDone')}
          aria-label="גלול למה אפשר לעשות"
        >
          <span className="indicator__dot-wrap">
            <span className="indicator__dot">
              <span className="indicator__dot-inner"></span>
            </span>
            <span className="indicator__label">מה אפשר לעשות</span>
          </span>
        </button>

        <button
          className={`indicator__item ${activeSection === 'carousel' ? 'indicator__item--active' : ''}`}
          onClick={() => scrollToSection(photoCarouselRef, 'carousel')}
          aria-label="גלול להרכבות"
        >
          <span className="indicator__dot-wrap">
            <span className="indicator__dot">
              <span className="indicator__dot-inner"></span>
            </span>
            <span className="indicator__label">הרכבות</span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default IndicatorDots;
