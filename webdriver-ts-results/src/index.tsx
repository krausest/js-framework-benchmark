import React from "react";
import App from "./App.tsx";
import { createRoot } from "react-dom/client";

import "./index.css";
import "./assets/styles/global.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
