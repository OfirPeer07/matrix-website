import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AgentSmithDepartment.css';
import { useLocaleContext } from '../../../context/LocaleContext';

import TechnologyNews from './TechnologyNews.png';
import BuildingComputers from './BuildingComputers.png';
import TroubleshootingGuides from './TroubleshootingGuides.png';

const content = {
  en: {
    dir: 'ltr',
    pageTitle: 'AGENT SMITH',
    pageSub: 'OPERATIONS TERMINAL',
    accessLabel: 'ACCESS GRANTED',
    enterCta: 'ENTER >>',
    items: [
      {
        src: TroubleshootingGuides,
        alt: 'Troubleshooting Guides',
        path: '/agent-smith/agent-smith-department/troubleshooting-guides',
        classification: 'CLASSIFIED',
        hexId: '0x01',
        label: 'Troubleshooting Guides',
        description: 'Diagnose & eliminate system anomalies',
      },
      {
        src: TechnologyNews,
        alt: 'Technology News',
        path: '/agent-smith/agent-smith-department/technology-news',
        classification: 'RESTRICTED',
        hexId: '0x02',
        label: 'Technology News',
        description: 'Intercept the latest tech intelligence',
      },
      {
        src: BuildingComputers,
        alt: 'Building Computers',
        path: '/agent-smith/agent-smith-department/building-computers',
        classification: 'TOP_SECRET',
        hexId: '0x03',
        label: 'Building Computers',
        description: 'Assemble machines from the ground up',
      },
    ],
  },
  he: {
    dir: 'rtl',
    pageTitle: 'סוכן סמית׳',
    pageSub: 'מסוף מבצעי',
    accessLabel: 'גישה מאושרת',
    enterCta: 'כניסה >>',
    items: [
      {
        src: TroubleshootingGuides,
        alt: 'מדריכי פתרון תקלות',
        path: '/agent-smith/agent-smith-department/troubleshooting-guides',
        classification: 'מסווג',
        hexId: '0x01',
        label: 'מדריכי פתרון תקלות',
        description: 'אבחון וחיסול אנומליות מערכת',
      },
      {
        src: TechnologyNews,
        alt: 'חדשות טכנולוגיה',
        path: '/agent-smith/agent-smith-department/technology-news',
        classification: 'מוגבל',
        hexId: '0x02',
        label: 'חדשות טכנולוגיה',
        description: 'יירוט מודיעין טכנולוגי עדכני',
      },
      {
        src: BuildingComputers,
        alt: 'בניית מחשבים',
        path: '/agent-smith/agent-smith-department/building-computers',
        classification: 'סודי_ביותר',
        hexId: '0x03',
        label: 'בניית מחשבים',
        description: 'הרכבת מכונות מהבסיס',
      },
    ],
  },
};

const AgentSmithDepartment = () => {
  const navigate = useNavigate();
  const { locale } = useLocaleContext();
  const t = content[locale] || content.he;

  return (
    <div className="asd-page" dir={t.dir}>
      {/* Page Header */}
      <header className="asd-header">
        <div className="asd-header-scanline" aria-hidden="true" />
        <div className="asd-header-inner">
          <div className="asd-header-left">
            <span className="asd-status-dot pulse" aria-hidden="true" />
            <span className="asd-status-text">SYSTEM ONLINE</span>
          </div>
          <div className="asd-title-block">
            <h1 className="asd-main-title">{t.pageTitle}</h1>
            <p className="asd-sub-title">{t.pageSub}</p>
          </div>
          <div className="asd-access-badge">
            <span>[ {t.accessLabel} ]</span>
          </div>
        </div>
      </header>

      {/* Grid */}
      <main className="asd-grid" aria-label={t.pageSub}>
        {t.items.map((item, index) => (
          <article
            key={index}
            className="asd-card"
            role="button"
            tabIndex={0}
            aria-label={item.label}
            onClick={() => navigate(item.path)}
            onKeyDown={(e) => { if (e.key === 'Enter') navigate(item.path); }}
          >
            {/* Scanline sweep animation */}
            <div className="asd-card-scanline" aria-hidden="true" />

            {/* Image */}
            <div className="asd-card-media">
              <img src={item.src} alt={item.alt} loading="lazy" decoding="async" />
              <div className="asd-card-media-overlay" aria-hidden="true" />
            </div>

            {/* Terminal panel info */}
            <div className="asd-card-body" dir={t.dir}>
              <div className="asd-card-top-bar">
                <span className="asd-classification">{item.classification}</span>
                <span className="asd-hex-id">{item.hexId}</span>
              </div>
              <h2 className="asd-card-label">{item.label}</h2>
              <p className="asd-card-desc">{item.description}</p>
              <div className="asd-card-footer">
                <span className="asd-cta">{t.enterCta}</span>
              </div>
            </div>
          </article>
        ))}
      </main>
    </div>
  );
};

export default AgentSmithDepartment;
