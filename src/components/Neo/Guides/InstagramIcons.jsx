import React from "react";

/* =========================
   Home
   ========================= */
export const HomeOutline = () => (
  <svg viewBox="0 0 24 24">
    <path
      d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const HomeFilled = () => (
  <svg viewBox="0 0 24 24">
    <path
      d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"
      fill="currentColor"
    />
  </svg>
);

/* =========================
   Search
   ========================= */
export const SearchIcon = () => (
  <svg viewBox="0 0 24 24">
    <circle
      cx="10.5"
      cy="10.5"
      r="6.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    />
    <path
      d="M21 21l-4.35-4.35"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

/* =========================
   Reels
   ========================= */
export const ReelsIcon = () => (
  <svg viewBox="0 0 24 24">
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <path d="M12 9v6l4-3z" fill="currentColor" />
  </svg>
);

/* =========================
   Send (DM)
   ========================= */
export const SendIcon = () => (
  <svg viewBox="0 0 24 24">
    <path
      d="M22 3L11 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 3l-7 18-4-7-7-4z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* =========================
   Profile
   ========================= */
export const ProfileIcon = () => (
  <svg viewBox="0 0 24 24">
    <circle
      cx="12"
      cy="12"
      r="9"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    />
    <circle cx="12" cy="10" r="3" fill="currentColor" />
    <path d="M6.5 19c1.7-2 3.6-3 5.5-3s3.8 1 5.5 3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
