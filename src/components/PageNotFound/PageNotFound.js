import React, { useRef } from 'react';
import './PageNotFound.css';
import backgroundVideo from './backgroundMatrix.mp4';
import OFAiRImage from './OFAiR.png';

const PageNotFound = () => {
  const avatarRef = useRef();

  const handleClick = () => {
    if (avatarRef.current) {
      avatarRef.current.classList.add('blink-out');
      setTimeout(() => {
        window.location.href = '/';
      }, 600);
    }
  };

  return (
    <div className="page-not-found-container">

      <video
        className="background-video"
        src={backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* OFAiR Avatar + Tooltip */}
      <div
        ref={avatarRef}
        className="OFAiR clickable-avatar"
        style={{ backgroundImage: `url(${OFAiRImage})` }}
        onClick={handleClick}
        role="button"
        aria-label="Click to return to homepage"
      >
        <div className="tooltip-homepage">Return to safety</div>
      </div>

      {/* Text & 404 */}
      <div className="text">
        <span className="line flickerJunior">JUNIOR&nbsp;&nbsp;&nbsp;submitted</span><br />
        <span className="line flickerCompany">COMPANY&nbsp;&nbsp;&nbsp;committed</span><br />
        <span className="line flickerPage">PAGE&nbsp;&nbsp;&nbsp;omitted</span><br /><br />

        <span className="_4_4">4</span>
        <span className="_0">0</span>
        <span className="_4_4">4</span>

        <span className="spacer">&nbsp;&nbsp;&nbsp;</span>

        <span className="blink err_r">Err</span>
        <span className="_0">0</span>
        <span className="blink err_r">r</span>
      </div>
      <div className="text-two">
        <span className="line flickerJunior">JUNIOR&nbsp;&nbsp;&nbsp;submitted</span><br />
        <span className="line flickerCompany">COMPANY&nbsp;&nbsp;&nbsp;committed</span><br />
        <span className="line flickerPage">PAGE&nbsp;&nbsp;&nbsp;omitted</span><br /><br />

        <span className="_4_4">4</span>
        <span className="_0">0</span>
        <span className="_4_4">4</span>

        <span className="spacer">&nbsp;&nbsp;&nbsp;</span>

        <span className="blink err_r">Err</span>
        <span className="_0">0</span>
        <span className="blink err_r">r</span>
      </div>
    </div>

  );
};

export default PageNotFound;
