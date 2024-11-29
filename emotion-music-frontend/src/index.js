// index.js
import React from "react";
import ReactDOM from "react-dom";
import App1 from "./App1"; // Importing App1.js
import "./App.css"; // Importing the CSS

const rootElement = document.getElementById("root");

ReactDOM.render(
  <React.StrictMode>
    <App1 />
  </React.StrictMode>,
  rootElement
);
