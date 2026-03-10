import React, { useRef, useCallback } from 'react';
import './PageNotFound.css';
import OFAiRImage from './OFAiR.png';
import { useLocaleContext } from '../../context/LocaleContext';

const translations = {
  en: {
    backToSafety: "Return to safety",
    juniorSubmitted: "JUNIOR   submitted",
    companyCommitted: "COMPANY   committed",
    pageOmitted: "PAGE   omitted",
    error: "Err0r",
    ariaLabel: "Go back to the homepage",
  },
  he: {
    backToSafety: "חזרה לחוף מבטחים",
    juniorSubmitted: "ג׳וניור   הגיש",
    companyCommitted: "חברה   הטמיעה",
    pageOmitted: "עמוד   הושמט",
    error: "שגיאה",
    ariaLabel: "חזרה לדף הבית",
  }
};

const PageNotFound = () => {
  const { locale } = useLocaleContext();
  const t = translations[locale] || translations.en;
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
    <div className="page-not-found-container" role="main" aria-labelledby="pnf-heading" dir={locale === 'he' ? 'rtl' : 'ltr'}>
      {/* OFAiR Avatar + Tooltip */}
      <div
        ref={avatarRef}
        className="OFAiR clickable-avatar"
        style={{ backgroundImage: `url(${OFAiRImage})` }}
        onClick={goHome}
        onKeyDown={onKeyDown}
        role="button"
        tabIndex={0}
        aria-label={t.ariaLabel}
      >
        <div className="tooltip-homepage" role="tooltip" id="home-tip">
          {t.backToSafety}
        </div>
      </div>

      <div className="text text-back">
        <span className="line flickerJunior">{t.juniorSubmitted}</span><br />
        <span className="line flickerCompany">{t.companyCommitted}</span><br />
        <span className="line flickerPage">{t.pageOmitted}</span><br /><br />

        <span className="blink err_r">{t.error.substring(0, 3)}</span>
        <span className="_0">{t.error.includes('0') ? '0' : t.error.substring(3, 4)}</span>
        <span className="blink err_r">{t.error.substring(t.error.includes('0') ? 4 : 4)}</span>

        <span className="spacer" aria-hidden="true">&nbsp;&nbsp;&nbsp;</span>

        <span className="_4_4">4</span>
        <span className="_0">0</span>
        <span className="_4_4">4</span>
      </div>

      <div className="text text-front" aria-hidden="true">
        <span className="line flickerJunior">{t.juniorSubmitted}</span><br />
        <span className="line flickerCompany">{t.companyCommitted}</span><br />
        <span className="line flickerPage">{t.pageOmitted}</span><br /><br />

        <span className="blink err_r">{t.error.substring(0, 3)}</span>
        <span className="_0">{t.error.includes('0') ? '0' : t.error.substring(3, 4)}</span>
        <span className="blink err_r">{t.error.substring(t.error.includes('0') ? 4 : 4)}</span>

        <span className="spacer" aria-hidden="true">&nbsp;&nbsp;&nbsp;</span>

        <span className="_4_4">4</span>
        <span className="_0">0</span>
        <span className="_4_4">4</span>
      </div>
    </div>
  );
};

export default PageNotFound;
