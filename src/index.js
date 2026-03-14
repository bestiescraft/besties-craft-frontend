import React from "react";
import ReactDOM from "react-dom/client";
// ✅ FIX 1: Removed all @fontsource imports — they were loading 8 font files
// blocking the first render. Fonts are now handled in index.html via
// media="print" trick (already there) which is non-blocking.
import "@/index.css";
import App from "@/App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);