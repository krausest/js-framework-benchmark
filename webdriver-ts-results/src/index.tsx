import React from "react";
import App from "./App";
import { createRoot } from "react-dom/client";

window.onload = () => {
  const root = createRoot(document.getElementById("root")!);

  root.render(<App />);
};
