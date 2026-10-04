import React from "react";
import App from "./App.tsx";
import { createRoot } from "react-dom/client";

createRoot(document.querySelector("#root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
