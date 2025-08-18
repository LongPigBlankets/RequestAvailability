import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

console.log("[main] loaded"); // should appear in console

try {
  const rootEl = document.getElementById("root");
  if (!rootEl) throw new Error("#root not found");
  createRoot(rootEl).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("[main] rendered");
} catch (e) {
  console.error("[main] render failed:", e);
}