import React, { useEffect, useRef, useState } from 'react';
import './Neo.css';
import IndicatorDots from '../Neo/IndicatorDots/IndicatorDots';
import neoVideo from './Sections/neoVideo.mp4';
import RedOrBluePill from './Sections/RedOrBluePill';
import Escape from './Sections/Escape';
import ChooseYourPill, { PillMessage } from './Sections/ChooseYourPill';

const BottomBlock = () => {
  return (
    <div className="bottom-block hidden">
      <h2>...</h2>
      <p>.<br></br>.</p>
      <p><br></br></p>
    </div>
  );
};

const Neo = () => {
  const escapeRef = useRef(null);
  const redOrBluePillRef = useRef(null);
  const chooseYourPillRef = useRef(null);

  const [activeSection, setActiveSection] = useState('Escape');
  const [selectedPill, setSelectedPill] = useState(null);
  const [videoOpen, setVideoOpen] = useState(false); // מצב מודאל וידאו

  const scrollToSection = (ref, section) => {
    if (ref?.current) {
      setActiveSection(section);
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { ref: redOrBluePillRef, name: 'RedOrBluePill' },
        { ref: escapeRef, name: 'Escape' },
        { ref: chooseYourPillRef, name: 'ChooseYourPill' },
      ];

      let newActiveSection = activeSection;

      sections.forEach(({ ref, name }) => {
        if (ref?.current) {
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
        RedOrBluePill={redOrBluePillRef}
        Escape={escapeRef}
        ChooseYourPill={chooseYourPillRef}
      />

      {/* קטע Escape */}
      <div ref={escapeRef} className="section">
        <div className="text-image-container">
          <div className="image-content">

            {/* כפתור ESC */}
            {!videoOpen && (
              <button
                className="esc-button"
                onClick={() => setVideoOpen(true)}
                aria-label="Open Neo video"
              >
                ESC
              </button>
            )}

            {/* מודאל וידאו */}
            {videoOpen && (
              <div className="video-modal">
                <video
                  src={neoVideo}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="neo-video-fullscreen"
                  onClick={() => setVideoOpen(false)}
                />
                <button
                  className="close-video-btn"
                  onClick={() => setVideoOpen(false)}
                  aria-label="Close video"
                >
                  ✕
                </button>
                <BottomBlock />
              </div>
            )}

          </div>
          <div className="text-content">
            <Escape />
          </div>
        </div>
      </div>

      {/* קטע RedOrBluePill */}
      <div ref={redOrBluePillRef} className="section">
        <div className="text-image-container">
          <div className="image-content">
            <div className="text-box">
              <div className="inner-box">
                <ChooseYourPill onSelect={setSelectedPill} />
              </div>
            </div>
          </div>
          <div className="text-content">
            <RedOrBluePill />
          </div>
        </div>

        <div className="pill-message-wrapper">
          <PillMessage selected={selectedPill} />
        </div>
      </div>

      <div ref={chooseYourPillRef}></div>
      <BottomBlock />
    </div>
  );
};

export default Neo;
