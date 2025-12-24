// OFAiR.jsx
import React, { useRef, useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import "./OFAiR.css";
import ofairImage from "./OFAiR.png";

function Message({ msg }) {
  return (
    <div className={`line ${msg.sender}`} data-message-id={msg.id || ""}>
      {msg.text}
      <span className="timestamp">
        {msg.timestamp
          ? new Date(msg.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : ""}
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

  // Scroll to last line
  useEffect(() => {
    const container = terminalRef.current;
    if (!container) return;
    const last = container.querySelector(".line:last-child");
    if (last) last.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  const submit = useCallback(() => {
    if (!inputValue.trim() || isComposing) return;
    const msg = {
      sender: "user",
      text: inputValue.trim(),
      timestamp: Date.now(),
      id: crypto?.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`,
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
    <div className="ofair-wrapper ofair-relative">
      <div className="computer-container">
        <img src={ofairImage} alt="OFAiR Computer" className="computer-image" />
        <div className="terminal-overlay">
          <div className="terminal-header">OFAiR SYSTEM</div>

          <div
            className="terminal-display terminal-display-frame"
            ref={terminalRef}
            role="log"
            aria-live="polite"
            aria-label="Terminal output"
          >
            {Array.isArray(messages) &&
              messages.map((msg) => (
                <Message
                  key={
                    msg.id || `${msg.sender}-${msg.timestamp || Math.random()}`
                  }
                  msg={msg}
                />
              ))}
          </div>

          <input
            ref={inputRef}
            className="terminal-input"
            placeholder="> Ask something..."
            aria-label="Terminal command input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
          />
        </div>
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