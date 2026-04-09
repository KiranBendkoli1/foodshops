import { createContext, useCallback, useEffect, useState } from "react";

export const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
});

const ThemeContextProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Initialize from localStorage or default to light
    return localStorage.getItem("theme") || "light";
  });

  // Apply theme to root element and persist
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;
