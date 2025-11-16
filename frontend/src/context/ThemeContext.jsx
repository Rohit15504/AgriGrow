import React, { createContext, useState, useContext, useEffect } from "react";

// Create the context
const ThemeContext = createContext();

// Create the provider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light"); // Default to dark mode

  // This effect applies the theme to the <body> tag
  useEffect(() => {
    document.body.className = ""; // Clear existing classes
    document.body.classList.add(theme + "-mode");
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Create a custom hook to use the context easily
export const useTheme = () => useContext(ThemeContext);
