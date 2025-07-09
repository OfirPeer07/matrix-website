import React from 'react';
import './AgentSmithDepartment.css'; 
import TechnologyNews from './TechnologyNews.jpg';  
import TroubleshootingGuides from './TroubleshootingGuides.jpg';
import BuildingComputers from './BuildingComputers.jpg';

const AgentSmithDepartment = () => {

    const handleNavigation = (path) => {
        window.location.href = path;
      };

  return (
    <div className="agent-smith-department-container">
      <div className="agent-smith-department-rectangle img1">
        <img src={TroubleshootingGuides} alt="Troubleshooting Guides" onClick={() => handleNavigation('/agent-smith/troubleshooting-guides')} />
      </div>
      <div className="agent-smith-tdepartment-rectangle img2">
        <img src={TechnologyNews} alt="Technology News" onClick={() => handleNavigation('/agent-smith/technology-news')} />
      </div>
      <div className="agent-smith-department-rectangle img3">
        <img src={BuildingComputers} alt="Building Computers" onClick={() => handleNavigation('/agent-smith/building-computers')} />
      </div>
    </div>
  );
};

export default AgentSmithDepartment;
