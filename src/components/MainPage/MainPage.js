import React, { useState, useCallback, useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import "./MainPage.css";

import neo from "./neoFlicker.mp4";
import neoClick from "./neoClick.mp4";
import agentSmith from "./agentSmithFlicker.mp4";
import agentSmithClick from "./agentSmithClick.mp4";
import backgroundVideo from "./backgroundMatrix.mov";
import Title from "./Title";

/**
 * VideoSwap
 * - Two stacked <video> elements with a cross-fade (no src swap during transition).
 * - Reads intrinsic videoWidth/videoHeight and sets CSS var --ar so the container height
 *   matches the real video ratio (prevents layout shifts).
 */
const VideoSwap = memo(function VideoSwap({
  idleSrc,
  activeSrc,
  isActive,
  onErrorLabel = "video",
}) {
  const [ratio, setRatio] = useState(null); // number | null

  const handleMeta = (e) => {
    if (ratio) return;
    const v = e.currentTarget;
    if (v.videoWidth && v.videoHeight) {
      setRatio(v.videoWidth / v.videoHeight);
    }
  };

  return (
    <div
      className="image-container"
      style={ratio ? { ["--ar"]: ratio } : undefined}
    >
      {/* Active / clicked video */}
      <video
        className={`navigation-video ${isActive ? "show" : "hide"}`}
        src={activeSrc}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onLoadedMetadata={handleMeta}
        onLoadedData={(e) => e.currentTarget.play().catch(() => {})}
        onError={(e) => console.error(`Error loading ${onErrorLabel} active video:`, e)}
      />

      {/* Idle / default video */}
      <video
        className={`navigation-video ${isActive ? "hide" : "show"}`}
        src={idleSrc}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onLoadedMetadata={handleMeta}
        onLoadedData={(e) => e.currentTarget.play().catch(() => {})}
        onError={(e) => console.error(`Error loading ${onErrorLabel} idle video:`, e)}
      />
    </div>
  );
});

const MainPage = () => {
  const [selectedImage, setSelectedImage] = useState(null); // "Neo" | "agentSmith" | null
  const [startAnimation, setStartAnimation] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [deviceType, setDeviceType] = useState("desktop");

  const navigate = useNavigate();

  // Device detection (unchanged logic)
  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/i.test(userAgent);
      setIsMobile(isMobileDevice && !isTablet);
      if (isTablet) setDeviceType("tablet");
      else if (isMobileDevice) setDeviceType("mobile");
      else setDeviceType("desktop");
    };

    detectDevice();
    window.addEventListener("resize", detectDevice);
    window.addEventListener("orientationchange", detectDevice);
    return () => {
      window.removeEventListener("resize", detectDevice);
      window.removeEventListener("orientationchange", detectDevice);
    };
  }, []);

  // Handle returning via Back/Forward (bfcache): DO NOT reload; just resume videos.
  useEffect(() => {
    const handlePageShow = (event) => {
      if (event.persisted) {
        document.querySelectorAll("video").forEach((vid) => {
          // kick playback; ignore autoplay restrictions because videos are muted
          vid.play().catch(() => {});
        });
      }
    };
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        document.querySelectorAll("video").forEach((vid) => {
          vid.play().catch(() => {});
        });
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const navigateTo = (path) => {
    // SPA navigation prevents a full reload (keeps media alive)
    navigate(path);
  };

  const handleImageClick = useCallback(
    (imageType) => {
      if (isMoving) return;
      setIsMoving(true);
      setSelectedImage(imageType); // show "clicked" video immediately

      if (isMobile) {
        navigateTo(imageType === "Neo" ? "/neo" : "/agent-smith");
        return;
      }

      // Let the click-video play briefly, animate, then navigate
      setTimeout(() => {
        setStartAnimation(true);
        setTimeout(() => {
          navigateTo(imageType === "Neo" ? "/neo" : "/agent-smith");
          setIsMoving(false);
          setStartAnimation(false);
        }, 1000);
      }, 1700);
    },
    [isMoving, isMobile]
  );

  return (
    <div className="main-page" data-device-type={deviceType}>
      <video className="background-video" src={backgroundVideo} autoPlay loop muted playsInline />
      <Title />

      <main className="agentSmith-neo-navigation">
        {/* Agent Smith */}
        <section
          className={`image-container-wrapper-agentSmith ${selectedImage === "agentSmith" ? "selected" : ""}`}
        >
          <div
            className={`image-clickable ${selectedImage && selectedImage !== "agentSmith" ? "blackout" : ""}`}
            role="button"
            aria-label="Navigate to Agent Smith Main Page"
            aria-live="polite"
            onClick={() => handleImageClick("agentSmith")}
          >
            <VideoSwap
              idleSrc={agentSmith}
              activeSrc={agentSmithClick}
              isActive={selectedImage === "agentSmith"}
              onErrorLabel="agentSmith"
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

        {/* Neo */}
        <section
          className={`image-container-wrapper-neo ${selectedImage === "Neo" ? "selected" : ""}`}
        >
          <div
            className={`image-clickable ${selectedImage && selectedImage !== "Neo" ? "blackout" : ""}`}
            role="button"
            aria-label="Navigate to Neo Main Page"
            aria-live="polite"
            onClick={() => handleImageClick("Neo")}
          >
            <VideoSwap
              idleSrc={neo}
              activeSrc={neoClick}
              isActive={selectedImage === "Neo"}
              onErrorLabel="Neo"
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
