import React, { useEffect, useState } from 'react';
import './Hacking.css';
import ofairImage from './OFAiR.png';
import fight from './Fight.mp4';
import agentSmith from './Agent-smith-dodges-bullets.mp4';
import neo from './Neo-dodges-bullets.mp4';

function Hacking() {
  const [rectanglesVisible] = useState(true); // Rectangle visibility

  useEffect(() => {
    const canvas = document.getElementById('matrix');
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const fontSize = 16;
    const katakana =
      'アカサタナハマヤラワガザダバパイキシチニヒミリギジヂビピウクスツヌフムユルグズヅブプエケセテネヘメレゲゼデベペオコソトノホモヨロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const letters = katakana.split('');
    let columns = Math.floor(canvas.width / fontSize);
    let drops = Array(columns).fill(1);

    const resizeCanvas = () => {
      const newColumns = Math.floor(window.innerWidth / fontSize);
      if (newColumns !== columns) {
        columns = newColumns;
        drops = Array(columns).fill(1);
      }
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    let resizeTimeout = null;
    const debounceResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizeCanvas, 100);
    };

    resizeCanvas();
    window.addEventListener('resize', debounceResize);

    const drawMatrix = () => {
      context.fillStyle = 'rgba(0, 0, 0, 0.05)';
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.fillStyle = '#0F0';
      context.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        context.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };

    const interval = setInterval(drawMatrix, 33);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', debounceResize);
    };
  }, []);

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  return (
    <div className="app-container">
      <canvas id="matrix" />

      <div
        className="ofair"
        style={{ backgroundImage: `url(${ofairImage})` }}
        onClick={() => handleNavigation('/neo/hacking/build-your-resume')}
      />

      {rectanglesVisible && (
        <>
          <div className="rectangle first" onClick={() => handleNavigation('/neo/hacking/articles')}>
            <video className="background-video" autoPlay loop muted playsInline>
              <source src={agentSmith} type="video/mp4" />
            </video>
            <div className="hackingTitle">Articles</div>
          </div>
          <div className="rectangle second" onClick={() => handleNavigation('/neo/hacking/guides')}>
            <video className="background-video" autoPlay loop muted playsInline>
              <source src={neo} type="video/mp4" />
            </video>
            <div className="hackingTitle">Guides</div>
          </div>
          <div className="rectangle third" onClick={() => handleNavigation('/neo/hacking/videos')}>
            <video className="background-video" autoPlay loop muted playsInline>
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
