// src/setupTests.js

// Polyfills ל־TextEncoder/TextDecoder (ספריות כמו jsPDF/fast-png דורשות)
import { TextEncoder, TextDecoder } from 'util';
if (!global.TextEncoder) global.TextEncoder = TextEncoder;
if (!global.TextDecoder) global.TextDecoder = TextDecoder;

// Mock ל-canvas context
if (!HTMLCanvasElement.prototype.getContext) {
  HTMLCanvasElement.prototype.getContext = () => ({});
}

// מאפשר בדיקות שמצפות ל-reload בלי להפיל את Node
Object.defineProperty(window, 'location', {
  value: { reload: jest.fn() },
  writable: true,
});

// Mock לספריות כבדות שנמשכות בעקיפין
jest.mock('jspdf', () => {
  return function MockJsPDF() {
    return { addImage: jest.fn(), save: jest.fn() };
  };
});
jest.mock('html2canvas', () => jest.fn(() => Promise.resolve({ toDataURL: () => '' })));
