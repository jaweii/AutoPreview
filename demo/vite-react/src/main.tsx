import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import initAutoPreviewForReact from "autopreview/react";

initAutoPreviewForReact("#root");

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
