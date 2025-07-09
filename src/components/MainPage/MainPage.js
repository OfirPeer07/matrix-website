import React, { useState, useCallback, useEffect } from "react";
import "./MainPage.css";
import neo from "./neoFlicker.mp4";
import neoClick from "./neoClick.mp4";
import agentSmith from "./agentSmithFlicker.mp4";
import agentSmithClick from "./agentSmithClick.mp4";
import backgroundVideo from "./backgroundMatrix.mov";
import Title from "./Title";

const MainPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [startAnimation, setStartAnimation] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [deviceType, setDeviceType] = useState("desktop");

  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent);

      setIsMobile(isMobileDevice && !isTablet);

      if (isTablet) {
        setDeviceType("tablet");
      } else if (isMobileDevice) {
        setDeviceType("mobile");
      } else {
        setDeviceType("desktop");
      }
    };

    detectDevice();
    window.addEventListener("resize", detectDevice);
    window.addEventListener("orientationchange", detectDevice);

    return () => {
      window.removeEventListener("resize", detectDevice);
      window.removeEventListener("orientationchange", detectDevice);
    };
  }, []);

  useEffect(() => {
    const handlePageShow = (event) => {
      if (event.persisted) {
        window.location.reload();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  const navigateTo = (path) => {
    window.location.href = path;
  };

  const handleImageClick = useCallback(
    (imageType) => {
      if (isMoving) return;

      setIsMoving(true);
      setSelectedImage(imageType); // Change video immediately

      if (isMobile) {
        navigateTo(imageType === "Neo" ? "/neo" : "/agent-smith");
        return;
      }

      // Wait for video to play (4 seconds)
      setTimeout(() => {
        setStartAnimation(true); // Start animation

        // Wait for animation to finish (1 second)
        setTimeout(() => {
          navigateTo(imageType === "Neo" ? "/neo" : "/agent-smith");
          setIsMoving(false);
          setStartAnimation(false);
        }, 1000);
      }, 1700);
    },
    [isMoving, isMobile]
  );

  const getVideoSrc = (type) => {
    if (selectedImage === type) {
      return type === "Neo" ? neoClick : agentSmithClick;
    } else {
      return type === "Neo" ? neo : agentSmith;
    }
  };

  return (
    <div className="main-page">
      <video
        className="background-video"
        src={backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
      />
      <Title />
      <main className="agentSmith-neo-navigation">
        {/* Agent Smith Section */}
        <section className={`image-container-wrapper-neo ${selectedImage === "agentSmith" ? "selected" : ""}`}>
          <div
            className={`image-container 
              ${selectedImage && selectedImage !== "agentSmith" ? "blackout" : ""}`}
            role="button"
            aria-label="Navigate to agentSmith Main Page"
            aria-live="polite"
            onClick={() => handleImageClick("agentSmith")}
          >
            <video
              className="navigation-video"
              src={getVideoSrc("agentSmith")}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              onLoadedData={(e) => e.target.play()}
              onError={(e) => console.error("Error loading agentSmith video:", e)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div
            className={`title-box ${
              startAnimation && selectedImage === "agentSmith"
                ? "move-right"
                : selectedImage === "Neo"
                ? "move-left"
                : "reset"
            }`}
          >
            <h2 className="photo-title">Agent Smith</h2>
            <p className="photo-subtitle">Innovate with cutting-edge agentSmith solutions.</p>
          </div>
        </section>

        {/* Neo Section */}
        <section className={`image-container-wrapper-agentSmith ${selectedImage === "Neo" ? "selected" : ""}`}>
          <div
            className={`image-container 
              ${selectedImage && selectedImage !== "Neo" ? "blackout" : ""}`}
            role="button"
            aria-label="Navigate to Neo Main Page"
            aria-live="polite"
            onClick={() => handleImageClick("Neo")}
          >
            <video
              className="navigation-video"
              src={getVideoSrc("Neo")}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              onLoadedData={(e) => e.target.play()}
              onError={(e) => console.error("Error loading Neo video:", e)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div
            className={`title-box ${
              startAnimation && selectedImage === "Neo"
                ? "move-left"
                : selectedImage === "agentSmith"
                ? "move-right"
                : "reset"
            }`}
          >
            <h2 className="photo-title">Neo</h2>
            <p className="photo-subtitle">Secure the future with advanced cybersecurity.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MainPage;
