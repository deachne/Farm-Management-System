/**
 * CSS Mapping Utility
 * 
 * This file provides mappings between LibreChat's CSS classes and our unified design system,
 * making it easier to adapt LibreChat components to match AnythingLLM's styling.
 */

import React from 'react';

/**
 * Maps LibreChat CSS classes to AnythingLLM design system classes
 */
export const libreChatToAnythingLLM: Record<string, string> = {
  // Background colors
  'bg-surface-primary': 'bg-theme-bg-primary',
  'bg-surface-secondary': 'bg-theme-bg-secondary',
  'bg-surface-tertiary': 'bg-theme-bg-chat-input',
  'bg-token-surface-primary': 'bg-theme-bg-primary',
  'bg-token-surface-secondary': 'bg-theme-bg-secondary',
  'bg-token-surface-tertiary': 'bg-theme-bg-chat-input',
  
  // Text colors
  'text-token-text-primary': 'text-theme-text-primary',
  'text-token-text-secondary': 'text-theme-text-secondary',
  'text-token-text-tertiary': 'text-theme-text-secondary',
  'text-primary': 'text-theme-text-primary',
  'text-secondary': 'text-theme-text-secondary',
  'text-tertiary': 'text-theme-text-secondary',
  
  // Border colors
  'border-token-border-light': 'border-theme-sidebar-border',
  'border-token-border-medium': 'border-theme-modal-border',
  'border-token-border-heavy': 'border-theme-modal-border',
  'border-light': 'border-theme-sidebar-border',
  'border-medium': 'border-theme-modal-border',
  'border-heavy': 'border-theme-modal-border',
  
  // Button colors
  'bg-token-primary': 'bg-theme-button-primary',
  'hover:bg-token-primary-hover': 'hover:bg-theme-button-primary-hover',
  'bg-primary': 'bg-theme-button-primary',
  'hover:bg-primary-hover': 'hover:bg-theme-button-primary-hover',
  
  // Focus states
  'focus:ring-token-primary': 'focus:ring-theme-accent-primary',
  'focus:border-token-primary': 'focus:border-theme-accent-primary',
  
  // Status colors
  'bg-token-success': 'bg-theme-status-success',
  'bg-token-error': 'bg-theme-status-error',
  'bg-token-warning': 'bg-theme-status-warning',
  'bg-token-info': 'bg-theme-status-info',
  'text-token-success': 'text-theme-status-success',
  'text-token-error': 'text-theme-status-error',
  'text-token-warning': 'text-theme-status-warning',
  'text-token-info': 'text-theme-status-info',
  
  // Input styles
  'bg-token-input-bg': 'bg-theme-bg-chat-input',
  'border-token-input-border': 'border-theme-chat-input-border',
  
  // Fixed color overrides
  'text-white': 'text-white',
  'text-black': 'text-black',
  'bg-white': 'bg-white',
  'bg-black': 'bg-black',
  
  // Common component patterns
  'rounded-lg': 'rounded-md',
  'shadow-lg': 'shadow-md',
  'px-4 py-2': 'px-4 py-2',
  'px-3 py-1.5': 'px-3 py-1.5',
};

/**
 * Maps AnythingLLM design system CSS variables to LibreChat CSS variables
 */
export const cssVariableMapping: Record<string, string> = {
  // Background colors
  '--surface-primary': 'var(--theme-bg-primary)',
  '--surface-secondary': 'var(--theme-bg-secondary)',
  '--surface-tertiary': 'var(--theme-bg-chat-input)',
  
  // Text colors
  '--text-primary': 'var(--theme-text-primary)',
  '--text-secondary': 'var(--theme-text-secondary)',
  '--text-tertiary': 'var(--theme-text-secondary)',
  
  // Border colors
  '--border-light': 'var(--theme-sidebar-border)',
  '--border-medium': 'var(--theme-modal-border)',
  '--border-heavy': 'var(--theme-modal-border)',
  
  // Button colors
  '--primary': 'var(--theme-button-primary)',
  '--primary-hover': 'var(--theme-button-primary-hover)',
  
  // Status colors
  '--success': 'var(--theme-status-success)',
  '--error': 'var(--theme-status-error)',
  '--warning': 'var(--theme-status-warning)',
  '--info': 'var(--theme-status-info)',
  
  // Input styles
  '--input-bg': 'var(--theme-bg-chat-input)',
  '--input-border': 'var(--theme-chat-input-border)',
  
  // Typography
  '--font-family': 'var(--theme-font-family-sans)',
  '--font-family-mono': 'var(--theme-font-family-mono)',
};

/**
 * Applies CSS variable mappings to a given stylesheet
 * @param stylesheet The stylesheet to apply mappings to
 */
export function applyCssVariableMappings(stylesheet: CSSStyleSheet): void {
  // Get all CSS rules
  const rules = Array.from(stylesheet.cssRules);
  
  // Process each rule
  rules.forEach(rule => {
    if (rule instanceof CSSStyleRule) {
      // Get the style declaration
      const style = rule.style;
      
      // Check each property in the style declaration
      for (let i = 0; i < style.length; i++) {
        const property = style[i];
        const value = style.getPropertyValue(property);
        
        // Check if the value contains a CSS variable that needs to be mapped
        Object.entries(cssVariableMapping).forEach(([libreChatVar, anythingLLMVar]) => {
          if (value.includes(libreChatVar)) {
            // Replace the CSS variable reference
            const newValue = value.replace(
              new RegExp(`var\\(${libreChatVar}(,[^)]+)?\\)`, 'g'),
              `var(${anythingLLMVar}$1)`
            );
            style.setProperty(property, newValue);
          }
        });
      }
    }
  });
}

/**
 * Applies class mappings to a DOM node's class list
 * @param element The DOM element to apply class mappings to
 * @returns The updated element
 */
export function applyClassMappings(element: HTMLElement): HTMLElement {
  // Get the current class list
  const classes = element.className.split(' ').filter(Boolean);
  
  // Create a new class list with mappings applied
  const newClasses = classes.map(className => {
    return libreChatToAnythingLLM[className] || className;
  });
  
  // Apply the new class list
  element.className = newClasses.join(' ');
  
  // Process child nodes recursively
  Array.from(element.children).forEach(child => {
    if (child instanceof HTMLElement) {
      applyClassMappings(child);
    }
  });
  
  return element;
}

/**
 * Processes a JSX element's className prop to apply class mappings
 * @param className The className string to process
 * @returns The mapped className string
 */
export function processClassName(className?: string): string {
  if (!className) return '';
  
  // Split the className into individual classes
  return className
    .split(' ')
    .filter(Boolean)
    .map(cls => libreChatToAnythingLLM[cls] || cls)
    .join(' ');
}

/**
 * CSS and class name mapping utilities between AnythingLLM and LibreChat
 */

// Maps AnythingLLM class names to LibreChat class names for consistent styling
const CLASSNAME_MAPPING: Record<string, string> = {
  // Background colors
  'bg-theme-bg-sidebar': 'bg-surface-primary',
  'bg-theme-sidebar-item-default': 'bg-surface-primary',
  'bg-theme-sidebar-item-hover': 'bg-surface-hover',
  'bg-theme-sidebar-item-selected': 'bg-surface-primary/80',
  'bg-theme-sidebar-subitem-hover': 'bg-surface-hover',
  
  // Text colors
  'text-theme-sidebar-section-header': 'text-text-secondary',
  'text-theme-sidebar-section-header-hover': 'text-text-primary',
  'text-theme-text-secondary': 'text-text-secondary',
  'text-theme-text-primary': 'text-text-primary',
  'text-theme-badge-text': 'text-text-secondary',
  
  // Border colors
  'border-theme-sidebar-divider': 'border-border',
  
  // Badge colors
  'bg-theme-badge-bg': 'bg-accent-primary/10',
};

// Maps CSS variables between AnythingLLM and LibreChat
const CSS_VARIABLE_MAPPING: Record<string, string> = {
  '--theme-bg-sidebar': 'var(--surface-primary)',
  '--theme-sidebar-item-default': 'var(--surface-primary)',
  '--theme-sidebar-item-hover': 'var(--surface-hover)',
  '--theme-sidebar-item-selected': 'var(--surface-primary-80)',
  '--theme-sidebar-section-header': 'var(--text-secondary)',
  '--theme-text-primary': 'var(--text-primary)',
  '--theme-text-secondary': 'var(--text-secondary)',
};

/**
 * Adapts class names to work across both AnythingLLM and LibreChat
 * @param classNames - A string of class names to adapt
 * @returns Mapped class names compatible with both systems
 */
export const adaptClassNames = (classNames: string): string => {
  // Split input into individual class names
  const classes = classNames.split(/\s+/).filter(Boolean);
  
  // Process each class and apply mapping if needed
  const processedClasses = classes.map(className => {
    // Check for exact match in mapping
    if (CLASSNAME_MAPPING[className]) {
      return `${className} ${CLASSNAME_MAPPING[className]}`;
    }
    
    // Check for TailwindCSS color classes that need mapping
    // Example: 'bg-theme-bg-sidebar/80' -> 'bg-theme-bg-sidebar/80 bg-surface-primary/80'
    const colorMatch = className.match(/^(bg|text|border)-theme-[a-zA-Z0-9-]+(\/(100|95|90|80|70|60|50|40|30|20|10|5))?$/);
    if (colorMatch) {
      const baseClass = colorMatch[1] + '-theme-' + className.split(colorMatch[1] + '-theme-')[1].split('/')[0];
      const opacity = colorMatch[2] || '';
      
      if (CLASSNAME_MAPPING[baseClass]) {
        const mappedBase = CLASSNAME_MAPPING[baseClass].split(' ')[0];
        return `${className} ${mappedBase}${opacity}`;
      }
    }
    
    return className;
  });
  
  return processedClasses.join(' ');
};

/**
 * Applies CSS variable mappings to a style object
 * @param styles - Style object with AnythingLLM CSS variables
 * @returns Style object with added LibreChat CSS variables
 */
export const adaptStyleObject = (styles: React.CSSProperties): React.CSSProperties => {
  const newStyles: Record<string, any> = { ...styles };
  
  Object.entries(styles).forEach(([key, value]) => {
    if (typeof value === 'string') {
      // Check if the value references an AnythingLLM CSS variable
      Object.entries(CSS_VARIABLE_MAPPING).forEach(([anythingVar, libreVar]) => {
        if (value.includes(anythingVar)) {
          // Replace with LibreChat variable
          newStyles[key] = value.replace(new RegExp(anythingVar, 'g'), libreVar);
        }
      });
    }
  });
  
  return newStyles;
};

/**
 * Applies CSS variable mappings to a CSS string
 * @param css - CSS string with AnythingLLM CSS variables
 * @returns CSS string with added LibreChat CSS variables
 */
export const adaptCSSString = (css: string): string => {
  let adaptedCSS = css;
  
  Object.entries(CSS_VARIABLE_MAPPING).forEach(([anythingVar, libreVar]) => {
    adaptedCSS = adaptedCSS.replace(new RegExp(anythingVar, 'g'), libreVar);
  });
  
  return adaptedCSS;
};

export default {
  libreChatToAnythingLLM,
  cssVariableMapping,
  applyCssVariableMappings,
  applyClassMappings,
  processClassName,
  adaptClassNames,
  adaptStyleObject,
  adaptCSSString,
}; 