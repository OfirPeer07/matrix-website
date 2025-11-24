import React from 'react';
import './NeoToggleButton.css';

const NeoToggleButton = ({ isOpen, toggleNav }) => (
  <button 
    className={`neo-nav-btn ${isOpen ? 'open' : ''}`} 
    onClick={toggleNav}
    aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
    aria-expanded={isOpen}
  >
    <span></span>
    <span></span>
    <span></span>
  </button>
);

export default NeoToggleButton;