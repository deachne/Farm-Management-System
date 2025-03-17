/**
 * BizzyPerson Unified Design System
 * 
 * This file exports all components and utilities for the unified design system.
 * It serves as the main entry point for importing design system elements.
 */
import React from 'react';
import designTokens from './design-tokens';
import cssMapping from './css-mapping';
import themeIntegration, { initializeTheming } from './theme-integration';
import LibreChatAdapter, { withAnythingLLMStyling } from './LibreChatAdapter';
import Button from './components/Button';

// Re-export everything from the modules
export { default as designTokens } from './design-tokens';
export * from './design-tokens';

export { default as cssMapping } from './css-mapping';
export * from './css-mapping';

export { default as themeIntegration } from './theme-integration';
export * from './theme-integration';

export { default as LibreChatAdapter } from './LibreChatAdapter';
export * from './LibreChatAdapter';

export { default as Button } from './components/Button';
export * from './components/Button';

// Shadcn UI Components (Re-exports)
// These would be imported from your Shadcn UI setup
// export { Button as ShadcnButton } from './shadcn/button';
// export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './shadcn/card';
// export { Input as ShadcnInput } from './shadcn/input';
// ... etc.

/**
 * Initializes the unified design system
 * This is the main function to call when setting up the design system
 */
export function initializeDesignSystem(): () => void {
  // Apply design tokens to the document
  // Initialize theme integration
  // Set up CSS variable mappings
  // Any other initialization needed
  
  // Apply the theme integration
  const cleanup = initializeTheming();
  
  // Return a cleanup function
  return cleanup;
}

/**
 * Higher-order function for styling components with the design system
 * This is a convenience function that combines several utilities
 */
export function applyDesignSystem<T extends {}>(Component: React.ComponentType<T>): React.ComponentType<T> {
  // Apply the HOC to the component
  return withAnythingLLMStyling(Component);
}

/**
 * Creates a design system styled version of a component
 * This is useful for creating styled versions of third-party components
 */
export function createStyledComponent<T extends { className?: string }>(
  Component: React.ComponentType<T>,
  defaultProps?: Partial<T>
): React.ComponentType<T> {
  // Create a styled version of the component that forwards refs
  const StyledComponent = (props: T, ref: React.Ref<unknown>) => {
    // Merge default props with provided props
    const mergedProps = { ...defaultProps, ...props };
    
    // We need to cast the ref to any to avoid TypeScript errors
    return React.createElement(Component, { ...mergedProps, ref });
  };
  
  // Create a forwardRef component
  const ForwardRefComponent = React.forwardRef(StyledComponent);
  
  // Set display name for debugging
  const displayName = Component.displayName || Component.name || 'Component';
  ForwardRefComponent.displayName = `Styled(${displayName})`;
  
  // Apply design system styling
  return applyDesignSystem(ForwardRefComponent);
}

// Default export for convenience
export default {
  designTokens,
  cssMapping,
  themeIntegration,
  LibreChatAdapter,
  Button,
  initializeDesignSystem,
  applyDesignSystem,
  createStyledComponent,
}; 