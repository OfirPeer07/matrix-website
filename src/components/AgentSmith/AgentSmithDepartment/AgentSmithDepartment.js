import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AgentSmithDepartment.css';

import TechnologyNews from './TechnologyNews.png';
import TroubleshootingGuides from './TroubleshootingGuides.png';
import BuildingComputers from './BuildingComputers.png';

const AgentSmithDepartment = () => {
  const navigate = useNavigate();

  const items = [
    {
      src: TroubleshootingGuides,
      alt: 'מדריכי פתרון תקלות',
      path: '/agent-smith/agent-smith-department/troubleshooting-guides',
      label: 'מדריכי פתרון תקלות',
    },
    {
      src: TechnologyNews,
      alt: 'חדשות טכנולוגיה',
      path: '/agent-smith/agent-smith-department/technology-news',
      label: 'חדשות טכנולוגיה',
    },
    {
      src: BuildingComputers,
      alt: 'בניית מחשבים',
      path: '/agent-smith/agent-smith-department/building-computers',
      label: 'בניית מחשבים',
    },
  ];

  return (
    <div className="agent-smith-department-container" role="region" aria-label="מחלקת אג'נט סמית'">
      {items.map((item, index) => (
        <div
          key={index}
          className="department-card"
          role="button"
          tabIndex={0}
          aria-label={item.label}
          onClick={() => navigate(item.path)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') navigate(item.path);
          }}
        >
          <img src={item.src} alt={item.alt} />
          <div className="overlay">
            <span>{item.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AgentSmithDepartment;
