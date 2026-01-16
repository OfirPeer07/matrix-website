import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Hacking.css";

import ofairImage from "./OFAiR.png";
import fight from "./Fight.mp4";
import agentSmith from "./Agent-smith-dodges-bullets.mp4";
import neo from "./Neo-dodges-bullets.mp4";

function Hacking() {
  const navigate = useNavigate();
  const [rectanglesVisible] = useState(true);

  useEffect(() => {
    const canvas = document.getElementById("matrix");
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const fontSize = 16;
    const katakana =
      "アイウエオカキクケコサシスセソタチツテトナニヌネノ" +
      "ハヒフヘホマヤユヨラリルレロワヲン0123456789";
    const letters = katakana.split("");

    let columns = Math.floor(window.innerWidth / fontSize);
    let drops = Array(columns).fill(1);

    const resizeCanvas = () => {
      columns = Math.floor(window.innerWidth / fontSize);
      drops = Array(columns).fill(1);
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const draw = () => {
      context.fillStyle = "rgba(0, 0, 0, 0.05)";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#0F0";
      context.font = `${fontSize}px monospace`;

      drops.forEach((y, i) => {
        const text = letters[Math.floor(Math.random() * letters.length)];
        context.fillText(text, i * fontSize, y * fontSize);
        drops[i] = y * fontSize > canvas.height && Math.random() > 0.975 ? 0 : y + 1;
      });
    };

    const interval = setInterval(draw, 33);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div className="app-container">
      <canvas id="matrix" />

      <div
        className="ofair"
        style={{ backgroundImage: `url(${ofairImage})` }}
        onClick={() => navigate("/neo/hacking/build-your-resume")}
      />

      {rectanglesVisible && (
        <>
          <div className="rectangle first" onClick={() => navigate("/neo/hacking/articles")}>
            <video autoPlay loop muted playsInline className="background-video">
              <source src={agentSmith} type="video/mp4" />
            </video>
            <div className="hackingTitle">Articles</div>
          </div>

          <div className="rectangle second" onClick={() => navigate("/neo/hacking/guides")}>
            <video autoPlay loop muted playsInline className="background-video">
              <source src={neo} type="video/mp4" />
            </video>
            <div className="hackingTitle">Guides</div>
          </div>

          <div className="rectangle third" onClick={() => navigate("/neo/hacking/videos")}>
            <video autoPlay loop muted playsInline className="background-video">
              <source src={fight} type="video/mp4" />
            </video>
            <div className="hackingTitle">Videos</div>
          </div>
        </>
      )}
    </div>
  );
}

export default Hacking;
