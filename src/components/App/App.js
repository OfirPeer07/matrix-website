import React, { useEffect, useState, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "./App.css";

// Agent Smith
import AgentSmith from "../AgentSmith/AgentSmith";
import AgentSmithDepartment from "../AgentSmith/AgentSmithDepartment/AgentSmithDepartment";
import TroubleshootingGuides from "../AgentSmith/TroubleshootingGuides/TroubleshootingGuides";
import TechnologyNews from "../AgentSmith/TechnologyNews/TechnologyNews";
import BuildingComputers from "../AgentSmith/BuildingComputers/BuildingComputers";

// Neo
import Neo from "../Neo/Neo";
import Articles from "../Neo/Articles/Articles";
import Guides from "../Neo/Guides/Guides";
import Videos from "../Neo/Videos/Videos";
import ResumeBuilder from "../Neo/ResumeBuilder/ResumeBuilder";

// General
import MatrixBar from "../Sidebar/MatrixBar";
import PageNotFound from "../PageNotFound/PageNotFound";
import ContactUs from "../ContactUs/ContactUs";
import Intro from "../Intro/Intro";
import Thanks from "../Thanks/Thanks";

// Safari detect
function isMobileSafari() {
  const ua = navigator.userAgent;
  return (
    /iP(ad|hone|od)/.test(ua) &&
    /WebKit/.test(ua) &&
    !/CriOS/.test(ua) &&
    !/FxiOS/.test(ua)
  );
}

function App() {
  const [showIntro, setShowIntro] = useState(true);

  const Hacking = lazy(() => import("../Neo/Hacking/Hacking"));
  const MainPage = lazy(() => import("../MainPage/MainPage"));

  const [isSafariMobile, setIsSafariMobile] = useState(false);

  useEffect(() => {
    if (isMobileSafari()) setIsSafariMobile(true);
  }, []);

  return (
    <Router>
      <div className="App">
        <ConditionalSidebar />

        <div className="content">
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              {/* MAIN PAGE תמיד / */}
              <Route
                path="/"
                element={<MainPage introDone={!showIntro} />}
              />

              {/* NEO */}
              <Route path="/neo" element={<Neo />} />
              <Route path="/neo/hacking" element={<Hacking />} />
              <Route path="/neo/hacking/build-your-resume" element={<ResumeBuilder />} />
              <Route path="/neo/hacking/guides" element={<Guides />} />
              <Route path="/neo/hacking/articles" element={<Articles />} />
              <Route path="/neo/hacking/videos" element={<Videos />} />

              {/* AGENT SMITH */}
              <Route path="/agent-smith" element={<AgentSmith />} />
              <Route path="/agent-smith/agent-smith-department" element={<AgentSmithDepartment />} />
              <Route path="/agent-smith/agent-smith-department/technology-news" element={<TechnologyNews />} />
              <Route path="/agent-smith/agent-smith-department/troubleshooting-guides" element={<TroubleshootingGuides />} />
              <Route path="/agent-smith/agent-smith-department/building-computers" element={<BuildingComputers />} />

              {/* GENERAL */}
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/thanks" element={<Thanks />} />

              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>

          {isSafariMobile && <div className="invisible-block" />}
        </div>

        {/* INTRO OVERLAY */}
        <div className={`intro-wrapper ${!showIntro ? "intro-hidden" : ""}`}>
          {showIntro && (
            <Intro onFinish={() => setShowIntro(false)} />
          )}
        </div>
      </div>
    </Router>
  );
}

function ConditionalSidebar() {
  const location = useLocation();

  if (location.pathname.startsWith("/neo")) {
    return (
      <div dir="ltr">
        <MatrixBar mode="neo" showLogo />
      </div>
    );
  }

  if (location.pathname.startsWith("/agent-smith")) {
    return (
      <div dir="ltr">
        <MatrixBar mode="agent-smith" showLogo />
      </div>
    );
  }

  return null;
}

export default App;
