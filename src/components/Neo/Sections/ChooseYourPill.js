import React from 'react';
import '../../../styles/Sections.css';
import '../../../styles/Neo/NeoSections.css';
import './ChooseYourPill.css';

import pillImage from './ChooseYourPill.png';

const ChooseYourPill = ({ onSelect }) => {
  return (
    <div className="choose-your-pill-container">
      <div className="pill-image-wrapper">
        <div className="half left" onClick={() => onSelect('red')} />
        <div className="half right" onClick={() => onSelect('blue')} />
        <img src={pillImage} alt="Choose your pill" className="full-image" />
      </div>
    </div>
  );
};

export const PillMessage = ({ selected }) => {
  if (!selected) return null;

  return (
    <div className='pill-box'>
      <div className={`pill-info ${selected}`} dir="rtl">
        <h2>{selected === 'red' ? 'הכדור האדום' : 'הכדור הכחול'}</h2>
        <p>
          {selected === 'red'
            ? 'אתה בוחר לדעת את האמת, גם אם היא כואבת. המסע מתחיל עכשיו.'
            : 'אתה בוחר להישאר במערכת, במקום בטוח. הכול יישאר כמות שהוא.'}
        </p>
      </div>
    </div>
  );
};

export default ChooseYourPill;
