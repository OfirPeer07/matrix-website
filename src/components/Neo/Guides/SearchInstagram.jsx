import React from "react";
import "./SearchInstagram.css";

const GRID_ITEMS = [
  {
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600",
    views: "283K",
  },
  {
    src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600",
    views: "1.9M",
  },
  {
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",
    views: "259K",
  },
  {
    src: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600",
    views: "814K",
  },
  {
    src: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=600",
    views: "95.2K",
  },
  {
    src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600",
    views: "344K",
  },
  {
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600",
    views: "512K",
  },
  {
    src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600",
    views: "120K",
  },
  {
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",
    views: "1.2M",
  },
  {
    src: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600",
    views: "78.1K",
  },
  {
    src: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=600",
    views: "452K",
  },
  {
    src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600",
    views: "210K",
  },
];

export default function SearchInstagram() {
  return (
    <div className="ig-search-root">
      <div className="ig-search-bar">
        <span className="search-icon" aria-hidden />
        <span className="search-placeholder">Search</span>
      </div>

      <div className="ig-search-grid">
        {GRID_ITEMS.map((item, index) => (
          <div key={index} className="search-tile">
            <img src={item.src} alt="" />
            <div className="tile-meta">
              <span className="tile-play" aria-hidden />
              <span>{item.views}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
