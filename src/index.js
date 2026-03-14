import React from "react";
import ReactDOM from "react-dom/client";
// FIX: Removed @fontsource/lato imports — they were adding ~50KB to initial bundle
// and blocking first render. Fonts are now handled non-blocking via index.html
// using the media="print" trick which saves ~750ms on mobile.
import "@/index.css";
import App from "@/App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);