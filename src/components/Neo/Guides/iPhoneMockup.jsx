import React, { useRef, useState, useMemo } from "react";
import "./iPhoneMockup.css";

/**
 * iPhone-17 style mockup - גרסה מעודכנת ונקייה
 */
export default function IPhoneMockup({
  /** גודל המכשיר */
  width = 300,                   // ברירת מחדל מוקטנת כפי שביקשת
  ratio = 9 / 19,                
  className = "",

  /** תוכן המסך */
  screen,                        
  children,                      

  /** הגדרות יד (כבוי כברירת מחדל) */
  showHand = false,              
  handImageBack = "/assets/hand-back.png",
  handImageFront = "/assets/hand-front.png",
  handSide = "right",            
  handScale = 0.58,
  handOffsetX,                   
  handOffsetY = 110,             
  handRotate,                    

  /** מראה ותחושה */
  color = "titanium-black",
  islandScale = 0.96,
  glassShine = 1,
  ambient = 0.88,

  /** אינטראקציה */
  tiltEnabled = false,           
}) {
  const wrapRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, tz: 0 });

  const defaultX  = handSide === "right" ? 180 : -140;
  const defaultRot= handSide === "right" ? 12  : -12;

  /** חישובי הטיה (Tilt) */
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

  /** חישובי טרנספורמציה */
  const baseHandTransform = `
    translate(${(handOffsetX ?? defaultX)}px, ${handOffsetY}px)
    rotate(${handRotate ?? defaultRot}deg)
    scale(${handScale})
  `;
  const tilt3D = `translateZ(${tilt.tz}px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))`;
  const handTransform  = tiltEnabled ? `${tilt3D} ${baseHandTransform}` : baseHandTransform;
  const phoneTransform = tiltEnabled ? tilt3D : "none";

  const [backErr,  setBackErr]  = useState(false);
  const [frontErr, setFrontErr] = useState(false);

  /** Fallbacks ל-SVG של היד */
  const FallbackBack = useMemo(() => (
    <svg viewBox="0 0 800 900" className="hand-svg" aria-hidden>
      <defs>
        <linearGradient id="hg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#4b4f55" />
          <stop offset="1" stopColor="#2b2e33" />
        </linearGradient>
      </defs>
      <path d="M160 700 C 250 540, 300 490, 360 480 420 470, 520 480, 610 520 655 540, 680 560, 696 590 708 612, 708 638, 695 660 680 683, 638 700, 590 705 470 716, 430 735, 380 820 360 855, 340 860, 320 850 270 825, 245 795, 160 700 Z" fill="url(#hg)" />
    </svg>
  ), []);

  const FallbackFront = useMemo(() => (
    <svg viewBox="0 0 800 900" className="hand-svg" aria-hidden>
      <ellipse cx="625" cy="565" rx="24" ry="54" fill="#202328" opacity="0.6"/>
      <ellipse cx="665" cy="585" rx="22" ry="50" fill="#202328" opacity="0.6"/>
    </svg>
  ), []);

  return (
    <section className={`iphone17-section ${className}`}>
      {/* ambient כאן משפיע על התאורה הכללית */}
      <div className="iphone17-scene" style={{ "--ambient": ambient }}>
        
        {/* ה-bg-grid הוסר ויזואלית ב-CSS שסיפקתי קודם */}
        <div className="bg-grid" aria-hidden />

        <div
          ref={wrapRef}
          className="persp"
          onPointerMove={tiltEnabled ? onPointerMove : undefined}
          onPointerLeave={tiltEnabled ? onPointerLeave : undefined}
        >
          {/* יד אחורית */}
          {showHand && (
            <div className="hand-layer hand-back" style={{ transform: handTransform }}>
              {!backErr ? (
                <img className="hand-img" src={handImageBack} alt="" onError={() => setBackErr(true)} />
              ) : (
                <div className="hand-fallback">{FallbackBack}</div>
              )}
            </div>
          )}

          {/* גוף הטלפון */}
          <div
            className={`iphone17 ${color}`}
            style={{
              width: typeof width === "number" ? `${width}px` : width,
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
                    <div className="t1">No Content</div>
                  </div>
                )}
                <div className="panel-glow" aria-hidden />
                <div className="speaker" />
                <div className="island"><span className="sensor" /></div>
                <div className="glass-top" />
                <div className="glass-arc" />
              </div>
            </div>

            {/* חיבור טעינה ורמקולים בתחתית */}
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

          {/* יד קדמית */}
          {showHand && (
            <div className="hand-layer hand-front" style={{ transform: handTransform }}>
              {!frontErr ? (
                <img className="hand-img" src={handImageFront} alt="" onError={() => setFrontErr(true)} />
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
