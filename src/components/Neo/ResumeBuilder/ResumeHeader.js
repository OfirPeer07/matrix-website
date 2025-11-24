// ResumeHeader.js
import React from "react";
import "./ResumeHeader.css";

import ResumeTitle from "../ResumeBuilder/ResumeTitle";
import OFAiR from "../OFAiR/OFAiR";
import TerminalWindow from "../ResumeBuilder/TerminalWindow/TerminalWindow";

export default function ResumeHeader({
  messages = [],
  onSend,
  onOpenTerminal,
  showInlineTerminal = true,
  inlineTerminalTitle = "OFAiR Terminal",
  className = "",
  onOfairAction,
}) {
  return (
    <header className={`resume-header ${className}`}>
      {/* כפתור – באותה שכבה עליונה */}
      <div className="resume-header__right">
        <button
          type="button"
          className="resume-header__open-terminal-btn"
          onClick={onOpenTerminal}
          aria-label="Open Terminal popup window"
          title="Open Terminal"
        >
          Open Terminal
        </button>
      </div>

      {/* גריד 2 עמודות: שמאל – כותרת+OFAiR, ימין – “מסך” עם טרמינל */}
      <div className="resume-header__grid">
        {/* שמאל */}
        <div className="header-left">
          <div className="title-wrap">
            <ResumeTitle />
          </div>

          <div className="ofair-wrap">
            <OFAiR
              messages={messages}
              onSend={onSend}
              onAction={onOfairAction}
            />
          </div>
        </div>

        {/* ימין */}
        <div className="header-right">
          {showInlineTerminal && (
            <div className="inline-terminal__frame" role="group" aria-label="Embedded Terminal">
              <div className="inline-terminal__topbar">
                <div className="dot dot--red" />
                <div className="dot dot--yellow" />
                <div className="dot dot--green" />
                <div className="inline-terminal__title" aria-hidden="true">
                  {inlineTerminalTitle}
                </div>
              </div>
              <div className="inline-terminal__body">
                <TerminalWindow
                  isPopup={false}
                  messages={messages}
                  onSend={onSend}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
