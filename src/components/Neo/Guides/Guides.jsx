// src/components/Neo/Guides/Guides.jsx
import React, { useState, useMemo } from "react";
import IPhoneMockup from "./iPhoneMockup";

import InstagramFeed from "./InstagramFeed";
import InstagramReels from "./InstagramReels";
// בהמשך:
// import GuidesSearch from "./GuidesSearch";
// import GuidesProfile from "./GuidesProfile";

import BottomToolbar from "./BottomToolbar.jsx";

export default function Guides() {
  /**
   * activeTab = הטאב הראשי באפליקציה
   * זה מחליף Router בשלב הזה (כמו React Native)
   */
  const [activeTab, setActiveTab] = useState("feed");

  /**
   * שמירה על instances של המסכים
   * כדי לא לאבד scroll / state כשעוברים טאב
   */
  const screens = useMemo(
    () => ({
      feed: <InstagramFeed />,
      reels: <InstagramReels />,
      search: <div style={placeholderStyle}>Search (soon)</div>,
      profile: <div style={placeholderStyle}>Profile (soon)</div>,
    }),
    []
  );

  return (
    <section className="guides-section">
      <IPhoneMockup
        width={380}
        showHand={false}
        islandScale={0.95}
        glassShine={0.9}
        ambient={0.9}
      >
        <div className="app-shell">
          {/* אזור המסך */}
          <main className="screen-area">
            {screens[activeTab]}
          </main>

          {/* Toolbar קבוע */}
          <BottomToolbar
            active={activeTab}
            onChange={setActiveTab}
          />
        </div>
      </IPhoneMockup>
    </section>
  );
}

const placeholderStyle = {
  height: "100%",
  display: "grid",
  placeItems: "center",
  color: "#888",
  fontSize: 14,
};
