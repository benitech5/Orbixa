import React, { createContext, useContext, useState } from 'react';

interface Theme {
  background: string;
  text: string;
  textSecondary: string;
  accent: string;
  primary: string;
  cardBackground: string;
  border: string;
  subtext: string;
  card: string;
}

const lightTheme: Theme = {
  background: '#FFFFFF',
  text: '#000000',
  textSecondary: '#666666',
  accent: '#007AFF',
  primary: '#007AFF',
  cardBackground: '#F2F2F7',
  border: '#E5E5EA',
  subtext: '#8E8E93',
  card: '#F2F2F7',
};

const darkTheme: Theme = {
  background: '#000000',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  accent: '#0A84FF',
  primary: '#0A84FF',
  cardBackground: '#1C1C1E',
  border: '#38383A',
  subtext: '#8E8E93',
  card: '#1C1C1E',
};

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  
  const theme = isDark ? darkTheme : lightTheme;
  
  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 