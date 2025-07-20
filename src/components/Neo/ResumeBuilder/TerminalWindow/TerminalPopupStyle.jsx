// TerminalPopupStyle.js
const terminalPopupCSS = `
  body {
    margin: 0;
    height: 100vh;
    width: 100vw;
    background: linear-gradient(135deg, #0a0a0a, #101820);
    font-family: 'Courier Prime', monospace;
    color: #00ffe0;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  @keyframes fadeInScale {
    from { opacity: 0; transform: scale(0.94); }
    to { opacity: 1; transform: scale(1); }
  }

  @keyframes pulseBorder {
    0%, 100% {
      box-shadow: 0 0 40px rgba(0, 255, 204, 0.3), 0 0 20px #00ffcc inset;
    }
    50% {
      box-shadow: 0 0 60px rgba(0, 255, 204, 0.5), 0 0 30px #00ffcc inset;
    }
  }

  @keyframes corePulse {
    0%, 100% {
      background: radial-gradient(ellipse at center, #111 0%, #000 100%);
    }
    50% {
      background: radial-gradient(ellipse at center, #1a1a1a 0%, #000 100%);
    }
  }

  @keyframes inputExpand {
    0% { transform: scale(1); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1); }
  }

  @keyframes blinkDot {
    0%, 100% { opacity: 0.2; }
    50% { opacity: 1; }
  }

  #terminal-window {
    background: rgba(10, 10, 10, 0.96);
    border: 2px solid #00ffcc;
    box-shadow: 0 0 40px rgba(0, 255, 204, 0.3), 0 0 20px #00ffcc inset;
    border-radius: 14px;
    padding: 30px;
    width: 98.5vw;
    height: 98vh;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    transition: all 0.3s ease-in-out;
    animation: fadeInScale 0.4s ease-out, pulseBorder 5s infinite ease-in-out;
  }

  #terminal-display {
    flex: 1;
    overflow-y: auto;
    animation: corePulse 4s infinite ease-in-out;
    padding: 20px;
    margin-bottom: 16px;
    border-radius: 10px;
    border: 1px solid rgba(0, 255, 224, 0.4);
    box-shadow: inset 0 0 20px rgba(0, 255, 204, 0.3);
    font-size: 1rem;
  }

  #terminal-input {
    background-color: #000;
    border: 2px solid #00ffe0;
    border-radius: 10px;
    color: #00ffe0;
    padding: 14px 18px;
    font-size: 1rem;
    width: 100%;
    outline: none;
    box-shadow: 0 0 8px rgba(0, 255, 224, 0.2);
    transition: border-color 0.2s;
    animation: inputExpand 6s infinite ease-in-out;
  }

  #terminal-input:focus {
    border-color: #2adef2;
  }

  #terminal-input::placeholder {
    color: #00ffe0aa;
    font-style: italic;
  }

  .line {
    margin-bottom: 6px;
    line-height: 1.5;
  }

  .line.user {
    color: #2adef2;
  }

  .line.user::before {
    content: "•";
    color: #2adef2;
    animation: blinkDot 1.2s infinite;
    margin-right: 4px;
  }

  .line.ofair {
    color: #17ca07;
    position: relative;
  }

  .line.ofair::before {
    content: "•";
    color: #17ca07;
    animation: blinkDot 1.2s infinite;
    margin-right: 4px;
  }
`;

export default terminalPopupCSS;
