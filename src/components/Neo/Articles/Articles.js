import React, { useEffect, useState } from "react";
import "./Articles.css";

const articlesData = [
  {
    title: "Memory Block 01",
    content: `> loading article_01.sys...\n\nWelcome to the construct.\nThis is where ideas are born, and reality is bent.\n\nThe Junior dev is not a bug – he is the reboot.`,
  },
  {
    title: "Memory Block 02",
    content: `> decrypting oracle.log...\n\nWhat you read here has not yet happened.\nBut it will.\n\nUnless... you choose otherwise.`,
  },
  {
    title: "Memory Block 03",
    content: `> fetching agent_smith.txt...\n\nThe system fights change.\nThe code resists evolution.\n\nBut revolution begins with a single keystroke.`,
  },
];

const Articles = () => {
  const [typedArticles, setTypedArticles] = useState([]);

  const BottomBlock = () => {
  return (
    <div className="bottom-block hidden">
      <h2>...</h2>
      <p>...</p>
    </div>
  );
};

  useEffect(() => {
    let time = 0;
    const delays = [];

    articlesData.forEach((article, i) => {
      let current = "";
      const full = article.content;
      for (let j = 0; j <= full.length; j++) {
        delays.push({
          time: time + j * 10,
          content: full.slice(0, j),
          index: i,
        });
      }
      time += full.length * 10 + 800; // delay between articles
    });

    delays.forEach(({ time, content, index }) => {
      setTimeout(() => {
        setTypedArticles((prev) => {
          const updated = [...prev];
          updated[index] = content;
          return updated;
        });
      }, time);
    });
  }, []);

  return (
    <div className="memory-scroll-container">
      {articlesData.map((article, i) => (
        <div key={i} className="memory-block">
          <h2 className="memory-title">{article.title}</h2>
          <pre className="memory-content">{typedArticles[i] || ""}</pre>
        </div>
      ))}
      <BottomBlock />
    </div>
  );
};

export default Articles;
