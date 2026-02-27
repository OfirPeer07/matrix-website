import React, { useEffect, useRef, useState } from "react";
import "./Neo.css";
import indicatorDots from "../Neo/IndicatorDots/IndicatorDots";
import neoVideo from "./Sections/neoVideo.mp4";
import RedOrBluePill from "./Sections/RedOrBluePill";
import RedOrBluePill_he from "./Sections/RedOrBluePill_he";
import Escape from "./Sections/Escape";
import Escape_he from "./Sections/Escape_he";
import ChooseYourPill from "./Sections/ChooseYourPill";
import ChooseYourPill_he from "./Sections/ChooseYourPill_he";
import { useLocaleContext } from "../../context/LocaleContext";
import IndicatorDots from "../Neo/IndicatorDots/IndicatorDots";

const BottomBlock = () => (
  <div className="bottom-block hidden">
    <h2>...</h2>
    <p>.<br /></p>
    <p><br /></p>
  </div>
);

const Neo = () => {
  const { locale } = useLocaleContext();
  const escapeRef = useRef(null);
  const redOrBluePillRef = useRef(null);
  const chooseYourPillRef = useRef(null);

  const [activeSection, setActiveSection] = useState("Escape");
  const [selectedPill, setSelectedPill] = useState(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const [ready, setReady] = useState(false);

  // ⬇⬇ FIX #1 — wait until all images are loaded
  useEffect(() => {
    const images = document.querySelectorAll("img");
    let loaded = 0;

    if (images.length === 0) {
      setReady(true);
      return;
    }

    images.forEach((img) => {
      if (img.complete) {
        loaded++;
        if (loaded === images.length) setReady(true);
      } else {
        img.onload = () => {
          loaded++;
          if (loaded === images.length) setReady(true);
        };
      }
    });
  }, []);

  // ⬇⬇ FIX #2 — scroll tracking runs ONLY when layout is stable
  useEffect(() => {
    if (!ready) return;

    const handleScroll = () => {
      const sections = [
        { ref: redOrBluePillRef, name: "RedOrBluePill" },
        { ref: escapeRef, name: "Escape" },
        { ref: chooseYourPillRef, name: "ChooseYourPill" }
      ];

      let newActive = activeSection;

      sections.forEach(({ ref, name }) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom >= 0;

        if (inView && rect.top <= window.innerHeight * 0.3) {
          newActive = name;
        }
      });

      if (newActive !== activeSection) {
        setActiveSection(newActive);
      }
    };

    // Delay ensures DOM layout is final
    const timer = setTimeout(() => {
      handleScroll();
      window.addEventListener("scroll", handleScroll);
    }, 150);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [ready, activeSection]);


  const scrollToSection = (ref, section) => {
    if (!ref?.current) return;

    // Notify MatrixBar to stay visible during this programmatic scroll
    window.isProgrammaticScroll = true;

    setActiveSection(section);

    setTimeout(() => {
      ref.current.scrollIntoView({ behavior: "smooth" });

      // Clear flag after scroll is likely finished
      setTimeout(() => {
        window.isProgrammaticScroll = false;
      }, 1200);
    }, 20);
  };

  return (
    <div className="neo-wrapper">
      <div className="sectional-layout">
        <IndicatorDots
          activeSection={activeSection}
          scrollToSection={scrollToSection}
          RedOrBluePill={redOrBluePillRef}
          Escape={escapeRef}
          ChooseYourPill={chooseYourPillRef}
        />

        {/* ESCAPE SECTION */}
        <div ref={escapeRef} className="section">
          <div className="text-content">
            <div className="image-content">
              {!videoOpen && (
                <button className="esc-button" onClick={() => setVideoOpen(true)}>
                  ESC
                </button>
              )}

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

            {/* TEXT SIDE */}
            <div>
              {locale === 'en' ? <Escape /> : <Escape_he />}
            </div>
          </div>
        </div>


        {/* PILL SECTION */}
        <div ref={redOrBluePillRef} className="section">
          <div className="text-image-container">
            <div className="image-content">
              <div className="inner-box">
                {locale === 'en' ? (
                  <ChooseYourPill selected={selectedPill} onSelect={setSelectedPill} />
                ) : (
                  <ChooseYourPill_he selected={selectedPill} onSelect={setSelectedPill} />
                )}
              </div>
            </div>

            <div className="text-content">
              {locale === 'en' ? <RedOrBluePill /> : <RedOrBluePill_he />}
            </div>
          </div>
        </div>

        <div ref={chooseYourPillRef}></div>

        <BottomBlock />
      </div>
    </div>
  );
};

export default Neo;
