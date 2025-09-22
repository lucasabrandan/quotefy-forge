/// <reference types="vite/client" />

declare global {
  interface Window {
    html2canvas: any;
    jspdf: any;
  }
}
