// TerminalWindow.jsx
import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";

// עוזר לפורמט תאריכים (Today / Yesterday / מרחיב)
const formatDateSeparator = (ts) => {
  const d = new Date(ts);
  const now = new Date();
  const isToday =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    d.getFullYear() === yesterday.getFullYear() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getDate() === yesterday.getDate();

  const options = { month: "long", day: "numeric", year: "numeric" };
  if (isToday) return `Today, ${d.toLocaleDateString(undefined, options)}`;
  if (isYesterday) return `Yesterday, ${d.toLocaleDateString(undefined, options)}`;
  return d.toLocaleDateString(undefined, { weekday: "long", ...options });
};

const formatTime = (ts) => {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const MessageLine = React.memo(function MessageLine({ msg }) {
  return (
    <div className={`line ${msg.sender}`}>
      <div className="bubble-content">
        <div className="text">{msg.text}</div>
        <div className="meta">
          <div className="time">{formatTime(msg.timestamp)}</div>
          {msg.sender === "user" && (
            <div className="status">
              {msg.delivered ? (
                <svg width="14" height="14" viewBox="0 0 24 24" aria-label="Delivered">
                  <path
                    fill="currentColor"
                    d="M9 16.2l-3.5-3.5 1.4-1.4L9 13.4l7.1-7.1 1.4 1.4z"
                  />
                </svg>
              ) : (
                <div className="pending-dot" aria-label="Sending" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

MessageLine.propTypes = {
  msg: PropTypes.shape({
    sender: PropTypes.oneOf(["user", "ofair"]).isRequired,
    text: PropTypes.string.isRequired,
    id: PropTypes.string,
    timestamp: PropTypes.number.isRequired,
    delivered: PropTypes.bool,
  }).isRequired,
};

export default function TerminalWindow({
  isPopup = false,
  messages = [],
  onSend = () => {},
}) {
  const displayRef = useRef(null);
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [internalMessages, setInternalMessages] = useState(messages);

  // סנכרון חיצוני כשלא popup
  useEffect(() => {
    if (!isPopup) {
      setInternalMessages(messages);
    }
  }, [messages, isPopup]);

  // BroadcastChannel only in popup
  useEffect(() => {
    if (!isPopup) return;
    const channel = new BroadcastChannel("ofair-terminal-sync");

    channel.onmessage = ({ data }) => {
      if (data.type === "new-message" && data.message) {
        setInternalMessages((prev) => {
          if (prev.some((m) => m.id === data.message.id)) return prev;
          return [...prev, data.message];
        });
      } else if (data.type === "sync-history" && Array.isArray(data.history)) {
        setInternalMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const merged = [...prev];
          data.history.forEach((m) => {
            if (!existingIds.has(m.id)) merged.push(m);
          });
          return merged;
        });
      }
    };

    // בקשת סנכרון ראשונית
    channel.postMessage({ type: "request-sync" });

    return () => {
      channel.close();
    };
  }, [isPopup]);

  // גלילה חכמה להודעה האחרונה
  useEffect(() => {
    const container = displayRef.current;
    if (!container) return;
    const last = container.querySelector(".line:last-child");
    if (last) {
      last.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [internalMessages]);

  const sendUserMessage = useCallback(
    (text) => {
      const msg = {
        sender: "user",
        text,
        timestamp: Date.now(),
        id: crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
        delivered: true,
      };
      setInternalMessages((prev) => [...prev, msg]);
      onSend(msg);
    },
    [onSend]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key !== "Enter" || isComposing) return;
      if (!inputValue.trim()) return;
      sendUserMessage(inputValue.trim());
      setInputValue("");
    },
    [inputValue, isComposing, sendUserMessage]
  );

  const handleChange = useCallback((e) => {
    setInputValue(e.target.value);
  }, []);

  const handleCompositionStart = useCallback(() => {
    setIsComposing(true);
  }, []);

  const handleCompositionEnd = useCallback(() => {
    setIsComposing(false);
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // יוצר מבנה קבוצות עם מפריד תאריך וקיבוץ לפי שולח
  const grouped = useMemo(() => {
    if (!internalMessages.length) return [];
    const result = [];
    let lastDate = null;
    let lastSender = null;
    internalMessages.forEach((msg) => {
      const msgDate = new Date(msg.timestamp);
      const dayKey = `${msgDate.getFullYear()}-${msgDate.getMonth()}-${msgDate.getDate()}`;
      if (dayKey !== lastDate) {
        result.push({ type: "date-sep", timestamp: msg.timestamp, key: `date-${dayKey}` });
        lastDate = dayKey;
        lastSender = null;
      }
      const isSameSender = msg.sender === lastSender;
      if (!isSameSender) {
        // start new group
        result.push({ type: "message", msg, showTimestamp: true, key: msg.id });
      } else {
        result.push({ type: "message", msg, showTimestamp: true, key: msg.id });
      }
      lastSender = msg.sender;
    });
    return result;
  }, [internalMessages]);

  return (
    <div id="terminal-window" className="chat-style-terminal">
      <div id="terminal-display" ref={displayRef} role="log" aria-live="polite" aria-label="Terminal chat output">
        {grouped.map((item, idx) => {
          if (item.type === "date-sep") {
            return (
              <div className="date-separator" key={item.key || `ds-${idx}`}>
                <span>{formatDateSeparator(item.timestamp)}</span>
              </div>
            );
          } else if (item.type === "message") {
            return (
              <MessageLine
                key={item.key}
                msg={item.msg}
              />
            );
          }
          return null;
        })}
      </div>
      <div className="input-wrapper">
        <input
          id="terminal-input"
          ref={inputRef}
          placeholder="Type a message..."
          aria-label="Chat input"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
        />
      </div>
    </div>
  );
}

TerminalWindow.propTypes = {
  isPopup: PropTypes.bool,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      sender: PropTypes.oneOf(["user", "ofair"]).isRequired,
      text: PropTypes.string.isRequired,
      id: PropTypes.string,
      timestamp: PropTypes.number,
      delivered: PropTypes.bool,
    })
  ),
  onSend: PropTypes.func,
};
