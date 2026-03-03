import React, { useEffect, useRef, useState } from "react";
import "./AgentSmith.css";

import PhotoCarousel from "../AgentSmith/PhotoCarousel/PhotoCarousel";
import PhotoCarousel_he from "../AgentSmith/PhotoCarousel/PhotoCarousel_he";
import IndicatorDots from "../AgentSmith/IndicatorDots/IndicatorDots";
import IndicatorDots_he from "../AgentSmith/IndicatorDots/IndicatorDots_he";

import experienceImage from "./Sections/Experience.png";
import Experience from "./Sections/Experience";
import Experience_he from "./Sections/Experience_he";

import WhatCanBeDone from "./Sections/WhatCanBeDone";
import WhatCanBeDone_he from "./Sections/WhatCanBeDone_he";
import WhatCanBeDoneImage from "./Sections/WhatCanBeDone.png";
import { useLocaleContext } from "../../context/LocaleContext";

const AgentSmith = () => {
  const { locale } = useLocaleContext();
  const experienceRef = useRef(null);
  const whatCanBeDoneRef = useRef(null);
  const photoCarouselRef = useRef(null);

  const [activeSection, setActiveSection] = useState("experience");
  const [ready, setReady] = useState(false);

  // ---------------------------------------------------
  // FIX #1 — wait until all images are fully loaded
  // ---------------------------------------------------
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



  // ---------------------------------------------------
  // FIX #2 — scroll tracking after layout is stable
  // ---------------------------------------------------
  useEffect(() => {
    if (!ready) return;

    const handleScroll = () => {
      const sections = [
        { ref: experienceRef, name: "experience" },
        { ref: whatCanBeDoneRef, name: "whatCanBeDone" },
        { ref: photoCarouselRef, name: "carousel" }
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

    // delay ensures consistent layout before tracking
    const timer = setTimeout(() => {
      handleScroll();
      window.addEventListener("scroll", handleScroll);
    }, 150);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };

  }, [ready, activeSection]);


  // ---------------------------------------------------
  // SCROLL TO SECTIONS (same as Neo)
  // ---------------------------------------------------
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
    <div className="sectional-layout">

      {locale === 'en' ? (
        <IndicatorDots
          activeSection={activeSection}
          scrollToSection={scrollToSection}
          experienceRef={experienceRef}
          whatCanBeDoneRef={whatCanBeDoneRef}
          photoCarouselRef={photoCarouselRef}
        />
      ) : (
        <IndicatorDots_he
          activeSection={activeSection}
          scrollToSection={scrollToSection}
          experienceRef={experienceRef}
          whatCanBeDoneRef={whatCanBeDoneRef}
          photoCarouselRef={photoCarouselRef}
        />
      )}

      {/*EXPERIENCE SECTION*/}
      <div ref={experienceRef} className="section">
        <div className="text-image-container">

          {/* IMAGE SIDE */}
          <div className="image-content">
            <div className="text-box">
              <img
                src={experienceImage}
                alt={locale === 'he' ? 'ניסיון' : 'Experience'}
                className="experience-image"
              />
            </div>
          </div>

          {/* TEXT SIDE */}
          {locale === 'en' ? <Experience /> : <Experience_he />}
        </div>
      </div>

      {/* -------------------------------------------------
        WHAT CAN BE DONE SECTION
      ------------------------------------------------- */}
      <div ref={whatCanBeDoneRef} className="section">
        <div className="text-image-container">

          {/* IMAGE SIDE */}
          <div className="image-content">
            <div className="text-box">
              <img
                src={WhatCanBeDoneImage}
                alt={locale === 'he' ? 'מה ניתן לעשות' : 'WhatCanBeDone'}
                className="whatCanBeDone-image"
              />
            </div>
          </div>

          {/* TEXT SIDE */}
          {locale === 'en' ? <WhatCanBeDone /> : <WhatCanBeDone_he />}
        </div>
      </div>

      {/* -------------------------------------------------
        PHOTO CAROUSEL SECTION
      ------------------------------------------------- */}
      <div ref={photoCarouselRef} className="section">
        <div className="photoCarousel-box">
          <div className="photoCarousel-inner-box">
            {locale === 'en' ? <PhotoCarousel /> : <PhotoCarousel_he />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentSmith;
