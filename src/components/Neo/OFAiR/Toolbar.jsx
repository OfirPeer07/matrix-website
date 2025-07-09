import React from "react";
import "./Toolbar.css";

export default function Toolbar({ targetRef }) {
  const execCmd = (command, value = null) => {
    if (targetRef?.current) {
      targetRef.current.focus();
      document.execCommand(command, false, value);
    }
  };

  return (
    <div className="toolbar">
      <button onClick={() => execCmd("bold")} title="Bold"><b>B</b></button>
      <button onClick={() => execCmd("italic")} title="Italic"><i>I</i></button>
      <button onClick={() => execCmd("underline")} title="Underline"><u>U</u></button>
      <button onClick={() => execCmd("strikeThrough")} title="Strike">S̶</button>
      <button onClick={() => execCmd("undo")} title="Undo">↺</button>
      <button onClick={() => execCmd("redo")} title="Redo">↻</button>
      <select onChange={(e) => execCmd("fontName", e.target.value)} defaultValue="">
        <option value="" disabled>פונט</option>
        <option value="Arial">Arial</option>
        <option value="Courier New">Courier New</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Verdana">Verdana</option>
      </select>
      <select onChange={(e) => execCmd("fontSize", e.target.value)} defaultValue="">
        <option value="" disabled>גודל</option>
        {[1, 2, 3, 4, 5, 6, 7].map(size => (
          <option key={size} value={size}>{size}</option>
        ))}
      </select>
      <input type="color" onChange={(e) => execCmd("foreColor", e.target.value)} title="Font Color" />
      <input type="color" onChange={(e) => execCmd("backColor", e.target.value)} title="Background Color" />
      <button onClick={() => execCmd("justifyLeft")} title="Align Left">⇤</button>
      <button onClick={() => execCmd("justifyCenter")} title="Align Center">↔</button>
      <button onClick={() => execCmd("justifyRight")} title="Align Right">⇥</button>
      <button onClick={() => execCmd("removeFormat")} title="Clear Formatting">✖</button>
    </div>
  );
}
