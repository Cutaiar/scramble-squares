import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { SwapyApp } from "./SwapyApp.tsx";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SwapyApp />
  </React.StrictMode>
);
