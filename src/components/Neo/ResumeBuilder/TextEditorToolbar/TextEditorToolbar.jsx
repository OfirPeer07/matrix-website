import React from 'react';
import './TextEditorToolbar.css';

export default function TextEditorToolbar({ onCommand }) {
  return (
    <div className="text-editor-toolbar">
      <button type="button" onClick={() => onCommand('bold')} aria-label="Bold"><b>B</b></button>
      <button type="button" onClick={() => onCommand('italic')} aria-label="Italic"><i>I</i></button>
      <button type="button" onClick={() => onCommand('underline')} aria-label="Underline"><u>U</u></button>

      <select onChange={(e) => onCommand('fontSizeCustom', e.target.value)} defaultValue="">
        <option value="" disabled>Font Size</option>
        {Array.from({ length: 145 }, (_, i) => (0.5 + i * 0.5).toFixed(1)).map(size => (
          <option key={size} value={size}>{size}px</option>
        ))}
      </select>

      <select onChange={(e) => onCommand('fontName', e.target.value)} defaultValue="">
        <option value="" disabled>Font Family</option>
        {['Arial', 'Courier New', 'Georgia', 'Tahoma', 'Times New Roman', 'Verdana'].map(font => (
          <option key={font} value={font}>{font}</option>
        ))}
      </select>
    </div>
  );
}
