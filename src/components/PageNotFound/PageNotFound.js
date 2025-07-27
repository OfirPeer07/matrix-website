import React, { useRef } from 'react';
import './PageNotFound.css';
import backgroundVideo from './backgroundMatrix.mov';
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

      <div className="tooltip-cyber">Return to safety</div> 
      <div
        ref={avatarRef}
        className="OFAiR clickable-avatar"
        style={{ backgroundImage: `url(${OFAiRImage})` }}
        onClick={handleClick}
        title="Click to return home"
        role="button"
      >
      </div>

      <div className="text">
        <span className="line flickerJunior">Junior submitted</span><br />
        <span className="line flickerCompany">Company committed</span><br />
        <span className="line flickerPage">Page omitted</span><br /><br />
        
        <span className="_4_4">4</span>
        <span className="_0">0</span>
        <span className="_4_4">4</span>

        {/* רווח בין 404 ל־ERROR */}
        <span className="spacer">&nbsp;&nbsp;&nbsp;</span>

        <span className="blink err_r">Err</span>
        <span className="_o">O</span>
        <span className="blink err_r">r</span>
      </div>
    </div>
  );
};

export default PageNotFound;
