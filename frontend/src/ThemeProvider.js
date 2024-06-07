import React, { createContext, useState } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkTheme, setDarkTheme] = useState(() => {
    const savedTheme = localStorage.getItem('darkTheme');
    return savedTheme !== null ? JSON.parse(savedTheme) : false;
  });

  const toggleTheme = () => {
    setDarkTheme(prevTheme => {
      const newTheme = !prevTheme;
      localStorage.setItem('darkTheme', JSON.stringify(newTheme));
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ darkTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
