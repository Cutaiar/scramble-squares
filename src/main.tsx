import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RGLApp } from "./RGLApp.tsx";
import { App } from "./App.tsx";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RGLApp />
    <App />
  </React.StrictMode>
);
