import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

console.log("[main] loaded");

const el = document.getElementById("root");
if (!el) {
  console.error("[main] #root not found");
} else {
  createRoot(el).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("[main] rendered");
}
