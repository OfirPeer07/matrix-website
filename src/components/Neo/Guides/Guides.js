// Guides.js
import React, { useState, useEffect } from "react";
import "./Guides.css";

const guidesData = [
  {
    id: "GCD-001",
    name: "Neural Sync Optimization",
    code: `
> inject --module neural-sync --target=Neo

// Initiating BCI synchronization...
const brainLink = createLink("Neo");
brainLink.optimizeFrequencies();
brainLink.stabilize("Theta");

// Result: latency reduced by 42ms
    `,
  },
  {
    id: "GCD-002",
    name: "Environment Override Patch",
    code: `
> inject --env-patch matrix.env

if (Matrix.environment === "hostile") {
  Matrix.override("simulation", "sandbox");
}

// Result: Agent detection bypassed
    `,
  },
  {
    id: "GCD-003",
    name: "Combat Reflex Amplifier",
    code: `
> inject --skill boost.reflex.pkg

loadModule("kungfu_v2.3");
system.overclock("motor cortex");

// Reflexes enhanced to 1.2x baseline
    `,
  },
];

const Guides = () => {
  const [typedGuides, setTypedGuides] = useState([]);

  const BottomBlock = () => {
  return (
    <div className="bottom-block hidden">
      <h2>...</h2>
      <p>...</p>
    </div>
  );
};  

  useEffect(() => {
    let index = 0;

    const typeNextGuide = () => {
      if (index < guidesData.length) {
        const guide = guidesData[index];
        let i = 0;
        let typed = "";
        const interval = setInterval(() => {
          if (i < guide.code.length) {
            typed += guide.code[i];
            setTypedGuides(prev => {
              const updated = [...prev];
              updated[index] = typed;
              return updated;
            });
            i++;
          } else {
            clearInterval(interval);
            index++;
            setTimeout(typeNextGuide, 700);
          }
        }, 10);
      }
    };

    typeNextGuide();
  }, []);

  return (
    <div className="genetic-guides-container">
      {guidesData.map((guide, i) => (
        <div key={i} className="code-drop-block">
          <div className="header">
            <span className="drop-id">{guide.id}</span>
            <span className="drop-name">{guide.name}</span>
          </div>
          <pre className="drop-code">{typedGuides[i] || ""}</pre>
        </div>
      ))}
      <BottomBlock />
    </div>
  );
};

export default Guides;
