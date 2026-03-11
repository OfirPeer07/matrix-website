import React, { useEffect, useRef, useState, useCallback } from "react";
import { useLocaleContext } from "../../../context/LocaleContext";
import "./Videos.css";

import vidHacker from "./OLLAMA_Happy_Smoking.mp4";

// ─── Translations ────────────────────────────────────────────────────────────
const translations = {
  en: {
    dir: "ltr",
    boot: [
      "$ nmap -sV -T4 10.45.2.118",
      "[ INFO ] Scanning target: 10.45.2.118 (8 ports open)",
      "[ OK ] Service found: Apache/2.4.41 (Ubuntu) on Port 80",
      "[ INFO ] Searching for known vulnerabilities... [CVE-2021-41773]",
      "$ use exploit/multi/http/apache_normalize_path",
      "$ set RHOSTS 10.45.2.118",
      "$ run",
      "[ EXPLOIT ] Sending malicious payload...",
      "[ WAIT ] Waiting for reverse shell on 4444...",
      "[ SUCCESS ] Command shell session 1 opened (10.0.0.1:4444 -> 10.45.2.118:48212)",
      "$ whoami",
      "www-data",
      "$ sudo -l",
      "(ALL : ALL) NOPASSWD: /usr/bin/python3",
      "$ sudo python3 -c 'import os; os.setuid(0); os.system(\"/bin/bash\")'",
      "[ SUCCESS ] Privilege escalation successful. UID: 0 (root)",
      "[ PROGRESS ] Exfiltrating secure data: [##########----------] 50%",
      "[ PROGRESS ] Exfiltrating secure data: [####################] 100%",
      "> SYSTEM COMPROMISED. DATA STREAM ACTIVE."
    ],
    heroTitle: "ROOT",
    heroAccent: "ACCESS",
    heroSub: "Encrypted data exfiltration. Unauthorized presence is actively tracked.",
    videoTitle: "OPERATION: ZERO-DAY",
    videoSub: "TARGET ACQUIRED // AES-256 ENCRYPTION // C2 LINK ACTIVE",
    statusLive: "UPLINK ACTIVE",
    statusLabel: "TRACE STATUS"
  },
  he: {
    dir: "ltr",
    boot: [
      "$ nmap -sV -T4 10.45.2.118",
      "[INFO] סורק מטרה: 10.45.2.118 (8 פורטים פתוחים)",
      "[OK] שירות נמצא: Apache/2.4.41 (Ubuntu) בפורט 80",
      "[INFO] מחפש פרצות אבטחה ידועות... [CVE-2021-41773]",
      "$ use exploit/multi/http/apache_normalize_path",
      "$ set RHOSTS 10.45.2.118",
      "$ run",
      "[EXPLOIT] שולח מטען זדוני...",
      "[WAIT] ממתין לחיבור הפוך (Reverse Shell) בפורט 4444...",
      "[SUCCESS] סשן פקודה 1 נפתח (10.0.0.1:4444 -> 10.45.2.118:48212)",
      "$ whoami",
      "www-data",
      "$ sudo -l",
      "(ALL : ALL) NOPASSWD: /usr/bin/python3",
      "$ sudo python3 -c 'import os; os.setuid(0); os.system(\"/bin/bash\")'",
      "[SUCCESS] העלאת הרשאות הצליחה. UID: 0 (root)",
      "[PROGRESS] מוציא נתונים מאובטחים: [##########----------] 50%",
      "[PROGRESS] מוציא נתונים מאובטחים: [####################] 100%",
      "> המערכת נפרצה. הזרמת נתונים פעילה."
    ],
    heroTitle: "ROOT",
    heroAccent: "גישה",
    heroSub: ".זליגת נתונים מוצפנת. נוכחות לא מורשית מתועדת בזמן אמת",
    videoTitle: "מבצע: ZERO-DAY",
    videoSub: "מטרה ננעלה // הצפנת \u202AAES-256\u202C // ערוץ \u202AC2\u202C פעיל",
    statusLive: "ערוץ תקשורת פעיל",
    statusLabel: "סטטוס מעקב"
  }
};

// ─── Boot Sequence (Realistic typing speed) ──────────────────────────────────
function BootScreen({ lines, onDone }) {
  const [displayed, setDisplayed] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (currentLine >= lines.length) {
      const t = setTimeout(() => { setDone(true); setTimeout(onDone, 700); }, 1000);
      return () => clearTimeout(t);
    }

    const line = lines[currentLine];

    if (currentChar < line.length) {
      // Logic for typing speed based on content
      const isCommand = line.startsWith("$");
      const isStatus = line.startsWith("[");
      const isBurst = isStatus && Math.random() > 0.4; // Real statuses appear in bursts

      const delay = isCommand
        ? (Math.random() * 80 + 50) // Commands look like human typing
        : (isBurst ? 5 : Math.random() * 30 + 10); // Outputs are fast

      const isProcessingWait = (line.includes("WAIT") || line.includes("EXPLOIT") || line.includes("Scanning")) && currentChar === 10;
      const finalDelay = isProcessingWait ? 1200 : delay;

      const t = setTimeout(() => {
        setDisplayed(prev => {
          const next = [...prev];
          next[currentLine] = (next[currentLine] || "") + line[currentChar];
          return next;
        });
        setCurrentChar(c => c + 1);
      }, finalDelay);
      return () => clearTimeout(t);
    } else {
      const isCommand = line.startsWith("$");
      const nextDelay = isCommand ? 600 : 200; // Pause after entering a command

      const t = setTimeout(() => {
        setCurrentLine(l => l + 1);
        setCurrentChar(0);
      }, nextDelay);
      return () => clearTimeout(t);
    }
  }, [currentLine, currentChar, lines, onDone]);

  const getLineClass = (l) => {
    if (l.includes("SUCCESS") || l.includes("הצליחה") || l.includes("root") || l.startsWith(">")) return "vids-boot__line--success";
    if (l.includes("[ OK ]") || l.includes("[OK]")) return "vids-boot__line--ok";
    if (l.includes("[ EXPLOIT ]") || l.includes("[EXPLOIT]")) return "vids-boot__line--exploit";
    if (l.includes("[ WAIT ]") || l.includes("[WAIT]")) return "vids-boot__line--wait";
    if (l.includes("[ INFO ]") || l.includes("[INFO]")) return "vids-boot__line--info";
    if (l.includes("[ PROGRESS ]") || l.includes("[PROGRESS]")) return "vids-boot__line--progress";
    if (l.startsWith("$")) return "vids-boot__line--command";
    return "";
  };

  return (
    <div
      className={`vids-boot ${done ? "vids-boot--exit" : ""}`}
      aria-live="polite"
      onClick={() => {
        if (!done) {
          setDone(true);
          onDone();
        }
      }}
      style={{ cursor: "pointer" }}
    >
      {/* Terminal window chrome */}
      <div className="vids-boot__window">
        {/* Title bar */}
        <div className="vids-boot__titlebar">
          <div className="vids-boot__trafficlights" aria-hidden>
            <span className="vids-boot__dot vids-boot__dot--close" />
            <span className="vids-boot__dot vids-boot__dot--min" />
            <span className="vids-boot__dot vids-boot__dot--max" />
          </div>
          <span className="vids-boot__title">bash — 80×24</span>
          <span className="vids-boot__host" aria-hidden>root@c2-server</span>
        </div>

        {/* Terminal body */}
        <div className="vids-boot__inner">
          {/* Shell prompt header */}
          <div className="vids-boot__prompt-header" aria-hidden>
            <span className="vids-boot__prompt-user">root</span>
            <span className="vids-boot__prompt-at">@</span>
            <span className="vids-boot__prompt-host">c2-server</span>
            <span className="vids-boot__prompt-dir">:~/exploit</span>
            <span className="vids-boot__prompt-dollar">$</span>
            <span style={{ color: "#a8ffb8", fontSize: "0.88rem" }}>./run_payload.sh</span>
          </div>

          {displayed.map((l, i) => (
            <p
              key={i}
              dir="auto"
              className={`vids-boot__line ${getLineClass(l)}`}
            >
              {l}
            </p>
          ))}
          {!done && <span className="vids-boot__cursor" aria-hidden>█</span>}

          <span className="vids-boot__skip">click to skip</span>
        </div>
      </div>
    </div>
  );
}

// ─── Custom Video Player ──────────────────────────────────────────────────────
function formatTimeWithMs(s) {
  if (!isFinite(s)) return "00:00:000";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  const ms = Math.floor((s % 1) * 1000);
  return `0${m}:${sec.toString().padStart(2, "0")}:${ms.toString().padStart(3, "0")}`;
}

function VideoPlayer({ t }) {
  const videoRef = useRef(null);
  const seekRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [glitching, setGlitching] = useState(false);

  const [hexCode, setHexCode] = useState("0x000000");
  const [latency, setLatency] = useState(14);
  const [packetLoss, setPacketLoss] = useState(0.01);
  const [bandwidth, setBandwidth] = useState(1045);
  const playerRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 150 + Math.random() * 200);
    }, 5000 + Math.random() * 7000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setHexCode("0x" + Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padStart(6, '0'));
      setLatency(prev => Math.max(8, Math.min(35, prev + (Math.random() * 4 - 2))));
      setPacketLoss(prev => Math.max(0, Math.min(0.5, prev + (Math.random() * 0.04 - 0.02))));
      setBandwidth(prev => Math.max(800, Math.min(2500, prev + (Math.random() * 200 - 100))));
    }, 120);
    return () => clearInterval(interval);
  }, [playing]);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = playerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().then(() => setFullscreen(true)).catch(() => { });
    } else {
      document.exitFullscreen().then(() => setFullscreen(false)).catch(() => { });
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      }
      if (e.code === 'KeyM') toggleMute();
      if (e.code === 'KeyF') toggleFullscreen();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, toggleMute, toggleFullscreen]);

  const onTimeUpdate = useCallback(() => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setCurrentTime(v.currentTime);
    setProgress((v.currentTime / v.duration) * 100);
  }, []);

  const onLoadedMetadata = useCallback(() => {
    setDuration(videoRef.current?.duration || 0);
  }, []);

  const seek = useCallback((e) => {
    const v = videoRef.current;
    const bar = seekRef.current;
    if (!v || !bar) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    v.currentTime = ratio * v.duration;
  }, []);

  return (
    <div ref={playerRef} className={`vids-player ${glitching ? "vids-player--glitch" : ""}`}>
      <div className="vids-scanlines" aria-hidden />
      <div className="vids-hud-network" aria-hidden>
        <div>MEM: {hexCode}</div>
        <div>LATENCY: {latency.toFixed(1)}ms</div>
        <div>PKT LOSS: {packetLoss.toFixed(2)}%</div>
        <div>RX: {Math.round(bandwidth)} kbps</div>
      </div>

      <span className="vids-corner vids-corner--tl" aria-hidden />
      <span className="vids-corner vids-corner--tr" aria-hidden />
      <span className="vids-corner vids-corner--bl" aria-hidden />
      <span className="vids-corner vids-corner--br" aria-hidden />

      <video
        ref={videoRef}
        src={vidHacker}
        className="vids-player__video"
        muted
        playsInline
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={() => setPlaying(false)}
        onClick={togglePlay}
      />

      <div className="vids-hud-top" aria-hidden>
        <span className="vids-hud-label">[{t.videoTitle}]</span>
        <span className="vids-hud-sub">{t.videoSub}</span>
        <span className={`vids-status-dot ${playing ? "active" : ""}`} />
      </div>

      <div className="vids-controls">
        <button className="vids-ctrl-btn" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
          {playing ? "[ PAUSE ]" : "[ PLAY ]"}
        </button>

        <span className="vids-time">{formatTimeWithMs(currentTime)}</span>

        <div
          ref={seekRef}
          className="vids-seek"
          role="slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          onClick={seek}
        >
          <div className="vids-seek__fill" style={{ width: `${progress}%` }} />
          <div className="vids-seek__thumb" style={{ left: `${progress}%` }} />
        </div>

        <button className="vids-ctrl-btn" onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"}>
          {muted ? "[ MUTED ]" : "[ AUDIO ]"}
        </button>

        <button className="vids-ctrl-btn" onClick={toggleFullscreen} aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}>
          {fullscreen ? "[ EXIT ]" : "[ FULL ]"}
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const Videos = () => {
  const { locale } = useLocaleContext();
  const t = translations[locale] || translations.en;
  const [booted, setBooted] = useState(false);

  return (
    <div className="vids-page" dir={t.dir}>
      {!booted && (
        <BootScreen lines={t.boot} onDone={() => setBooted(true)} />
      )}

      <div className={`vids-content ${booted ? "vids-content--visible" : ""}`}>
        <section className="vids-hero">
          <div className="vids-hero__copy" dir={t.dir}>
            <h1 className="vids-hero__title">
              {t.heroTitle} <span className="vids-hero__accent">{t.heroAccent}</span>
            </h1>
            <p className="vids-hero__sub">{t.heroSub}</p>
          </div>
          <div className="vids-hero__decoration" aria-hidden>
            <div className="vids-matrix-rain" />
          </div>
        </section>

        <section className="vids-stage" aria-label={t.videoTitle}>
          <VideoPlayer t={t} />
        </section>
      </div>
    </div>
  );
};

export default Videos;