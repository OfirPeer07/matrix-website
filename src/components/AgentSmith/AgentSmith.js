import React, { useEffect, useRef, useState } from "react";
import "./AgentSmith.css";

import PhotoCarousel from "../AgentSmith/PhotoCarousel/PhotoCarousel";
import IndicatorDots from "../AgentSmith/IndicatorDots/IndicatorDots";

import experienceImage from "./Sections/Experience.png";
import Experience from "./Sections/Experience";

import WhatCanBeDone from "./Sections/WhatCanBeDone";
import WhatCanBeDoneImage from "./Sections/WhatCanBeDone.png";

const AgentSmith = () => {
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
    setActiveSection(section);

    setTimeout(() => {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }, 20);
  };


  return (
    <div className="main-page">
      
      <IndicatorDots
        activeSection={activeSection}
        scrollToSection={scrollToSection}
        experienceRef={experienceRef}
        whatCanBeDoneRef={whatCanBeDoneRef}
        photoCarouselRef={photoCarouselRef}
      />

      {/*EXPERIENCE SECTION*/}
      <div ref={experienceRef} className="section">
        <div className="text-image-container">

          {/* IMAGE SIDE */}
          <div className="image-content">
            <div className="text-box">
                <img
                  src={experienceImage}
                  alt="Experience"
                  className="experience-image"
                />
            </div>
          </div>

          {/* TEXT SIDE */}
          <Experience />
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
                  alt="WhatCanBeDone"
                  className="whatCanBeDone-image"
                />
            </div>
          </div>

          {/* TEXT SIDE */}
          <WhatCanBeDone />
        </div>
      </div>

      {/* -------------------------------------------------
        PHOTO CAROUSEL SECTION
      ------------------------------------------------- */}
      <div ref={photoCarouselRef} className="section">
        <div className="photoCarousel-box">
          <div className="photoCarousel-inner-box">
              <PhotoCarousel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentSmith;
