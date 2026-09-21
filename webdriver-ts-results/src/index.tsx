import React from "react";
import App from "./App.tsx";
import { createRoot } from "react-dom/client";
import { ConfigProvider } from "antd";

import "./index.css";
import "./assets/styles/global.css";

createRoot(document.querySelector("#root")!).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#146653",
          colorText: "#142b38",
          colorTextSecondary: "#53636a",
          colorBorder: "#dfe4df",
          borderRadius: 6,
          controlHeight: 36,
          fontSize: 13,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
