import React from 'react';
import { Link } from 'react-router-dom';

export function MobileMenu({ isMobile, activeMenu, isClosing, onClose }) {
  if (!isMobile || !activeMenu) return null;

  const isHacking = activeMenu === 'neoIcon';

  return (
    <div className={`mobile-dropdown-menu ${isClosing ? 'closing' : ''}`}>
      <div className="swipe-indicator"></div>
      <button className="close-menu-btn" onClick={onClose} aria-label="סגור תפריט">✕</button>
      {isHacking ? (
        <>
          <Link to="/neo/hacking/guides" onClick={onClose}>מדריכי סייבר</Link>
          <Link to="/neo/hacking/articles" onClick={onClose}>מאמרי סייבר</Link>
          <Link to="/neo/hacking/videos" onClick={onClose}>סרטוני סייבר</Link>
        </>
      ) : (
        <>
          <Link to="/" onClick={onClose}>דף ראשי</Link>
          <Link to="/neo/works-with" onClick={onClose}>ספקים וחברות</Link>
          <Link to="/thanks" onClick={onClose}>תודות</Link>
          <Link to="/contact-us" onClick={onClose}>צור קשר</Link>
        </>
      )}
    </div>
  );
}
