import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext"; // Import the hook

function Header() {
  const { theme, toggleTheme } = useTheme(); // Use the hook

  return (
    <header className="header">
      <Link to="/" className="header-title">
        Agri<span>Grow</span> 🌿
      </Link>
      <button onClick={toggleTheme} className="theme-toggle">
        {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
      </button>
    </header>
  );
}

export default Header;
