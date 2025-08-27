import React, { useState, useEffect } from "react";
import "./TroubleshootingGuides.css";

const flows = {
  networking: [
    { icon: "🌐", text: "Packet Loss Detected" },
    { icon: "⚡", text: "Running Ping Test…" },
    { icon: "🔍", text: "Analyzing Latency…" },
    { icon: "✅", text: "Optimized Route Applied" },
  ],
  software: [
    { icon: "🐞", text: "Bug Report Received" },
    { icon: "🛠", text: "Reproducing Issue…" },
    { icon: "🤖", text: "AI Debugging…" },
    { icon: "✅", text: "Patch Generated & Applied" },
  ],
  security: [
    { icon: "🚨", text: "Threat Detected" },
    { icon: "🔍", text: "Scanning Vulnerabilities…" },
    { icon: "🔐", text: "Patching Security Gap…" },
    { icon: "✅", text: "System Secured" },
  ],
  performance: [
    { icon: "📊", text: "High CPU Usage Detected" },
    { icon: "🧠", text: "Analyzing Workload…" },
    { icon: "🌀", text: "Optimizing Processes…" },
    { icon: "✅", text: "Performance Boosted" },
  ],
  cloud: [
    { icon: "🚀", text: "Deploy Request Received" },
    { icon: "🔄", text: "Spinning Up Containers…" },
    { icon: "🔗", text: "Connecting Services…" },
    { icon: "✅", text: "Deployment Successful" },
  ],
};

const AutomationFlow = ({ topic, onClose }) => {
  const steps = flows[topic];
  const totalDuration = 5.5; // total seconds for full flow
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!steps) return;

    const stepInterval = totalDuration / steps.length;
    let elapsed = 0;

    // step switching
    const stepTimer = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(stepTimer);
        return prev;
      });
    }, stepInterval * 1000);

    // smooth progress animation
    const progressTimer = setInterval(() => {
      elapsed += 0.1;
      setProgress(Math.min((elapsed / totalDuration) * 100, 100));
      if (elapsed >= totalDuration) clearInterval(progressTimer);
    }, 100);

    return () => {
      clearInterval(stepTimer);
      clearInterval(progressTimer);
    };
  }, [steps, totalDuration]);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="automation-overlay" onClick={onClose}>
      <div className="automation-box" onClick={(e) => e.stopPropagation()}>
        <h2>Automation Flow</h2>

        {/* Progress Bar with % */}
        <div className="progress-container">
          <div
            className="progress-bar"
            style={{ width: `${progress}%` }}
          >
            <span className="progress-text">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Steps */}
        <div className="automation-steps">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`automation-step ${
                index <= activeStep ? "active" : ""
              }`}
            >
              <span className="icon">{step.icon}</span>
              <p>{step.text}</p>
              {index < steps.length - 1 && (
                <div
                  className={`arrow ${index < activeStep ? "active" : ""}`}
                ></div>
              )}
            </div>
          ))}
        </div>

        <button className="close-btn" onClick={onClose}>
          ✖ Close
        </button>
      </div>
    </div>
  );
};

const TroubleshootingGuides = () => {
  const [flowTopic, setFlowTopic] = useState(null);

  return (
    <div className="troubleshooting-container">
      <header className="troubleshooting-header">
        <h1>🚀 Troubleshooting Guides</h1>
        <p>Future-ready solutions for high-tech companies</p>
      </header>

      <div className="cards">
        <div className="card" onClick={() => setFlowTopic("networking")}>
          🌐 Networking
        </div>
        <div className="card" onClick={() => setFlowTopic("software")}>
          💻 Software
        </div>
        <div className="card" onClick={() => setFlowTopic("security")}>
          🔒 Security
        </div>
        <div className="card" onClick={() => setFlowTopic("performance")}>
          ⚙️ Performance
        </div>
        <div className="card" onClick={() => setFlowTopic("cloud")}>
          ☁️ Cloud
        </div>
      </div>

      {flowTopic && (
        <AutomationFlow topic={flowTopic} onClose={() => setFlowTopic(null)} />
      )}

      <footer className="troubleshooting-footer">
        <p>
          Built for tech companies who want automation, wisdom & futuristic
          troubleshooting.
        </p>
      </footer>
    </div>
  );
};

export default TroubleshootingGuides;
