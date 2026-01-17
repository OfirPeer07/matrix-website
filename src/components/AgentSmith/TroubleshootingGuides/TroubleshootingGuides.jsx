import React, { useEffect, useMemo, useRef, useState } from "react";
import "./TroubleshootingGuides.css";

/* ----------------------- תרגומים ותכנים ----------------------- */
const translations = {
  en: {
    dir: "ltr",
    title: "Troubleshooting Guides",
    subtitle: "Scan for problem analysis using automation tools",
    notice: "Notice: This tool is a DevOps / SecDevOps tool",
    footer: "Demo-only: shows design & automation feel — no real scanning.",
    close: "✖ Close",
    pause: "⏸ Pause",
    resume: "▶ Resume",
    rerun: "↻ Rerun",
    now: "Now",
    summary: "Summary",
    started: "Started",
    ended: "Ended",
    duration: "Duration",
    toggle: "HE",
    flows: {
      networking: "Networking",
      security: "Security",
      performance: "Performance",
      cloud: "Cloud",
    },
    steps: {
      networking: [
        { icon: "🌐", text: "Detecting packet loss" },
        { icon: "⚡", text: "Running ping sequence" },
        { icon: "🔍", text: "Analyzing latency patterns" },
        { icon: "🛠️", text: "Applying optimized route" },
        { icon: "✅", text: "Validation & health check" },
      ],
      security: [
        { icon: "🚨", text: "Signature-based scan" },
        { icon: "🔎", text: "Heuristic analysis" },
        { icon: "🧰", text: "Applying security patches" },
        { icon: "🔐", text: "Hardening config" },
        { icon: "✅", text: "Post-patch verification" },
      ],
      performance: [
        { icon: "📊", text: "Detecting high CPU threads" },
        { icon: "🧠", text: "Profiling hot paths" },
        { icon: "♻️", text: "Tuning GC & concurrency" },
        { icon: "📈", text: "Rebalancing load" },
        { icon: "✅", text: "Performance safeguard" },
      ],
      cloud: [
        { icon: "🚀", text: "Preparing deployment" },
        { icon: "🔄", text: "Spinning containers" },
        { icon: "🔗", text: "Linking services" },
        { icon: "🔍", text: "Smoke tests" },
        { icon: "✅", text: "Deployment successful" },
      ],
    }
  },
  he: {
    dir: "rtl",
    title: "מדריכי פתרון תקלות",
    subtitle: "סריקה וניתוח בעיות באמצעות כלי אוטומציה",
    notice: "שים לב: זהו כלי המיועד לצוותי DevOps / SecDevOps",
    footer: "הדגמה בלבד: מציג עיצוב ותחושת אוטומציה - ללא סריקה אמיתית.",
    close: "✖ סגור",
    pause: "⏸ השהה",
    resume: "▶ המשך",
    rerun: "↻ הרץ שוב",
    now: "עכשיו",
    summary: "סיכום",
    started: "התחלה",
    ended: "סיום",
    duration: "משך זמן",
    toggle: "EN",
    flows: {
      networking: "תקשורת",
      security: "אבטחה",
      performance: "ביצועים",
      cloud: "ענן",
    },
    steps: {
      networking: [
        { icon: "🌐", text: "מזהה איבוד חבילות (Packet Loss)" },
        { icon: "⚡", text: "מריץ סדרת בדיקות Ping" },
        { icon: "🔍", text: "מנתח דפוסי השהייה (Latency)" },
        { icon: "🛠️", text: "מחיל ניתוב אופטימלי" },
        { icon: "✅", text: "בדיקת תקינות ואימות" },
      ],
      security: [
        { icon: "🚨", text: "סריקת חתימות דיגיטליות" },
        { icon: "🔎", text: "ניתוח היוריסטי" },
        { icon: "🧰", text: "החלת עדכוני אבטחה" },
        { icon: "🔐", text: "הקשחת קונפיגורציה" },
        { icon: "✅", text: "אימות לאחר עדכון" },
      ],
      performance: [
        { icon: "📊", text: "זיהוי עומס מעבד (CPU)" },
        { icon: "🧠", text: "פרופיילינג לנתיבי הרצה" },
        { icon: "♻️", text: "כיוונון GC וריצה מקבילית" },
        { icon: "📈", text: "איזון עומסים מחדש" },
        { icon: "✅", text: "החלת הגנות ביצועים" },
      ],
      cloud: [
        { icon: "🚀", text: "מכין סביבת פריסה" },
        { icon: "🔄", text: "מריץ קונטיינרים" },
        { icon: "🔗", text: "מקשר שירותי ענן" },
        { icon: "🔍", text: "בדיקות עשן (Smoke Tests)" },
        { icon: "✅", text: "פריסה הושלמה בהצלחה" },
      ],
    }
  }
};

/* ----------------------- Utilities ----------------------- */
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const wobble = (prev, target, jitter = 0.25) => {
  const toward = prev + (target - prev) * (0.08 + Math.random() * 0.12);
  const j = (Math.random() - 0.5) * jitter;
  return Math.max(0, toward + j);
};

/* ----------------------- Sparkline ----------------------- */
function Sparkline({ values = [], width = 240, height = 56, stroke = "#00ff41" }) {
  const safeVals = values.length ? values : [0];
  const max = Math.max(...safeVals, 1);
  const min = Math.min(...safeVals, 0);
  const range = Math.max(1, max - min);
  const stepX = width / Math.max(1, safeVals.length - 1);
  const points = safeVals.map((v, i) => `${i * stepX},${height - ((v - min) / range) * height}`);
  return (
    <svg className="tg-spark" viewBox={`0 0 ${width} ${height}`} width="100%" height={height}>
      <polyline fill="none" stroke={stroke} strokeWidth="2" points={points.join(" ")} />
    </svg>
  );
}

/* ----------------------- Hooks (Metrics & Runner) ----------------------- */
function useMockMetrics({ running, activeIdx, stepsCount }) {
  const [data, setData] = useState([]);
  const latencyRef = useRef(120);
  const cpuRef = useRef(0.42);
  const loopRef = useRef(null);
  
  useEffect(() => {
    const tick = () => {
      latencyRef.current = wobble(latencyRef.current, running ? 40 : 100, running ? 0.5 : 0.1);
      cpuRef.current = wobble(cpuRef.current, running ? 0.2 : 0.5, 0.05);
      setData(prev => [...prev, { latency: latencyRef.current, cpu: cpuRef.current }].slice(-80));
    };
    loopRef.current = setInterval(tick, running ? 200 : 400);
    return () => clearInterval(loopRef.current);
  }, [running]);
  return data;
}

function useDemoRunner({ steps, totalDurationSec = 6 }) {
  const [progress, setProgress] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);
  const [running, setRunning] = useState(false);
  const [startedAt, setStartedAt] = useState(null);
  const [endedAt, setEndedAt] = useState(null);
  const [stepResults, setStepResults] = useState([]);

  const rafRef = useRef(null);
  const startRef = useRef(null);

  const tick = (ts) => {
    if (!startRef.current) startRef.current = ts;
    const elapsed = (ts - startRef.current) / 1000;
    const pct = clamp((elapsed / totalDurationSec) * 100, 0, 100);
    setProgress(pct);
    
    const idx = Math.min(steps.length - 1, Math.floor((pct / 100) * steps.length));
    setActiveIdx(idx);

    if (pct < 100) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      setRunning(false);
      setEndedAt(Date.now());
      setStepResults(steps.map(() => ({ status: "done" })));
    }
  };

  const start = () => {
    setStartedAt(Date.now());
    setEndedAt(null);
    setRunning(true);
    startRef.current = null;
    rafRef.current = requestAnimationFrame(tick);
  };

  const reset = () => {
    cancelAnimationFrame(rafRef.current);
    setProgress(0);
    setRunning(false);
    setActiveIdx(0);
  };

  return { progress, activeIdx, running, start, reset, startedAt, endedAt, stepResults };
}

/* ----------------------- Main Component ----------------------- */
export default function TroubleshootingGuides() {
  const [locale, setLocale] = useState("en");
  const [topic, setTopic] = useState(null);
  const t = translations[locale];

  const steps = useMemo(() => (topic ? t.steps[topic] : []), [topic, t]);
  const runner = useDemoRunner({ steps });
  const metrics = useMockMetrics({ running: runner.running });

  useEffect(() => {
    if (topic) runner.start();
  }, [topic]);

  const isDone = runner.progress >= 100;

  return (
    <div className="tg-page matrix-theme" dir={t.dir}>
      {/* כפתור החלפת שפה בסגנון Pill */}
      <button className="btn-locale-fixed" onClick={() => setLocale(locale === "en" ? "he" : "en")}>
        {t.toggle}
      </button>

      <header className="tg-hero">
        <h1 className="glitch-text">{t.title}</h1>
        <p>{t.subtitle}</p>
        <p className="matrix-notice">{t.notice}</p>
      </header>

      <div className="tg-cards">
        {Object.keys(t.steps).map((key) => (
          <button
            key={key}
            className={`tg-card ${topic === key ? "is-active" : ""}`}
            onClick={() => { runner.reset(); setTopic(key); }}
          >
            {key === "networking" && "🌐 "}
            {key === "security" && "🔒 "}
            {key === "performance" && "⚙️ "}
            {key === "cloud" && "☁️ "}
            {t.flows[key]}
          </button>
        ))}
      </div>

      {topic && (
        <div className="runner-container">
          <section className="tg-dock">
            <header className="tg-head">
              <div className="tg-title">
                <strong>{t.flows[topic]}</strong>
                <span className="tg-sub">{steps[runner.activeIdx]?.text}</span>
              </div>
              <div className="tg-actions">
                {isDone ? (
                  <button className="tg-btn" onClick={() => { runner.reset(); runner.start(); }}>{t.rerun}</button>
                ) : (
                  <button className="tg-btn" onClick={runner.reset}>{t.close}</button>
                )}
              </div>
            </header>

            <div className="tg-progress">
              <div className="tg-progress-bar" style={{ width: `${runner.progress}%` }} />
            </div>

            <ol className="tg-steps">
              {steps.map((s, i) => (
                <li key={i} className={`tg-step ${i <= runner.activeIdx ? "is-done" : ""}`}>
                  <span className="tg-bullet">{i < runner.activeIdx ? "✔" : "●"}</span>
                  <span className="tg-text">{s.text}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="tg-panels">
            <div className="tg-card-panel">
              <div className="tg-card-title">Latency (ms)</div>
              <Sparkline values={metrics.map(m => m.latency)} />
              <div className="tg-meta"><span>{t.now}</span><strong>{Math.round(metrics[metrics.length-1]?.latency || 0)}ms</strong></div>
            </div>
            <div className="tg-card-panel">
              <div className="tg-card-title">CPU (%)</div>
              <Sparkline values={metrics.map(m => m.cpu * 100)} stroke="#34d0a9" />
              <div className="tg-meta"><span>{t.now}</span><strong>{Math.round((metrics[metrics.length-1]?.cpu || 0) * 100)}%</strong></div>
            </div>
          </section>
        </div>
      )}

      <footer className="tg-foot">
        <p>{t.footer}</p>
      </footer>
    </div>
  );
}