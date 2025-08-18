import React, { useState, useCallback, useEffect, memo, useRef, useId } from "react";
import { useNavigate } from "react-router-dom";
import "./MainPage.css";

/* Videos */
import neo from "./neoFlicker.mp4";
import neoClick from "./neo.png";
import agentSmith from "./agentSmithFlicker.mp4";
import agentSmithClick from "./agentSmith.png";
import backgroundVideo from "./backgroundMatrix.mov";

/* UI */
import Title from "./Title";

/* ---------- Reusable hooks ---------- */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(Boolean(mq?.matches));
    apply();
    mq?.addEventListener?.("change", apply);
    return () => mq?.removeEventListener?.("change", apply);
  }, []);
  return reduced;
}

function useDeviceType() {
  const [state, setState] = useState({ isMobile: false, deviceType: "desktop" });
  useEffect(() => {
    const update = () => {
      const small = window.matchMedia?.("(max-width: 768px)")?.matches;
      const coarse = window.matchMedia?.("(pointer: coarse)")?.matches;
      const tablet = window.matchMedia?.("(min-width: 600px) and (max-width: 1024px)")?.matches;
      const isMobile = Boolean(small && coarse);
      const deviceType = tablet ? "tablet" : small ? (coarse ? "mobile" : "desktop") : "desktop";
      setState({ isMobile, deviceType });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);
  return state;
}

/* ---------- VideoSwap component ---------- */
/**
 * שני וידאו מוערמים עם קרוס-פייד.
 * שמירת יחס ממדים יציב לפני טעינת מטא־דאטה (CLS 0).
 * הפסקה מחוץ למסך, טיפול בהעדפת reduced motion ובחסימת autoplay.
 */
const VideoSwap = memo(function VideoSwap({
  idleSrc,
  activeSrc,
  isActive,
  onErrorLabel = "video",
  idlePoster = "",
  activePoster = "",
  fallbackRatio = 16 / 9,
  priority = false,
}) {
  const reduced = usePrefersReducedMotion();
  const [ratio, setRatio] = useState(null);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [hasError, setHasError] = useState(false);

  const activeRef = useRef(null);
  const idleRef = useRef(null);
  const containerRef = useRef(null);

  const setRatioFrom = (v) => {
    if (v?.videoWidth && v?.videoHeight && !ratio) {
      setRatio(v.videoWidth / v.videoHeight);
    }
  };

  const tryPlay = async (v) => {
    if (!v || reduced) return;
    try {
      await v.play();
    } catch {
      setAutoplayBlocked(true);
    }
  };

  const onLoadedData = (e) => {
    setHasError(false);
    setRatioFrom(e.currentTarget);
    tryPlay(e.currentTarget);
  };

  const onError = (e) => {
    console.error(`Error loading ${onErrorLabel}:`, e);
    setHasError(true);
  };

  // לשמור על ניגון לאחר חזרה מחלון רקע/Back-Forward cache
  useEffect(() => {
    const onShow = (ev) => {
      if (ev.persisted) {
        tryPlay(activeRef.current);
        tryPlay(idleRef.current);
      }
    };
    const onVis = () => {
      if (document.visibilityState === "visible") {
        tryPlay(activeRef.current);
        tryPlay(idleRef.current);
      }
    };
    window.addEventListener("pageshow", onShow);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("pageshow", onShow);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [reduced]);

  // עצירה כשמחוץ למסך
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const obs = new IntersectionObserver(([entry]) => {
      const visible = entry?.isIntersecting;
      [activeRef.current, idleRef.current].forEach((v) => {
        if (!v) return;
        if (visible) tryPlay(v);
        else v.pause();
      });
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduced]);

  const handleUserStart = () => {
    setAutoplayBlocked(false);
    tryPlay(idleRef.current);
    tryPlay(activeRef.current);
  };

  const ar = ratio ?? fallbackRatio;
  const ptPercent = `${(1 / ar) * 100}%`;

  return (
    <div
      ref={containerRef}
      className={`image-container ${autoplayBlocked && !reduced ? "needs-tap" : ""}`}
      style={{ "--pt": ptPercent }}
    >
      {/* סייזר ל־fallback בדפדפנים בלי aspect-ratio */}
      <div className="sizer" aria-hidden />

      <video
        ref={activeRef}
        className={`navigation-video ${isActive ? "show" : "hide"}`}
        src={activeSrc}
        poster={activePoster || undefined}
        autoPlay={!reduced}
        loop
        muted
        playsInline
        preload="metadata"
        onLoadedData={onLoadedData}
        onError={onError}
      />
      <video
        ref={idleRef}
        className={`navigation-video ${isActive ? "hide" : "show"}`}
        src={idleSrc}
        poster={idlePoster || undefined}
        autoPlay={!reduced}
        loop
        muted
        playsInline
        preload={priority ? "auto" : "metadata"}
        onLoadedData={onLoadedData}
        onError={onError}
      />

      {autoplayBlocked && !reduced && (
        <button className="tap-to-play" onClick={handleUserStart} aria-label="Start videos">
          Tap to play
        </button>
      )}
      {hasError && (
        <div className="video-error" role="status" aria-live="polite">
          Unable to load media.
        </div>
      )}
    </div>
  );
});

/* ---------- MainPage ---------- */
const MainPage = () => {
  const { isMobile, deviceType } = useDeviceType();
  const reduced = usePrefersReducedMotion();
  const [selected, setSelected] = useState(null); // "Neo" | "agentSmith" | null
  const [anim, setAnim] = useState(false);
  const [busy, setBusy] = useState(false);

  const navigate = useNavigate();
  const headingId = useId();

  const navigateTo = useCallback((imageType) => {
    navigate(imageType === "Neo" ? "/neo" : "/agent-smith");
  }, [navigate]);

  const activateCard = useCallback((imageType) => {
    if (busy) return;
    setBusy(true);
    setSelected(imageType);

    if (isMobile || reduced) {
      navigateTo(imageType);
      setBusy(false);
      return;
    }

    // אנימציה קצרה בדסקטופ בלבד
    setAnim(true);
    const t = setTimeout(() => {
      navigateTo(imageType);
      setBusy(false);
      setAnim(false);
    }, 900); // השהיה מספיקה לאנימציית טקסט
    return () => clearTimeout(t);
  }, [busy, isMobile, reduced, navigateTo]);

  const onCardKeyDown = (e, type) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      activateCard(type);
    }
  };

  const fallbackMobile = 1;        // 1:1 בכרטיסים קטנים
  const fallbackDesktop = 16 / 9;  // 16:9 ביתר

  return (
    <div className="main-page" data-device-type={deviceType} aria-labelledby={headingId}>
      {/* רקע – מכובד להעדפת reduced motion */}
      {!reduced && (
        <video
          className="background-video"
          src={backgroundVideo}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
        />
      )}
      <Title id={headingId} />

      <main className="agentSmith-neo-navigation">
        {/* Agent Smith */}
        <section
          className={`image-container-wrapper-agentSmith ${selected === "agentSmith" ? "selected" : ""}`}
          aria-label="Agent Smith card"
        >
          <div
            className={`image-clickable ${selected && selected !== "agentSmith" ? "blackout" : ""}`}
            role="button"
            tabIndex={0}
            aria-label="Navigate to Agent Smith Main Page"
            onClick={() => activateCard("agentSmith")}
            onKeyDown={(e) => onCardKeyDown(e, "agentSmith")}
          >
            <VideoSwap
              idleSrc={agentSmith}
              activeSrc={agentSmithClick}
              isActive={selected === "agentSmith"}
              onErrorLabel="agentSmith"
              fallbackRatio={isMobile ? fallbackMobile : fallbackDesktop}
              priority
            />
          </div>

          <div
            className={`title-box ${
              anim && selected === "agentSmith"
                ? "move-right"
                : selected === "Neo"
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
          className={`image-container-wrapper-neo ${selected === "Neo" ? "selected" : ""}`}
          aria-label="Neo card"
        >
          <div
            className={`image-clickable ${selected && selected !== "Neo" ? "blackout" : ""}`}
            role="button"
            tabIndex={0}
            aria-label="Navigate to Neo Main Page"
            onClick={() => activateCard("Neo")}
            onKeyDown={(e) => onCardKeyDown(e, "Neo")}
          >
            <VideoSwap
              idleSrc={neo}
              activeSrc={neoClick}
              isActive={selected === "Neo"}
              onErrorLabel="Neo"
              fallbackRatio={isMobile ? fallbackMobile : fallbackDesktop}
            />
          </div>

          <div
            className={`title-box ${
              anim && selected === "Neo"
                ? "move-left"
                : selected === "agentSmith"
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