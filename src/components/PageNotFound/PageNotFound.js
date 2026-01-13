import React, { useRef, useCallback } from 'react';
import './PageNotFound.css';
import OFAiRImage from './OFAiR.png';

const PageNotFound = () => {
  const avatarRef = useRef(null);

  const goHome = useCallback(() => {
    if (avatarRef.current) {
      avatarRef.current.classList.add('blink-out');
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    } else {
      window.location.href = '/';
    }
  }, []);

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      goHome();
    }
  };

  return (
    <div className="page-not-found-container" role="main" aria-labelledby="pnf-heading">
      {/* OFAiR Avatar + Tooltip */}
      <div
        ref={avatarRef}
        className="OFAiR clickable-avatar"
        style={{ backgroundImage: `url(${OFAiRImage})` }}
        onClick={goHome}
        onKeyDown={onKeyDown}
        role="button"
        tabIndex={0}
        aria-label="Go back to the homepage"
      >
        <div className="tooltip-homepage" role="tooltip" id="home-tip">
          Return to safety
        </div>
      </div>

      <div className="text text-back">
        <span className="line flickerJunior">JUNIOR&nbsp;&nbsp;&nbsp;submitted</span><br />
        <span className="line flickerCompany">COMPANY&nbsp;&nbsp;&nbsp;committed</span><br />
        <span className="line flickerPage">PAGE&nbsp;&nbsp;&nbsp;omitted</span><br /><br />

        <span className="_4_4">4</span>
        <span className="_0">0</span>
        <span className="_4_4">4</span>

        <span className="spacer" aria-hidden="true">&nbsp;&nbsp;&nbsp;</span>

        <span className="blink err_r">Err</span>
        <span className="_0">0</span>
        <span className="blink err_r">r</span>
      </div>

      <div className="text text-front" aria-hidden="true">
        <span className="line flickerJunior">JUNIOR&nbsp;&nbsp;&nbsp;submitted</span><br />
        <span className="line flickerCompany">COMPANY&nbsp;&nbsp;&nbsp;committed</span><br />
        <span className="line flickerPage">PAGE&nbsp;&nbsp;&nbsp;omitted</span><br /><br />

        <span className="_4_4">4</span>
        <span className="_0">0</span>
        <span className="_4_4">4</span>

        <span className="spacer" aria-hidden="true">&nbsp;&nbsp;&nbsp;</span>

        <span className="blink err_r">Err</span>
        <span className="_0">0</span>
        <span className="blink err_r">r</span>
      </div>
    </div>
  );
};

export default PageNotFound;
