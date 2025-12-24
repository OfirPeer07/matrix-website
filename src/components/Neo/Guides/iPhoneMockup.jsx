import React, { useRef, useState, useMemo } from "react";
import "./iPhoneMockup.css";

/**
 * iPhone-17 style mockup + optional hand overlays.
 * - Pass `screen` (URL) or put JSX children inside to render inside the device.
 * - Hand PNGs are optional; if they fail to load, SVG fallbacks appear automatically.
 * - Set `tiltEnabled={false}` (default) to keep phone static.
 */
export default function IPhoneMockup({
  /** Size */
  width = 360,                   // device width in px
  ratio = 9 / 19,                // “shorter” aspect (closer to 17 Pro Max)
  className = "",

  /** Screen */
  screen,                        // URL of image to show
  children,                      // JSX to render inside

  /** Hand (overlay) */
  showHand = true,
  handImageBack = "/assets/hand-back.png",
  handImageFront = "/assets/hand-front.png",
  handSide = "right",            // 'right' | 'left'
  handScale = 0.58,
  handOffsetX,                   // px; default depends on side
  handOffsetY = 110,             // px
  handRotate,                    // deg; default depends on side

  /** Look & feel */
  color = "titanium-black",
  islandScale = 0.96,
  glassShine = 1,
  ambient = 0.88,

  /** Interaction */
  tiltEnabled = false,           // <— disable motion by default
}) {
  const wrapRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, tz: 0 });

  const defaultX  = handSide === "right" ? 180 : -140;
  const defaultRot= handSide === "right" ? 12  : -12;

  /** pointer tilt (desktop & mobile) */
  const onPointerMove = (e) => {
    if (!tiltEnabled) return;
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const ry = (x - 0.5) * 10;
    const rx = (0.5 - y) * 8;
    setTilt({ rx, ry, tz: 10 });
    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
  };
  const onPointerLeave = () => {
    if (!tiltEnabled) return;
    setTilt({ rx: 0, ry: 0, tz: 0 });
    const el = wrapRef.current;
    if (!el) return;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
  };

  /** transforms */
  const baseHandTransform = `
    translate(${(handOffsetX ?? defaultX)}px, ${handOffsetY}px)
    rotate(${handRotate ?? defaultRot}deg)
    scale(${handScale})
  `;
  const tilt3D = `translateZ(${tilt.tz}px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))`;
  const handTransform  = tiltEnabled ? `${tilt3D} ${baseHandTransform}` : baseHandTransform;
  const phoneTransform = tiltEnabled ? tilt3D : "none";

  /** PNG load fallback flags */
  const [backErr,  setBackErr]  = useState(false);
  const [frontErr, setFrontErr] = useState(false);

  /** Simple SVG fallbacks so שתמיד תראה יד */
  const FallbackBack = useMemo(
    () => (
      <svg viewBox="0 0 800 900" className="hand-svg" aria-hidden>
        <defs>
          <linearGradient id="hg" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#4b4f55" />
            <stop offset="1" stopColor="#2b2e33" />
          </linearGradient>
        </defs>
        <path d="M160 700 C 250 540, 300 490, 360 480 420 470, 520 480, 610 520 655 540, 680 560, 696 590 708 612, 708 638, 695 660 680 683, 638 700, 590 705 470 716, 430 735, 380 820 360 855, 340 860, 320 850 270 825, 245 795, 160 700 Z" fill="url(#hg)" />
        <path d="M175 690 c -30 -35 -40 -70 -25 -95 10 -17 40 -15 75 10 30 22 45 55 38 78 -8 27 -41 35 -88 7 Z" fill="#3a3e44" />
        <ellipse cx="640" cy="585" rx="26" ry="58" fill="#23262a" opacity="0.55"/>
        <ellipse cx="680" cy="605" rx="22" ry="52" fill="#23262a" opacity="0.55"/>
      </svg>
    ),
    []
  );
  const FallbackFront = useMemo(
    () => (
      <svg viewBox="0 0 800 900" className="hand-svg" aria-hidden>
        <ellipse cx="625" cy="565" rx="24" ry="54" fill="#202328" opacity="0.6"/>
        <ellipse cx="665" cy="585" rx="22" ry="50" fill="#202328" opacity="0.6"/>
      </svg>
    ),
    []
  );

  return (
    <section className={`iphone17-section ${className}`}>
      <div className="iphone17-scene" style={{ "--ambient": ambient }}>
        <div className="bg-grid" aria-hidden />
        <div
          ref={wrapRef}
          className="persp"
          onPointerMove={tiltEnabled ? onPointerMove : undefined}
          onPointerLeave={tiltEnabled ? onPointerLeave : undefined}
        >
          {/* HAND BACK */}
          {showHand && (
            <div className="hand-layer hand-back" style={{ transform: handTransform }}>
              {!backErr ? (
                <img
                  className="hand-img"
                  src={handImageBack}
                  alt=""
                  onError={() => setBackErr(true)}
                />
              ) : (
                <div className="hand-fallback">{FallbackBack}</div>
              )}
            </div>
          )}

          {/* PHONE */}
          <div
            className={`iphone17 ${color}`}
            style={{
              width,
              "--device-ratio": ratio,
              "--island-scale": islandScale,
              "--shine": glassShine,
              transform: phoneTransform,
            }}
          >
            <div className="frame">
              <span className="ant a-top" />
              <span className="ant a-left" />
              <span className="ant a-right" />
              <span className="ant a-bottom" />
              <span className="btn power" />
              <span className="btn vol-up" />
              <span className="btn vol-down" />
            </div>

            <div className="panel">
              <div className="bezel" />
              <div className="screen-clip">
                {children ? (
                  <div className="screen-ui">{children}</div>
                ) : screen ? (
                  <img className="screen-img" src={screen} alt="screen" />
                ) : (
                  <div className="screen-ph">
                    <div className="t1">Put your screen here</div>
                    <div className="t2">Dynamic phone mockup</div>
                  </div>
                )}
                <div className="panel-glow" aria-hidden />
                <div className="speaker" />
                <div className="island"><span className="sensor" /></div>
                <div className="glass-top" />
                <div className="glass-arc" />
              </div>
            </div>

            {/* Bottom I/O hint */}
            <div className="io" aria-hidden>
              <div className="grid">
                {Array.from({ length: 6 }).map((_, i) => <span key={`l${i}`} className="dot" />)}
              </div>
              <div className="usb" />
              <div className="grid">
                {Array.from({ length: 6 }).map((_, i) => <span key={`r${i}`} className="dot" />)}
              </div>
            </div>

            <div className="floor-shadow" />
          </div>

          {/* HAND FRONT */}
          {showHand && (
            <div className="hand-layer hand-front" style={{ transform: handTransform }}>
              {!frontErr ? (
                <img
                  className="hand-img"
                  src={handImageFront}
                  alt=""
                  onError={() => setFrontErr(true)}
                />
              ) : (
                <div className="hand-fallback">{FallbackFront}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
