import React, { useState, useRef, useEffect } from "react";
import "./OFAiR.css";
import ofairImage from "./OFAiR.png"; // שם התמונה שלך

export default function OFAiR() {
  const [messages, setMessages] = useState([
    { sender: "ofair", text: "👾 Ready to assist." }
  ]);
  const [input, setInput] = useState("");
  const terminalRef = useRef(null);

  useEffect(() => {
    terminalRef.current?.scrollTo(0, terminalRef.current.scrollHeight);
  }, [messages]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && input.trim()) {
      const newMessage = { sender: "user", text: input.trim() };
      setMessages((prev) => [...prev, newMessage]);
      setInput("");
      setTimeout(() => {
        setMessages((prev) => [...prev, { sender: "ofair", text: "⚠️ Matrix connection failed." }]);
      }, 600);
    }
  };

  return (
    <div className="ofair-wrapper">
      <div className="computer-container">
        <img src={ofairImage} alt="OFAiR Computer" className="computer-image" />

        <div className="terminal-overlay">
          <div className="terminal-header">OFAiR SYSTEM</div>
          <div className="terminal-display" ref={terminalRef}>
            {messages.map((msg, i) => (
              <div key={i} className={`line ${msg.sender}`}>
                {msg.sender === "user" ? "» " : "~ "} {msg.text}
              </div>
            ))}
          </div>
          <input
            className="terminal-input"
            placeholder="> run command..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
    </div>
  );
}
