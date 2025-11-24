import React, { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';

// Import all Agent Smith components  
import AgentSmith from '../AgentSmith/AgentSmith';
import AgentSmithDepartment from '../AgentSmith/AgentSmithDepartment/AgentSmithDepartment';
import TroubleshootingGuides from '../AgentSmith/TroubleshootingGuides/TroubleshootingGuides';
import TechnologyNews from '../AgentSmith/TechnologyNews/TechnologyNews';
import BuildingComputers from '../AgentSmith/BuildingComputers/BuildingComputers';

// Import all Neo components  
import Neo from '../Neo/Neo';
import OFAiR from '../Neo/OFAiR/OFAiR';
import Articles from '../Neo/Articles/Articles';
import Guides from '../Neo/Guides/Guides';
import Videos from '../Neo/Videos/Videos';

// Import all General components  
import MatrixBar from '../Sidebar/MatrixBar';
import PageNotFound from '../PageNotFound/PageNotFound';
import ContactUs from '../ContactUs/ContactUs';
import Thanks from '../Thanks/Thanks';
import CacheClearOnRouteChange from '../ClearCache/ClearCeche';
import ResumeBuilder from '../Neo/ResumeBuilder/ResumeBuilder';

// Detect Safari on Mobile
function isMobileSafari() {
  const ua = navigator.userAgent;
  return /iP(ad|hone|od)/.test(ua) && /WebKit/.test(ua) && !/CriOS/.test(ua) && !/FxiOS/.test(ua);
}

function App() {
  const Hacking = lazy(() => import('../Neo/Hacking/Hacking'));
  const MainPage = lazy(() => import('../MainPage/MainPage'));

  const [isSafariMobile, setIsSafariMobile] = useState(false);

  useEffect(() => {
    if (isMobileSafari()) {
      setIsSafariMobile(true);
    }
  }, []);

  return (
    <Router>
      <CacheClearOnRouteChange />
      <div className="App">
        <ConditionalSidebar />
        <div className="content">
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/neo" element={<Neo />} />
              <Route path="/agent-smith" element={<AgentSmith />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/thanks" element={<Thanks />} />
              <Route path="/neo/hacking" element={<Hacking />} />
              <Route path="/neo/hacking/build-your-resume" element={<ResumeBuilder />} />
              <Route path="/neo/hacking/guides" element={<Guides />} />
              <Route path="/neo/hacking/articles" element={<Articles />} />
              <Route path="/neo/hacking/videos" element={<Videos />} />
              <Route path="/agent-smith/agent-smith-department/" element={<AgentSmithDepartment />} />
              <Route path="/agent-smith/agent-smith-department/technology-news" element={<TechnologyNews />} />
              <Route path="/agent-smith/agent-smith-department/troubleshooting-guides" element={<TroubleshootingGuides />} />
              <Route path="/agent-smith/agent-smith-department/building-computers" element={<BuildingComputers />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>

          {/* Safari mobile fix block */}
          {isSafariMobile && <div className="invisible-block"></div>}
        </div>
      </div>
    </Router>
  );
}

// Component to conditionally render the MatrixBar with a specific mode
function ConditionalSidebar() {
  const location = useLocation();

  if (location.pathname.startsWith('/neo')) {
    return (
      <div dir="ltr">
        <MatrixBar mode="neo" showLogo={true} />
      </div>
    );
  }
  if (location.pathname.startsWith('/agent-smith')) {
    return (
      <div dir="ltr">
        <MatrixBar mode="agent-smith" showLogo={true} />
      </div>
    );
  }
  return null;
}

export default App;
