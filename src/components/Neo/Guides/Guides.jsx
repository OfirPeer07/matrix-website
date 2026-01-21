// src/components/Neo/Guides/Guides.jsx
import React, { useState } from "react";
import "./Guides.css";

import IPhoneMockup from "./iPhoneMockup";

import InstagramFeed from "./InstagramFeed";
import InstagramReels from "./InstagramReels";
import InstagramProfile from "./InstagramProfile";
import InstagramDM from "./InstagramDM";

import BottomToolbar from "./BottomToolbar.jsx";

export default function Guides() {
  const [activeTab, setActiveTab] = useState("feed");

  const renderScreen = () => {
    switch (activeTab) {
      case "feed":
        return (
          <InstagramFeed
            showHeader={true}
            onOpenDM={() => setActiveTab("activity")}
          />
        );

      case "reels":
        return <InstagramReels />;

      case "search":
        return <div style={placeholderStyle}>Search (soon)</div>;

      // ❤️ DM
      case "activity":
        return <InstagramDM onBack={() => setActiveTab("feed")} />;

      case "profile":
        return <InstagramProfile />;

      default:
        return null;
    }
  };

  return (
    <section className="guides-section">
      <IPhoneMockup width={380}>
        <div className="app-shell">

          <main className="screen-area">
            {renderScreen()}
          </main>

          {/* ✅ Toolbar קיים תמיד — חוץ מ-DM */}
          {activeTab !== "activity" && (
            <BottomToolbar
              active={activeTab}
              onChange={setActiveTab}
            />
          )}

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
