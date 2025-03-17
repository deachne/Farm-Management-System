import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names using clsx and tailwind-merge
 * This ensures that tailwind classes are properly merged without conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Maps LibreChat theme classes to AnythingLLM theme classes
 * This helps maintain consistent styling when adapting components
 */
export const themeClassMap = {
  // Background colors
  'bg-white': 'bg-white dark:bg-gray-800',
  'bg-gray-50': 'bg-gray-50 dark:bg-gray-900',
  'bg-gray-100': 'bg-gray-100 dark:bg-gray-800',
  'bg-gray-200': 'bg-gray-200 dark:bg-gray-700',
  
  // Text colors
  'text-black': 'text-gray-900 dark:text-white',
  'text-gray-500': 'text-gray-500 dark:text-gray-400',
  'text-gray-700': 'text-gray-700 dark:text-gray-300',
  
  // Border colors
  'border-gray-200': 'border-gray-200 dark:border-gray-700',
  'border-gray-300': 'border-gray-300 dark:border-gray-600',
  
  // Button styles
  'btn-primary': 'bg-blue-600 hover:bg-blue-700 text-white',
  'btn-secondary': 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600',
  
  // Input styles
  'input-primary': 'border border-gray-300 dark:border-gray-600 rounded-md',
};

/**
 * CSS variables for AnythingLLM theme
 * These can be applied to components to ensure consistent styling
 */
export const themeVariables = {
  light: {
    '--primary-color': '#2563eb',
    '--primary-hover-color': '#1d4ed8',
    '--background-color': '#ffffff',
    '--secondary-background-color': '#f9fafb',
    '--text-color': '#111827',
    '--secondary-text-color': '#4b5563',
    '--border-color': '#e5e7eb',
  },
  dark: {
    '--primary-color': '#3b82f6',
    '--primary-hover-color': '#2563eb',
    '--background-color': '#111827',
    '--secondary-background-color': '#1f2937',
    '--text-color': '#f9fafb',
    '--secondary-text-color': '#d1d5db',
    '--border-color': '#374151',
  },
};

/**
 * Applies AnythingLLM theme variables to an element
 */
export function applyThemeVariables(element: HTMLElement, theme: 'light' | 'dark') {
  const variables = themeVariables[theme];
  Object.entries(variables).forEach(([key, value]) => {
    element.style.setProperty(key, value);
  });
}

/**
 * Maps a LibreChat class to an AnythingLLM class
 */
export function mapClass(libreChatClass: string): string {
  return themeClassMap[libreChatClass] || libreChatClass;
}

/**
 * Maps multiple LibreChat classes to AnythingLLM classes
 */
export function mapClasses(libreChatClasses: string): string {
  return libreChatClasses
    .split(' ')
    .map(cls => mapClass(cls))
    .join(' ');
} 