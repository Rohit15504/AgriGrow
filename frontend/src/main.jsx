import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext"; // Import this
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        {" "}
        {/* Wrap your App */}
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
