/**
 * CSS Mapping Utility
 * 
 * This file provides mappings between LibreChat's CSS classes and our unified design system,
 * making it easier to adapt LibreChat components to match AnythingLLM's styling.
 */

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

export default {
  libreChatToAnythingLLM,
  cssVariableMapping,
  applyCssVariableMappings,
  applyClassMappings,
  processClassName,
}; 