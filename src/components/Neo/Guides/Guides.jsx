// src/components/Neo/Guides/Guides.jsx
import React, { useState } from "react";
import IPhoneMockup from "./iPhoneMockup";
import GuidesFeed from "./GuidesFeed";
import GuidesReels from "./GuidesReels";

export default function Guides() {
  const [view, setView] = useState("feed"); // 'feed' | 'reels' | 'profile' | 'post'

  // דמו – תחליף/תוסיף קבצים משלך
  // שים קבצים תחת: public/assets/reels/...
  const reelsItems = [
    {
      id: "r1",
      src: "/assets/reels/clip1.mp4",
      poster: "/assets/reels/clip1.jpg",
      caption: "State & Effects — quick tip",
      username: "neoacademy",
      timestamp: "2025-08-20T12:00:00Z",
    },
    {
      id: "r2",
      src: "/assets/reels/clip2.mp4",
      poster: "/assets/reels/clip2.jpg",
      caption: "CSS grid in 60s",
      username: "uiclub",
      timestamp: "2025-06-03T12:00:00Z",
    },
    {
      id: "r3",
      src: "https://filesamples.com/samples/video/mp4/sample_960x400_ocean_with_audio.mp4",
      poster:
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop",
      caption: "Demo from CDN",
      username: "demo",
      timestamp: "2025-03-18T12:00:00Z",
    },
  ];

  return (
    <section className="guides-section">
      <IPhoneMockup
        width={380}
        showHand={false}
        islandScale={0.95}
        glassShine={0.9}
        ambient={0.9}
      >
        {view === "feed" && (
          <GuidesFeed
            initialLang="he"
            initialTheme="dark"
            // קריאות מה-bottom bar:
            onNavigate={(next) => setView(next)} // next: 'feed' | 'reels' | 'profile'
          />
        )}

        {view === "reels" && (
          <GuidesReels items={reelsItems} title="Guides Reels" />
        )}

        {/* אם יש לך עמוד Profile/Post נפרדים נשמור כאן בהמשך:
            {view === "profile" && <ProfileInsidePhone ... />} */}
      </IPhoneMockup>
    </section>
  );
}
