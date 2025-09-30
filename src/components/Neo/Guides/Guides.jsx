// src/components/Neo/Guides/Guides.jsx
import IPhoneMockup from "./iPhoneMockup";
import GuidesFeed from "./GuidesFeed";

export default function Guides() {
  return (
    <section className="guides-section">
      <IPhoneMockup
        width={380}
        showHand={false}
        islandScale={0.95}
        glassShine={0.9}
        ambient={0.9}
      >
        {/* התוכן חי בתוך המסך */}
        <GuidesFeed initialLang="he" initialTheme="dark" />
      </IPhoneMockup>
    </section>
  );
}
