// OFAiR.jsx
import React, { useRef, useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import "./OFAiR.css";
import ofairImage from "./OFAiR.png";

function Message({ msg }) {
  return (
    <div
      className={`line ${msg.sender}`}
      data-message-id={msg.id || ""}
      style={{
        // fallback חזק לזיהוי בזמן דיבאג: תוכל להסיר/להחליף אחרי
        color: msg.sender === "user" ? "#7befff" : "#8cff7b",
        background: "rgba(0,0,0,0.1)",
        padding: "2px 6px",
        borderRadius: 4,
        fontSize: 12,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        marginBottom: 4,
        display: "block",
      }}
    >
      {msg.text}
      <span
        style={{
          marginLeft: 6,
          fontSize: 10,
          opacity: 0.6,
          color: "#ccc",
        }}
      >
        {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
      </span>
    </div>
  );
}

Message.propTypes = {
  msg: PropTypes.shape({
    sender: PropTypes.oneOf(["user", "ofair"]).isRequired,
    text: PropTypes.string.isRequired,
    id: PropTypes.string,
    timestamp: PropTypes.number,
  }).isRequired,
};

export default function OFAiR({ messages = [], onSend = () => {} }) {
  const terminalRef = useRef(null);
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  // גלילה חכמה להודעה האחרונה
  useEffect(() => {
    const container = terminalRef.current;
    if (!container) return;
    const last = container.querySelector(".line:last-child");
    if (last) last.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  // debug: להראות מה מגיע ב־props
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log("OFAiR got messages prop:", messages);
  }, [messages]);

  const submit = useCallback(() => {
    if (!inputValue.trim() || isComposing) return;
    const msg = {
      sender: "user",
      text: inputValue.trim(),
      timestamp: Date.now(),
      id: crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    };
    onSend(msg);
    setInputValue("");
  }, [inputValue, isComposing, onSend]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        submit();
      }
    },
    [submit]
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="ofair-wrapper" style={{ position: "relative" }}>
      <div className="computer-container">
        <img src={ofairImage} alt="OFAiR Computer" className="computer-image" />
        <div className="terminal-overlay">
          <div className="terminal-header">OFAiR SYSTEM</div>
          <div
            className="terminal-display"
            ref={terminalRef}
            role="log"
            aria-live="polite"
            aria-label="Terminal output"
            style={{ position: "relative", padding: 8, maxHeight: "100%", overflowY: "auto" }}
          >
            {Array.isArray(messages) && messages.map((msg) => (
              <Message
                key={msg.id || `${msg.sender}-${msg.timestamp || Math.random()}`}
                msg={msg}
              />
            ))}
          </div>
          <input
            ref={inputRef}
            className="terminal-input"
            placeholder="> Run command..."
            aria-label="Terminal command input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            style={{
              width: "100%",
              marginTop: 4,
              background: "#0f101d",
              border: "1px solid #00ffe0",
              padding: "8px 12px",
              borderRadius: 6,
              color: "#fff",
              fontFamily: "monospace",
              fontSize: 14,
              outline: "none",
            }}
          />
        </div>
      </div>
      {/* debug overlay: תוכל להסיר אחרי שתתקן */}
      <div
        style={{
          position: "absolute",
          top: 4,
          right: 4,
          background: "rgba(0,0,0,0.85)",
          color: "#fff",
          padding: 6,
          borderRadius: 6,
          fontSize: 10,
          maxWidth: 220,
          zIndex: 10,
          overflow: "auto",
          maxHeight: 140,
          boxShadow: "0 0 10px rgba(0,255,224,0.6)",
        }}
      >
        <div style={{ marginBottom: 4, fontWeight: "bold" }}>Debug messages:</div>
        <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
          {JSON.stringify(messages, null, 2)}
        </pre>
      </div>
    </div>
  );
}

OFAiR.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      sender: PropTypes.oneOf(["user", "ofair"]).isRequired,
      text: PropTypes.string.isRequired,
      id: PropTypes.string,
      timestamp: PropTypes.number,
    })
  ),
  onSend: PropTypes.func,
};
