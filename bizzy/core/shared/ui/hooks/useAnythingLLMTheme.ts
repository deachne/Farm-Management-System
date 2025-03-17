import { useState, useEffect } from 'react';

/**
 * Hook to access AnythingLLM's theme settings
 * This provides a unified way to access theme information across components
 */
export function useAnythingLLMTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Initial theme detection
    const detectTheme = () => {
      // Check for theme in localStorage (AnythingLLM stores theme preference there)
      const storedTheme = localStorage.getItem('app-theme');
      if (storedTheme === 'light' || storedTheme === 'dark') {
        setTheme(storedTheme);
        return;
      }

      // Check for system preference if no stored preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
      } else {
        setTheme('light');
      }
    };

    // Detect theme on mount
    detectTheme();

    // Set up listener for theme changes in localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'app-theme' && (e.newValue === 'light' || e.newValue === 'dark')) {
        setTheme(e.newValue);
      }
    };

    // Set up listener for system theme changes
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('app-theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    // Add event listeners
    window.addEventListener('storage', handleStorageChange);
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleSystemThemeChange);

    // Clean up event listeners
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  // Function to toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('app-theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  };
} 