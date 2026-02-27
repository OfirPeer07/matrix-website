import React from "react";
import { useLocaleContext } from "../../../context/LocaleContext";
import "./BottomToolbar.css";

import {
  HomeOutline,
  HomeFilled,
  SearchIcon,
  ReelsIcon,
  SendIcon,
  ProfileIcon,
} from "./InstagramIcons";

const translations = {
  en: {
    feed: "Feed",
    reels: "Reels",
    dm: "Direct Messages",
    search: "Search",
    profile: "Profile"
  },
  he: {
    feed: "פיד",
    reels: "רילס",
    dm: "הודעות",
    search: "חיפוש",
    profile: "פרופיל"
  }
};

export default function BottomToolbar({ active, onChange }) {
  const { locale } = useLocaleContext();
  const t = translations[locale];

  return (
    <nav className="ig-bottom-nav">

      <button
        className={active === "feed" ? "active" : ""}
        onClick={() => onChange("feed")}
        aria-label={t.feed}
      >
        {active === "feed" ? <HomeFilled /> : <HomeOutline />}
      </button>

      <button
        className={`reels ${active === "reels" ? "active" : ""}`}
        onClick={() => onChange("reels")}
        aria-label={t.reels}
      >
        <ReelsIcon />
      </button>

      <button
        className={`dm ${active === "activity" ? "active" : ""}`}
        onClick={() => onChange("activity")}
        aria-label={t.dm}
      >
        <SendIcon />
      </button>

      <button
        className={active === "search" ? "active" : ""}
        onClick={() => onChange("search")}
        aria-label={t.search}
      >
        <SearchIcon />
      </button>

      <button
        className={`profile ${active === "profile" ? "active" : ""}`}
        onClick={() => onChange("profile")}
        aria-label={t.profile}
      >
        <ProfileIcon />
      </button>

    </nav>
  );
}
