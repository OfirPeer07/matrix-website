import React, { useState, useRef, useEffect } from "react";

export default function TerminalWindow({ isPopup = false }) {
  const [messages, setMessages] = useState([{ sender: "ofair", text: "👾 Ready to assist." }]);
  const [input, setInput] = useState("");
  const terminalRef = useRef(null);
  const channel = useRef(null);

  useEffect(() => {
    channel.current = new BroadcastChannel("ofair-terminal-sync");

    channel.current.onmessage = (event) => {
      if (event.data?.type === "new-message") {
        setMessages((prev) => [...prev, event.data.message]);
      }

      if (event.data?.type === "init-history") {
        setMessages(event.data.messages);
      }
    };

    return () => channel.current?.close();
  }, []);

  const sendMessage = (msg) => {
    setMessages((prev) => [...prev, msg]);
    channel.current?.postMessage({ type: "new-message", message: msg });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && input.trim()) {
      const newUserMsg = { sender: "user", text: input.trim() };
      sendMessage(newUserMsg);
      setInput("");
      setTimeout(() => {
        const reply = { sender: "ofair", text: "⚠️ Matrix connection failed." };
        sendMessage(reply);
      }, 600);
    }
  };

  return (
    <div id="terminal-window">
      <div id="terminal-display" ref={terminalRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`line ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <input
        id="terminal-input"
        placeholder="> Run command..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
