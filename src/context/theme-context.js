import { createContext, useCallback, useState } from "react";

export const ThemeContext = createContext({
  theme: "light",
});

const ThemeContextProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const toggleTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme, setTheme]);
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;
