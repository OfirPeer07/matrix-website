import React from "react";
import "./SearchInstagram.css";

const GRID_ITEMS = [
  {
    src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600",
    views: "283K",
  },
  {
    src: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600",
    views: "1.9M",
  },
  {
    src: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600",
    views: "259K",
  },
  {
    src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600",
    views: "814K",
  },
  {
    src: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=600",
    views: "95.2K",
  },
  {
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600",
    views: "344K",
  },
  {
    src: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=600",
    views: "512K",
  },
  {
    src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600",
    views: "120K",
  },
  {
    src: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600",
    views: "1.2M",
  },
  {
    src: "https://images.unsplash.com/photo-1545239351-ef35f43d514b?w=600",
    views: "78.1K",
  },
  {
    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600",
    views: "452K",
  },
  {
    src: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600",
    views: "210K",
  },
];

export default function SearchInstagram() {
  return (
    <div className="ig-search-root">
      <div className="ig-search-bar">
        <span className="search-icon" aria-hidden />
        <span className="search-placeholder">חיפוש מדריכים</span>
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
