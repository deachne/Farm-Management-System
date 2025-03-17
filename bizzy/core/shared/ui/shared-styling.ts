/**
 * Shared Styling Module
 * 
 * This module provides shared styling utilities for adapting LibreChat UI components
 * to match AnythingLLM's design system. It includes common CSS classes, utility functions,
 * and theme mappings.
 */

/**
 * Shared CSS classes based on AnythingLLM's design system
 */
export const sharedClasses = {
  // Chat bubble styling
  chatBubble: 'flex justify-center items-end w-full bg-theme-bg-secondary',
  chatBubbleContainer: 'py-8 px-4 w-full flex gap-x-5 md:max-w-[80%] flex-col',
  chatBubbleContent: 'markdown whitespace-pre-line text-white font-normal text-sm md:text-sm flex flex-col gap-y-1 mt-2',
  
  // Input styling
  chatForm: 'mx-auto flex flex-row gap-3 pl-2 transition-all duration-200 last:mb-2',
  chatInput: 'w-full resize-none py-[13px] bg-theme-bg-chat-input placeholder-black/50 dark:placeholder-white/50',
  chatInputBorder: 'border border-theme-chat-input-border rounded-3xl',
  
  // Button styling
  sendButton: 'p-1 rounded-md text-white hover:bg-theme-button-primary-hover',
  actionButton: 'p-2 rounded-md text-white hover:bg-theme-button-primary-hover',
  
  // Modal styling
  modal: 'bg-theme-bg-primary border border-theme-modal-border rounded-lg',
  modalHeader: 'text-white font-semibold text-lg',
  modalContent: 'text-white',
  
  // Dropdown styling
  dropdown: 'bg-theme-action-menu-bg border border-theme-sidebar-border rounded-lg',
  dropdownItem: 'text-white hover:bg-theme-action-menu-item-hover',
  
  // General UI elements
  card: 'bg-theme-bg-secondary border border-theme-sidebar-border rounded-lg',
  container: 'bg-theme-bg-container',
  text: 'text-white',
  textSecondary: 'text-white/60',
};

/**
 * Maps LibreChat's CSS classes to AnythingLLM's design system
 */
export const mapLibreChatToAnythingLLM = {
  // Text colors
  'text-text-primary': 'text-white',
  'text-token-text-secondary': 'text-white/60',
  
  // Background colors
  'bg-surface-primary': 'bg-theme-bg-primary',
  'bg-surface-secondary': 'bg-theme-bg-secondary',
  'bg-surface-tertiary': 'bg-theme-bg-chat-input',
  
  // Border colors
  'border-border-light': 'border-theme-sidebar-border',
  'border-border-medium': 'border-theme-sidebar-border',
  'border-border-heavy': 'border-theme-modal-border',
  
  // Button colors
  'bg-primary': 'bg-theme-button-primary',
  'hover:bg-primary-hover': 'hover:bg-theme-button-primary-hover',
  
  // Input colors
  'bg-input': 'bg-theme-bg-chat-input',
  'border-input': 'border-theme-chat-input-border',
};

/**
 * CSS variables mapping from LibreChat to AnythingLLM
 */
export const cssVariableMapping = {
  // Background colors
  '--surface-primary': 'var(--theme-bg-primary)',
  '--surface-secondary': 'var(--theme-bg-secondary)',
  '--surface-tertiary': 'var(--theme-bg-chat-input)',
  
  // Text colors
  '--text-primary': 'var(--theme-text-primary)',
  '--text-secondary': 'var(--theme-text-secondary)',
  
  // Border colors
  '--border-light': 'var(--theme-sidebar-border)',
  '--border-medium': 'var(--theme-sidebar-border)',
  '--border-heavy': 'var(--theme-modal-border)',
  
  // Button colors
  '--primary': 'var(--theme-button-primary)',
  '--primary-hover': 'var(--theme-button-primary-hover)',
};

/**
 * Utility function to apply AnythingLLM styling to LibreChat components
 * @param originalClasses - The original CSS classes from LibreChat
 * @returns The mapped CSS classes for AnythingLLM
 */
export function applyAnythingLLMStyling(originalClasses: string): string {
  let result = originalClasses;
  
  // Replace LibreChat classes with AnythingLLM classes
  Object.entries(mapLibreChatToAnythingLLM).forEach(([libreChatClass, anythingLLMClass]) => {
    result = result.replace(new RegExp(libreChatClass, 'g'), anythingLLMClass);
  });
  
  return result;
}

/**
 * Theme configuration for light and dark modes
 */
export const themeConfig = {
  light: {
    '--theme-bg-primary': '#ffffff',
    '--theme-bg-secondary': '#ffffff',
    '--theme-bg-sidebar': '#edf2fa',
    '--theme-bg-container': '#f9fbfd',
    '--theme-bg-chat': '#ffffff',
    '--theme-bg-chat-input': '#eaeaea',
    '--theme-text-primary': '#0e0f0f',
    '--theme-text-secondary': '#7a7d7e',
    '--theme-sidebar-border': '#d3d4d4',
    '--theme-chat-input-border': '#cccccc',
    '--theme-button-primary': '#0ba5ec',
    '--theme-button-primary-hover': '#dedede',
    '--theme-modal-border': '#d3d3d3',
  },
  dark: {
    '--theme-bg-primary': '#0e0f0f',
    '--theme-bg-secondary': '#1b1b1e',
    '--theme-bg-sidebar': '#0e0f0f',
    '--theme-bg-container': '#0e0f0f',
    '--theme-bg-chat': '#1b1b1e',
    '--theme-bg-chat-input': '#27282a',
    '--theme-text-primary': '#ffffff',
    '--theme-text-secondary': 'rgba(255, 255, 255, 0.6)',
    '--theme-sidebar-border': 'rgba(255, 255, 255, 0.1)',
    '--theme-chat-input-border': '#525355',
    '--theme-button-primary': '#46c8ff',
    '--theme-button-primary-hover': '#434343',
    '--theme-modal-border': '#3f3f42',
  },
};

/**
 * Apply theme variables to the document
 * @param theme - The theme to apply ('light' or 'dark')
 */
export function applyTheme(theme: 'light' | 'dark'): void {
  const root = document.documentElement;
  const themeVars = themeConfig[theme];
  
  Object.entries(themeVars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  
  // Apply CSS variable mappings
  Object.entries(cssVariableMapping).forEach(([libreChatVar, anythingLLMVar]) => {
    const computedValue = getComputedStyle(root).getPropertyValue(anythingLLMVar);
    root.style.setProperty(libreChatVar, computedValue);
  });
} 