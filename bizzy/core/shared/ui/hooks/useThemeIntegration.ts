import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

export interface ThemeIntegrationResult {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isLoading: boolean;
}

export const useThemeIntegration = (): ThemeIntegrationResult => {
  const [theme, setThemeState] = useState<Theme>('system');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize theme from localStorage or user preferences
  useEffect(() => {
    const initializeTheme = () => {
      setIsLoading(true);
      try {
        // Try to get theme from localStorage - first AnythingLLM, then LibreChat
        const anythingLLMTheme = localStorage.getItem('theme');
        const libreChatTheme = localStorage.getItem('theme-preference');
        
        // If either has a theme set, use it
        if (anythingLLMTheme && ['light', 'dark', 'system'].includes(anythingLLMTheme)) {
          setThemeState(anythingLLMTheme as Theme);
        } else if (libreChatTheme && ['light', 'dark', 'system'].includes(libreChatTheme)) {
          setThemeState(libreChatTheme as Theme);
        } else {
          // If no theme is set, use system preference
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          setThemeState(prefersDark ? 'dark' : 'light');
        }
      } catch (error) {
        console.error('Failed to initialize theme:', error);
        // Default to system theme if error occurs
        setThemeState('system');
      } finally {
        setIsLoading(false);
      }
    };

    initializeTheme();
  }, []);

  // Update both AnythingLLM and LibreChat themes when the theme changes
  const setTheme = (newTheme: Theme) => {
    try {
      // Update localStorage for both systems
      localStorage.setItem('theme', newTheme);
      localStorage.setItem('theme-preference', newTheme);
      
      // Update state
      setThemeState(newTheme);
      
      // Update document classes for immediate visual feedback
      if (newTheme === 'dark' || (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
      
      // Dispatch events to notify other components about theme change
      window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: newTheme } }));
    } catch (error) {
      console.error('Failed to set theme:', error);
    }
  };

  return { theme, setTheme, isLoading };
};

export default useThemeIntegration; 