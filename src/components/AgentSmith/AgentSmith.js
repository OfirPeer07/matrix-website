import React, { useEffect, useRef, useState } from 'react';
import './AgentSmith.css';
import PhotoCarousel from '../AgentSmith/PhotoCarousel/PhotoCarousel';
import IndicatorDots from '../AgentSmith/IndicatorDots/IndicatorDots';
import experienceImage from './Sections/Experience.png';
import Experience from './Sections/Experience';
import WhatCanBeDone from './Sections/WhatCanBeDone';
import WhatCanBeDoneImage from './Sections/WhatCanBeDone.png';

const AgentSmith = () => {
  const photoCarouselRef = useRef(null);
  const experienceRef = useRef(null);
  const whatCanBeDoneRef = useRef(null);

  const [activeSection, setActiveSection] = useState('carousel');

  const scrollToSection = (ref, section) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(section);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { ref: photoCarouselRef, name: 'carousel' },
        { ref: experienceRef, name: 'experience' },
        { ref: whatCanBeDoneRef, name: 'whatCanBeDone' },
      ];

      let newActiveSection = activeSection;

      sections.forEach(({ ref, name }) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          const isInViewport = rect.top < window.innerHeight && rect.bottom >= 0;

          if (isInViewport && rect.top <= window.innerHeight * 0.3) {
            newActiveSection = name;
          }
        }
      });

      if (newActiveSection !== activeSection) {
        setActiveSection(newActiveSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeSection]);

  return (
    <div className="main-page">
      <IndicatorDots
        activeSection={activeSection}
        scrollToSection={scrollToSection}
        photoCarouselRef={photoCarouselRef}
        experienceRef={experienceRef}
        whatCanBeDoneRef={whatCanBeDoneRef}
      />

      {/* Experience Section */}
      <div ref={experienceRef} className="section">
        <div className="text-image-container">
          <div className="image-content">
            <div className="text-box">
              <div className="inner-box">
                <img src={experienceImage} alt="Experience" className="experience-image" />
              </div>
            </div>
          </div>
          <div className="text-content">
            <Experience />
          </div>
        </div>
      </div>

      {/* What Can Be Done Section */}
      <div ref={whatCanBeDoneRef} className="section">
        <div className="text-image-container">
          <div className="image-content">
            <div className="text-box">
              <div className="inner-box">
                <img src={WhatCanBeDoneImage} alt="WhatCanBeDone" className="whatCanBeDone-image" />
              </div>
            </div>
          </div>
          <div className="text-content">
            <WhatCanBeDone />
          </div>
        </div>
      </div>

      
      {/* Photo Carousel Section */}
      <div ref={photoCarouselRef} className="carousel-section">
        <div className="innerPhotoCarousel-box">
          <div className="photoCarousel-box">
            <div className="text-content">
              <PhotoCarousel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentSmith;
 