import React, { useEffect, useMemo, useRef, useState } from "react";
import "./TroubleshootingGuides.css";

/**
 * DEMO-ONLY Troubleshooting Guides
 * - Frontend-only mock automation runner (no backend)
 * - Steps animation + live metrics that FOLLOW each step's phase
 * - Summary with fake CTAs, null-safe, scroll-unlocked
 */

/* ----------------------- Demo Flows ----------------------- */
const FLOWS = {
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
};

/* ----------------------- Tiny Telemetry (demo) ----------------------- */
const track = (evt, payload = {}) => {
  // console.log("[DEMO track]", evt, payload);
};

/* ----------------------- Utilities ----------------------- */
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const wobble = (prev, target, jitter = 0.25) => {
  const toward = prev + (target - prev) * (0.08 + Math.random() * 0.12);
  const j = (Math.random() - 0.5) * jitter;
  return Math.max(0, toward + j);
};

/* ----------------------- Sparkline (inline SVG) ----------------------- */
function Sparkline({ values = [], width = 240, height = 56, stroke = "#58b2ff" }) {
  const safeVals = values.length ? values : [0];
  const max = Math.max(...safeVals, 1);
  const min = Math.min(...safeVals, 0);
  const range = Math.max(1, max - min);
  const stepX = width / Math.max(1, safeVals.length - 1);

  const points = safeVals.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  });

  return (
    <svg className="tg-spark" viewBox={`0 0 ${width} ${height}`} width="100%" height={height}>
      <polyline fill="none" stroke={stroke} strokeWidth="2" points={points.join(" ")} />
    </svg>
  );
}

/* ----------------------- Mock Metrics Generator -----------------------
   הגרף “רץ” בקצב הסריקה: לכל שלב מוגדרים יעדי latency/cpu שונים.
------------------------------------------------------------------------ */
function useMockMetrics({ running, activeIdx, stepsCount }) {
  const [data, setData] = useState([]);
  const latencyRef = useRef(120);
  const cpuRef = useRef(0.42);
  const loopRef = useRef(null);
  const phaseRef = useRef(-1); // כדי לזהות מעבר שלב

  // יעדים פר שלב – מרגיש מסריקה → שיפור הדרגתי
  const latencyTargets = useMemo(() => {
    // אם יש פחות/יותר שלבים—נחשב מדרגות ליניאריות מ-120 ל-42
    const from = 120, to = 42;
    const n = Math.max(stepsCount, 1);
    return Array.from({ length: n }, (_, i) => Math.round(from + (i * (to - from)) / (n - 1)));
  }, [stepsCount]);

  const cpuTargets = useMemo(() => {
    // מ-45% ל-22%
    const from = 0.45, to = 0.22;
    const n = Math.max(stepsCount, 1);
    return Array.from({ length: n }, (_, i) => from + (i * (to - from)) / (n - 1));
  }, [stepsCount]);

  useEffect(() => {
    // נקודת התחלה נעימה בכל פתיחה
    if (data.length === 0) {
      latencyRef.current = latencyTargets[0] ?? 120;
      cpuRef.current = cpuTargets[0] ?? 0.42;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepsCount]);

  useEffect(() => {
    if (loopRef.current) clearInterval(loopRef.current);

    // כשהשלב מתחלף—קצת “קפיצה” קלה כדי לתת תחושת מעבר
    if (activeIdx !== phaseRef.current) {
      phaseRef.current = activeIdx;
      latencyRef.current = wobble(latencyRef.current, latencyTargets[activeIdx] ?? 60, 1.0);
      cpuRef.current = wobble(cpuRef.current, cpuTargets[activeIdx] ?? 0.3, 0.12);
    }

    const tick = () => {
      const lt = latencyTargets[activeIdx] ?? 60;
      const ct = cpuTargets[activeIdx] ?? 0.3;

      // בזמן ריצה מתקדמים מהר יותר ליעד; בפאוז מתקדמים לאט
      const jitterL = running ? 0.55 : 0.18;
      const jitterC = running ? 0.08 : 0.03;

      latencyRef.current = wobble(latencyRef.current, lt, jitterL);
      cpuRef.current = wobble(cpuRef.current, ct, jitterC);

      setData((prev) => {
        const next = [...prev, { ts: Date.now(), latency: latencyRef.current, cpu: cpuRef.current }];
        return next.slice(-80); // שמור חלון אחרון
      });
    };

    // דגימה מהירה בזמן ריצה, איטית יותר בפאוז — מרגיש כמו “סריקה”
    tick();
    loopRef.current = setInterval(tick, running ? 220 : 420);
    return () => clearInterval(loopRef.current);
  }, [running, activeIdx, stepsCount, latencyTargets, cpuTargets]);

  return data;
}

/* ----------------------- Runner Hook (demo-only) ----------------------- */
function useDemoRunner({ steps, totalDurationSec = 6 }) {
  const [progress, setProgress] = useState(0);     // 0..100
  const [activeIdx, setActiveIdx] = useState(0);   // index of current step
  const [running, setRunning] = useState(false);
  const [startedAt, setStartedAt] = useState(null);
  const [endedAt, setEndedAt] = useState(null);
  const [stepResults, setStepResults] = useState(() =>
    (steps || []).map(() => ({ status: "pending", note: "" }))
  );

  const rafRef = useRef(null);
  const startRef = useRef(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    setStepResults((steps || []).map(() => ({ status: "pending", note: "" })));
    setActiveIdx(0);
    setProgress(0);
  }, [steps]);

  const cancelRAF = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  const markStep = (idx, patch) => {
    setStepResults((prev) => {
      const baseLen = steps?.length || 0;
      const safe = Array.isArray(prev) ? [...prev] : [];
      while (safe.length < baseLen) safe.push({ status: "pending", note: "" });
      if (idx >= 0 && idx < baseLen) safe[idx] = { ...safe[idx], ...patch };
      return safe.slice(0, baseLen);
    });
  };

  const tick = (ts) => {
    const n = steps?.length || 0;
    if (n === 0) {
      setProgress(100);
      setRunning(false);
      setEndedAt(Date.now());
      return;
    }
    if (!startRef.current) startRef.current = ts;

    const elapsed = (ts - startRef.current) / 1000;
    const clamped = clamp(elapsed, 0, totalDurationSec);
    const pct = (clamped / totalDurationSec) * 100;
    if (!pausedRef.current) setProgress(pct);

    const stepDur = totalDurationSec / n;
    const idx = Math.min(n - 1, Math.floor(clamped / stepDur));

    setActiveIdx((prev) => {
      if (idx !== prev) {
        if (prev >= 0 && prev < n) markStep(prev, { status: "done" });
        markStep(idx, { status: "running" });
      } else if (prev === 0 && pct === 0) {
        markStep(0, { status: "running" });
      }
      return idx;
    });

    if (!pausedRef.current && elapsed < totalDurationSec) {
      rafRef.current = requestAnimationFrame(tick);
    } else if (elapsed >= totalDurationSec) {
      markStep(n - 1, { status: "done" });
      setProgress(100);
      setRunning(false);
      setEndedAt(Date.now());
      track("flow_complete", { steps: n, durationSec: totalDurationSec });
    }
  };

  const start = () => {
    if (!steps || steps.length === 0) return;
    track("flow_start", { steps: steps.length });
    setStartedAt(Date.now());
    setEndedAt(null);
    setRunning(true);
    pausedRef.current = false;
    cancelRAF();
    startRef.current = null;
    rafRef.current = requestAnimationFrame(tick);
  };

  const pause = () => {
    if (!running) return;
    pausedRef.current = true;
    setRunning(false);
    cancelRAF();
    track("flow_pause");
  };

  const resume = () => {
    if (running || !steps || steps.length === 0) return;
    pausedRef.current = false;
    setRunning(true);
    rafRef.current = requestAnimationFrame(tick);
    track("flow_resume");
  };

  const reset = () => {
    cancelRAF();
    pausedRef.current = false;
    setRunning(false);
    setProgress(0);
    setActiveIdx(0);
    setStartedAt(null);
    setEndedAt(null);
    setStepResults((steps || []).map(() => ({ status: "pending", note: "" })));
    track("flow_reset");
  };

  useEffect(() => () => cancelRAF(), []);

  return {
    progress,
    activeIdx,
    running,
    start,
    pause,
    resume,
    reset,
    startedAt,
    endedAt,
    stepResults,
  };
}

/* ----------------------- Report (.md) builder ----------------------- */
function downloadMarkdownReport({ topic, steps = [], stepResults = [], startedAt, endedAt }) {
  const start = startedAt ? new Date(startedAt).toISOString() : "-";
  const end = endedAt ? new Date(endedAt).toISOString() : "-";
  const durationSec = startedAt && endedAt ? Math.round((endedAt - startedAt) / 1000) : 0;

  const lines = [];
  lines.push(`# Troubleshooting Report — ${capitalize(topic)}`);
  lines.push(`- **Started:** ${start}`);
  lines.push(`- **Ended:** ${end}`);
  lines.push(`- **Duration:** ${durationSec}s`);
  lines.push("");
  lines.push("## Steps");
  steps.forEach((s, i) => {
    const r = stepResults[i] || { status: "pending", note: "" };
    const emoji = r.status === "done" ? "✅" : r.status === "running" ? "🟡" : "⬜";
    lines.push(`- ${emoji} ${s.text}${r.note ? ` — _${r.note}_` : ""}`);
  });
  lines.push("");
  lines.push("## Notes");
  lines.push("- Demo-only report (mock data).");

  const blob = new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `troubleshooting-${topic}-${Date.now()}.md`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);

  track("cta_click", { cta: "download_md", topic });
}

/* ----------------------- Main Component ----------------------- */
export default function TroubleshootingGuides({ flows = FLOWS }) {
  const [topic, setTopic] = useState(null);

  // FORCE-UNLOCK SCROLL in case the host page locks it
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflowY;
    const prevBody = body.style.overflowY;
    html.style.overflowY = "auto";
    body.style.overflowY = "auto";
    return () => { html.style.overflowY = prevHtml; body.style.overflowY = prevBody; };
  }, []);

  const steps = useMemo(() => (topic ? flows[topic] ?? [] : []), [flows, topic]);

  const runner = useDemoRunner({ steps, totalDurationSec: 6 });
  const {
    progress, activeIdx, running, start, pause, resume, reset, startedAt, endedAt, stepResults,
  } = runner;

  // metrics follow the scanning phase (active step + running state)
  const metrics = useMockMetrics({ running, activeIdx, stepsCount: steps.length });

  useEffect(() => {
    if (topic && steps.length) start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic]);

  const isDone = progress >= 100 - Number.EPSILON;

  return (
    <div className="tg-page" data-theme="dark">
      <header className="tg-hero">
        <h1>🚀 Troubleshooting Guides</h1>
        <p>Scan for problem analysis using automation tools (demo) by category</p>
        <p>Notice: This tool is a DevOps / SecDevOps tool</p>
      </header>

      {/* Cards */}
      <div className="tg-cards" role="list">
        {Object.keys(flows).map((key) => (
          <button
            key={key}
            className={`tg-card ${topic === key ? "is-active" : ""}`}
            role="listitem"
            onClick={() => { setTopic(key); track("guide_select", { topic: key }); }}
          >
            {key === "networking" && "🌐 "}
            {key === "software" && "💻 "}
            {key === "security" && "🔒 "}
            {key === "performance" && "⚙️ "}
            {key === "cloud" && "☁️ "}
            {capitalize(key)}
          </button>
        ))}
      </div>

      {/* Runner + Metrics + Summary */}
      {topic && (
        <>
          <section className="tg-dock" role="region" aria-label="Automation runner">
            <header className="tg-head">
              <div className="tg-title">
                <strong>{capitalize(topic)}</strong>
                <span className="tg-sub" aria-live="polite">
                  {steps[activeIdx]?.text || "Preparing…"}
                </span>
              </div>
              <div className="tg-actions">
                {!isDone ? (
                  running ? (
                    <button className="tg-btn" onClick={pause}>⏸ Pause</button>
                  ) : (
                    <button className="tg-btn" onClick={resume}>▶ Resume</button>
                  )
                ) : (
                  <button className="tg-btn" onClick={() => { reset(); setTimeout(start, 0); }}>↻ Rerun</button>
                )}
                <button className="tg-btn tg-primary" onClick={() => setTopic(null)}>✖ Close</button>
              </div>
            </header>

            {/* Progress */}
            <div
              className="tg-progress"
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div className="tg-progress-bar" style={{ width: `${progress}%` }} />
              <span className="tg-progress-label">{Math.round(progress)}%</span>
            </div>

            {/* Steps */}
            <ol className="tg-steps">
              {(steps || []).map((s, i) => {
                const state = stepResults[i]?.status || (i < activeIdx ? "done" : i === activeIdx ? "running" : "pending");
                return (
                  <li key={i} className={`tg-step is-${state}`}>
                    <span className="tg-bullet" aria-hidden="true">
                      {state === "done" ? "✔" : state === "running" ? "●" : "○"}
                    </span>
                    <span className="tg-icon" aria-hidden="true">{s.icon ?? "•"}</span>
                    <span className="tg-text">{s.text}</span>
                  </li>
                );
              })}
            </ol>
          </section>

          {/* Live Metrics (synced with steps) */}
          <section className="tg-panels">
            <div className="tg-card-panel">
              <div className="tg-card-title">Latency (ms)</div>
              <Sparkline values={(metrics || []).map((d) => Math.round(d.latency))} stroke="#58b2ff" height={64} />
              <div className="tg-meta">
                <span>Now</span>
                <strong>{metrics.length ? Math.round(metrics[metrics.length - 1].latency) : 0} ms</strong>
              </div>
            </div>
            <div className="tg-card-panel">
              <div className="tg-card-title">CPU (%)</div>
              <Sparkline values={(metrics || []).map((d) => Math.round((d.cpu || 0) * 100))} stroke="#34d0a9" height={64} />
              <div className="tg-meta">
                <span>Now</span>
                <strong>{metrics.length ? Math.round((metrics[metrics.length - 1].cpu || 0) * 100) : 0}%</strong>
              </div>
            </div>
          </section>

          {/* Summary (when done) */}
          {isDone && (
            <aside className="tg-summary" role="dialog" aria-modal="true" aria-labelledby="tg-sum-title">
              <header className="tg-summary-head">
                <h3 id="tg-sum-title">Summary — {capitalize(topic)}</h3>
                <button className="tg-icon" onClick={() => setTopic(null)} aria-label="Close summary">✖</button>
              </header>

              <div className="tg-summary-meta">
                <div><span>Started</span><strong>{startedAt ? new Date(startedAt).toLocaleString() : "-"}</strong></div>
                <div><span>Ended</span><strong>{endedAt ? new Date(endedAt).toLocaleString() : "-"}</strong></div>
                <div><span>Duration</span><strong>{startedAt && endedAt ? Math.round((endedAt - startedAt) / 1000) : 0}s</strong></div>
              </div>

              <ul className="tg-summary-list">
                {(steps || []).map((s, i) => {
                  const r = stepResults[i] || { status: "pending" };
                  return (
                    <li key={i} className={`tg-summary-item is-${r.status}`}>
                      <span className="tg-summary-status" aria-hidden="true">
                        {r.status === "done" ? "✅" : r.status === "running" ? "🟡" : "⬜"}
                      </span>
                      <span className="tg-summary-text">{s.text}</span>
                    </li>
                  );
                })}
              </ul>

              <div className="tg-summary-ctas">
                <button className="tg-btn" onClick={() => { track("cta_click", { cta: "open_guide", topic }); toast("Opening guide (demo)"); }}>
                  📘 Open Guide
                </button>
                <button className="tg-btn" onClick={() => downloadMarkdownReport({ topic, steps, stepResults, startedAt, endedAt })}>
                  📄 Generate Report.md
                </button>
                <button className="tg-btn" onClick={() => { track("cta_click", { cta: "post_slack", topic }); toast("Posted to Slack (demo)"); }}>
                  💬 Post to Slack
                </button>
                <button className="tg-btn" onClick={() => { track("cta_click", { cta: "create_ticket", topic }); toast("Jira ticket created (demo)"); }}>
                  🎫 Create Ticket
                </button>
                <button className="tg-btn tg-primary" onClick={() => { track("cta_click", { cta: "open_meet", topic }); toast("Opening Google Meet (demo)"); }}>
                  🎥 Start Meet
                </button>
              </div>
            </aside>
          )}
        </>
      )}

      <footer className="tg-foot">
        <p>Demo-only: shows design & automation feel — no real scanning or external calls.</p>
      </footer>
    </div>
  );
}

/* ----------------------- Helpers ----------------------- */
function capitalize(s = "") { return s.charAt(0).toUpperCase() + s.slice(1); }
function toast(msg) {
  const el = document.createElement("div");
  el.className = "tg-toast";
  el.textContent = msg;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add("show"));
  setTimeout(() => { el.classList.remove("show"); setTimeout(() => el.remove(), 250); }, 1800);
}
