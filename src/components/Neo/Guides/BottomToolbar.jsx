import React from "react";
import "./BottomToolbar.css";

export default function BottomToolbar({ active = "home", onChange }) {
  return (
    <nav className="ig-bottom-nav">
      <button
        className={active === "home" ? "active" : ""}
        onClick={() => onChange("home")}
      >
        <svg viewBox="0 0 24 24">
          <path
            d="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </svg>
      </button>

      <button
        className={active === "search" ? "active" : ""}
        onClick={() => onChange("search")}
      >
        <svg viewBox="0 0 24 24">
          <circle
            cx="11"
            cy="11"
            r="7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M21 21l-4.3-4.3"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <button
        className={`reels ${active === "reels" ? "active" : ""}`}
        onClick={() => onChange("reels")}
      >
        <svg viewBox="0 0 24 24">
          <rect
            x="3"
            y="4"
            width="18"
            height="16"
            rx="4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M3 9h18M9 4l3 5M15 4l3 5"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <path d="M12 11v5l4-2.5-4-2.5Z" fill="currentColor" />
        </svg>
      </button>

      <button
        className={active === "activity" ? "active" : ""}
        onClick={() => onChange("activity")}
      >
        <svg viewBox="0 0 24 24">
          <path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </svg>
      </button>

      <button
        className={active === "profile" ? "active" : ""}
        onClick={() => onChange("profile")}
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
