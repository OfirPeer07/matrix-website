import React from "react";
import "./Videos.css";

const Videos = () => {
  return (
    <div className="matrix-video-container">
      <div className="matrix-frame">
        <div className="matrix-screen">
          <div className="matrix-text">
            SYSTEM ALERT: DEMO MODE<br />
            This construct is a limited preview.
            <br />
            For full access, visit:<br />
            <a href="https://iez-computers.com/" target="_blank" rel="noopener noreferrer">
              iez-computers.com
            </a>
          </div>
        </div>
        <div className="matrix-controls">
          <span className="matrix-button">&#9658;</span>
          <div className="matrix-bar">
            <div className="matrix-fill"></div>
          </div>
          <span className="matrix-status">DEMO</span>
        </div>
      </div>
    </div>
  );
};

export default Videos;
