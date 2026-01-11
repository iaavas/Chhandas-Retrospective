import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n";
import App from "./App.tsx";
import { Analytics } from "@vercel/analytics/react";
import { registerSW } from "virtual:pwa-register";

// Register service worker for PWA offline support
const updateSW = registerSW({
  onNeedRefresh() {
    // When a new version is available, update automatically
    updateSW(true);
  },
  onOfflineReady() {
    console.log("छन्द Retrospective is ready to work offline!");
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <Analytics />
  </StrictMode>
);
