import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";
import "./pro-lab.css";
import "./pro-lab-assets.css";
import "./pro-lab-program.css";
import "./rocket-parts.css";
import "./client-demos.css";
import "./menu-enhancements.css";
import "./app-directory.css";
import "./concept-experiences.css";
import "./navigation-minimal.css";
import "./missed-pages-fit.css";
import "./i18n";
import { registerSW } from "virtual:pwa-register";

if (import.meta.env.PROD) {
  registerSW({ immediate: true });
} else if ("serviceWorker" in navigator) {
  // Local design reviews must always render the current source, never a stale PWA shell.
  navigator.serviceWorker.getRegistrations().then((registrations) => registrations.forEach((registration) => registration.unregister()));
  if ("caches" in window) caches.keys().then((keys) => keys.forEach((key) => caches.delete(key)));
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
