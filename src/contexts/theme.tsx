"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ColorTheme, getColorConfig, getThemeByName, getAllThemes, applyTheme } from '@/lib/colors';

interface ThemeContextType {
  currentTheme: ColorTheme | null;
  themeName: string;
  setTheme: (themeName: string) => void;
  availableThemes: Record<string, ColorTheme>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState<string>('');
  const [currentTheme, setCurrentTheme] = useState<ColorTheme | null>(null);

  const availableThemes = getAllThemes();

  const setTheme = (newThemeName: string) => {
    console.log('ThemeProvider setTheme called with:', newThemeName);
    const theme = getThemeByName(newThemeName);
    console.log('Found theme:', theme);
    
    if (theme) {
      setThemeName(newThemeName);
      setCurrentTheme(theme);
      
      // 保存到localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('selectedTheme', newThemeName);
        console.log('Saved to localStorage:', newThemeName);
      }
      
      // 应用CSS变量，传入主题key
      applyTheme(theme, newThemeName);
      console.log('Applied theme:', newThemeName);
    } else {
      console.error('Theme not found:', newThemeName);
    }
  };

  // 初始化时优先读取localStorage，然后读取JSON配置
  useEffect(() => {
    const initTheme = () => {
      let targetThemeName: string;
      
      // 优先从localStorage读取用户选择的主题
      if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('selectedTheme');
        if (savedTheme) {
          targetThemeName = savedTheme;
        } else {
          // 如果没有保存的主题，使用JSON配置中的默认主题
          const config = getColorConfig();
          targetThemeName = config.currentTheme;
        }
      } else {
        // 服务端渲染时使用JSON配置
        const config = getColorConfig();
        targetThemeName = config.currentTheme;
      }
      
      const targetTheme = getThemeByName(targetThemeName);
      if (targetTheme) {
        setThemeName(targetThemeName);
        setCurrentTheme(targetTheme);
        
        // 应用CSS变量，传入主题key
        applyTheme(targetTheme, targetThemeName);
      }
    };
    
    initTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      themeName,
      setTheme,
      availableThemes,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}