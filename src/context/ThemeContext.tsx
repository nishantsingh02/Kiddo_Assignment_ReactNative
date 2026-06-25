import React, { createContext, useContext, useMemo } from 'react';
import type { ThemeConfig } from '../types/payload.types';

export const DEFAULT_THEME: ThemeConfig = {
  primary: '#008080',
  primaryLight: '#E0F2F2',
  accent: '#E4B8AD',
  dark: '#202020',
  surface: '#FFFFFF',
  background: '#F5F5F5',
  backgroundWarm: '#FFF5F0',
  border: '#E8E8E8',
  textPrimary: '#202020',
  textSecondary: '#757575',
  textDisabled: '#BDBDBD',
  error: '#D32F2F',
  success: '#2E7D32',
  warning: '#F57C00',
  starRating: '#FFB300',
  borderRadius: 12,
  fontScale: 1.0,
  fontFamily: 'System',
};

const ThemeContext = createContext<ThemeConfig>(DEFAULT_THEME);

interface Props {
  theme: Partial<ThemeConfig>;
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<Props> = ({ theme, children }) => {
  // Merge server theme over defaults — missing keys fall back gracefully
  const resolvedTheme = useMemo<ThemeConfig>(
    () => ({ ...DEFAULT_THEME, ...theme }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={resolvedTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeConfig => useContext(ThemeContext);
