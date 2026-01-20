import React from "react";
import "./BottomToolbar.css";

import {
  HomeOutline,
  HomeFilled,
  SearchIcon,
  ReelsIcon,
  HeartOutline,
  HeartFilled,
} from "./InstagramIcons";

export default function BottomToolbar({ active, onChange }) {
  return (
    <nav className="ig-bottom-nav">

      <button
        className={active === "feed" ? "active" : ""}
        onClick={() => onChange("feed")}
        aria-label="Feed"
      >
        {active === "feed" ? <HomeFilled /> : <HomeOutline />}
      </button>

      <button
        className={`reels ${active === "reels" ? "active" : ""}`}
        onClick={() => onChange("reels")}
        aria-label="Reels"
      >
        <ReelsIcon />
      </button>

      <button
        className={active === "activity" ? "active" : ""}
        onClick={() => onChange("activity")}
        aria-label="Activity"
      >
        {active === "activity" ? <HeartFilled /> : <HeartOutline />}
      </button>

      <button
        className={active === "search" ? "active" : ""}
        onClick={() => onChange("search")}
        aria-label="Search"
      >
        <SearchIcon />
      </button>
      
      <button
        className={`profile ${active === "profile" ? "active" : ""}`}
        onClick={() => onChange("profile")}
        aria-label="Profile"
      >
        <img
          src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=80"
          alt=""
          className="avatar"
        />
      </button>

    </nav>
  );
}
