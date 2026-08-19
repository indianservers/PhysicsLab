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
import "./i18n";
import { registerSW } from "virtual:pwa-register";

registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
