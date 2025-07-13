import React, { useState, useRef, useEffect } from "react";
import "./OFAiR.css";
import ofairImage from "./OFAiR.png";

export default function OFAiR() {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem("ofairMessages");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const imageRef = useRef(null);
  const popupRef = useRef(null);
  const [isPopup, setIsPopup] = useState(false);

  useEffect(() => {
    localStorage.setItem("ofairMessages", JSON.stringify(messages));
  }, [messages]);

  const openPopup = () => {
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.focus();
      return;
    }

    const width = 400;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      "",
      "OFAiRChatPopup",
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );

    if (!popup) {
      alert("נא לאפשר פופ-אפים בדפדפן.");
      return;
    }

    popup.document.title = "OFAiR Chat - חלון נפרד";

    const style = popup.document.createElement("style");
    style.innerHTML = `
      body { margin: 0; background: #000; color: #0f0; font-family: 'Courier New', monospace; }
      #root { padding: 10px; }
      input, button { font-family: monospace; }
    `;
    popup.document.head.appendChild(style);

    const rootDiv = popup.document.createElement("div");
    rootDiv.id = "root";
    popup.document.body.appendChild(rootDiv);

    import("react-dom").then((ReactDOM) => {
      ReactDOM.createRoot(rootDiv).render(
        <PopupChat
          messages={messages}
          setMessages={setMessages}
          onClose={() => {
            setIsPopup(false);
            if (!popup.closed) popup.close();
          }}
        />
      );
    });

    popupRef.current = popup;
    setIsPopup(true);

    const timer = setInterval(() => {
      if (popup.closed) {
        setIsPopup(false);
        clearInterval(timer);
      }
    }, 500);
  };

  const sendMessage = async (message) => {
    if (!message) return;

    setMessages((prev) => [...prev, { sender: "user", text: message }]);
    setLoading(true);
    imageRef.current?.classList.add("speaking");

    try {
      const response = await fetch("http://localhost:5005/webhooks/rest/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: "user", // אפשר לשנות ל־UUID בעתיד
          message: message,
        }),
      });

      const data = await response.json();
      data.forEach((msg) => {
        if (msg.text) {
          setMessages((prev) => [...prev, { sender: "ofair", text: msg.text }]);
        }
      });
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "ofair", text: ">> Connection to the Matrix failed." },
      ]);
    } finally {
      setLoading(false);
      imageRef.current?.classList.remove("speaking");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const input = inputRef.current.value.trim();
      if (input) {
        sendMessage(input);
        inputRef.current.value = "";
      }
    }
  };

  return (
    <div className="ofair-main-container">
      <div className="ofair-avatar-container">
        <img
          src={ofairImage}
          ref={imageRef}
          alt="OFAiR"
          className={`ofair-image ${loading ? "speaking" : ""}`}
        />
      </div>

      <div className="ofair-chat-container">
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginBottom: 10 }}>
          <button onClick={openPopup} disabled={isPopup} style={{ cursor: "pointer" }}>
            {isPopup ? "חלון נפרד פתוח" : "פתח חלון נפרד"}
          </button>
        </div>

        <div className="terminal">
          {messages.map((msg, idx) => (
            <div key={idx} className={`terminal-line ${msg.sender}`}>
              {msg.sender === "user" ? `» ${msg.text}` : `${msg.text}`}
            </div>
          ))}
          {loading && <div className="terminal-line ofair">{" Thinking..."}</div>}
        </div>

        <input
          ref={inputRef}
          className="terminal-input"
          placeholder="Ask OFAiR how to build your resume..."
          onKeyDown={handleKeyDown}
          disabled={isPopup}
        />
      </div>
    </div>
  );
}

function PopupChat({ messages, setMessages, onClose }) {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const sendMessage = async (message) => {
    if (!message) return;

    setMessages((prev) => [...prev, { sender: "user", text: message }]);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5005/webhooks/rest/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: "user",
          message: message,
        }),
      });

      const data = await response.json();
      data.forEach((msg) => {
        if (msg.text) {
          setMessages((prev) => [...prev, { sender: "ofair", text: msg.text }]);
        }
      });
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "ofair", text: ">> Connection to the Matrix failed." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const input = inputRef.current.value.trim();
      if (input) {
        sendMessage(input);
        inputRef.current.value = "";
      }
    }
  };

  useEffect(() => {
    return () => {
      onClose();
    };
  }, [onClose]);

  return (
    <div
      style={{
        background: "#000",
        color: "#0f0",
        fontFamily: "'Courier New', monospace",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: 10,
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <h3>OFAiR Chat - חלון נפרד</h3>
        <button onClick={onClose} style={{ cursor: "pointer" }}>
          סגור
        </button>
      </div>

      <div
        style={{
          flexGrow: 1,
          overflowY: "auto",
          border: "1px solid #0f0",
          padding: 10,
          borderRadius: 8,
          marginBottom: 10,
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{ margin: "4px 0", color: msg.sender === "user" ? "#00ff66" : "#33ff99" }}
          >
            {msg.sender === "user" ? "» " : "~ "} {msg.text}
          </div>
        ))}
        {loading && <div style={{ color: "#33ff99" }}>{" Thinking..."}</div>}
      </div>

      <input
        ref={inputRef}
        type="text"
        placeholder="כתוב כאן..."
        onKeyDown={handleKeyDown}
        style={{
          width: "100%",
          padding: 8,
          backgroundColor: "#111",
          color: "#00ff66",
          border: "1px solid #00ff66",
          borderRadius: 6,
          fontFamily: "'Courier New', monospace",
        }}
        autoFocus
      />
    </div>
  );
}