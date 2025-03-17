/**
 * Theme Integration Utility
 * 
 * This file handles theme synchronization between AnythingLLM and LibreChat.
 * It ensures that both systems use the same theme (dark/light) and applies
 * the appropriate CSS variables.
 */

import { applyDesignTokensToDocument } from './design-tokens';
import { applyCssVariableMappings, cssVariableMapping } from './css-mapping';

/**
 * Theme mode options
 */
export type ThemeMode = 'dark' | 'light' | 'system';

/**
 * Gets the current theme mode from AnythingLLM
 */
export function getCurrentTheme(): ThemeMode {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return 'dark';
  }

  // Try to get the theme from localStorage (AnythingLLM stores it there)
  const storedTheme = localStorage.getItem('app-theme');
  
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }
  
  // If no theme is stored, or it's set to 'system', check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  
  // Default to dark mode
  return 'dark';
}

/**
 * Sets the theme mode in both AnythingLLM and LibreChat
 * @param theme The theme mode to set
 */
export function setThemeMode(theme: ThemeMode): void {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return;
  }
  
  // Store in localStorage for AnythingLLM
  localStorage.setItem('app-theme', theme);
  
  // Set data attribute on document for CSS targeting
  document.documentElement.dataset.theme = theme;
  
  // Apply appropriate class to body
  if (theme === 'system') {
    // For system mode, check system preference
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
      
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${systemTheme}-theme`);
  } else {
    // For explicit theme choice
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${theme}-theme`);
  }
  
  // Dispatch event for other components to respond to theme change
  window.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme } }));
}

/**
 * Initializes theme integration between AnythingLLM and LibreChat
 */
export function initializeTheming(): () => void {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return () => {};
  }
  
  // Apply design tokens to the document
  const styleElement = applyDesignTokensToDocument(document);
  
  // Get current theme and apply it
  const currentTheme = getCurrentTheme();
  setThemeMode(currentTheme);
  
  // Apply CSS variable mappings to all stylesheets
  Array.from(document.styleSheets).forEach(stylesheet => {
    try {
      applyCssVariableMappings(stylesheet);
    } catch (error) {
      // Some stylesheets may be from different origins and can't be accessed
      console.warn('Could not process stylesheet:', error);
    }
  });
  
  // Set up listener for system theme changes
  const systemThemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const systemThemeListener = (e: MediaQueryListEvent) => {
    const currentTheme = getCurrentTheme();
    if (currentTheme === 'system') {
      setThemeMode('system');
    }
  };
  
  systemThemeMediaQuery.addEventListener('change', systemThemeListener);
  
  // Set up observer to detect when AnythingLLM changes the theme
  // This watches for class changes on the body element
  const bodyObserver = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'class'
      ) {
        // Extract theme from body classes
        const bodyClasses = document.body.className;
        if (bodyClasses.includes('light')) {
          localStorage.setItem('app-theme', 'light');
          document.documentElement.dataset.theme = 'light';
        } else if (bodyClasses.includes('dark')) {
          localStorage.setItem('app-theme', 'dark');
          document.documentElement.dataset.theme = 'dark';
        }
      }
    });
  });
  
  bodyObserver.observe(document.body, { 
    attributes: true, 
    attributeFilter: ['class'] 
  });
  
  // Return cleanup function
  return () => {
    // Remove event listeners
    systemThemeMediaQuery.removeEventListener('change', systemThemeListener);
    
    // Disconnect observer
    bodyObserver.disconnect();
    
    // Remove style element
    if (styleElement && styleElement.parentNode) {
      styleElement.parentNode.removeChild(styleElement);
    }
  };
}

/**
 * Creates CSS that applies the current theme's variables to LibreChat elements
 */
export function createThemeSyncStyles(): string {
  return `
    /* LibreChat -> AnythingLLM CSS Variable Mapping */
    :root {
      ${Object.entries(cssVariableMapping)
        .map(([libreChatVar, anythingLLMVar]) => `${libreChatVar}: ${anythingLLMVar};`)
        .join('\n      ')}
    }
    
    /* Ensure LibreChat components use our theme */
    [data-theme="dark"] .libre-chat-component {
      color-scheme: dark;
    }
    
    [data-theme="light"] .libre-chat-component {
      color-scheme: light;
    }
  `;
}

export default {
  getCurrentTheme,
  setThemeMode,
  initializeTheming,
  createThemeSyncStyles,
}; 