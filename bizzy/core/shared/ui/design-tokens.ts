/**
 * BizzyPerson Unified Design System - Design Tokens
 * 
 * This file defines all design tokens for the unified design system,
 * based on AnythingLLM's UI with integrated LibreChat capabilities.
 */

/**
 * Color System Tokens
 */
export const colorTokens = {
  // Primary Colors
  bgPrimary: {
    dark: '#0e0f0f',
    light: '#ffffff',
  },
  bgSecondary: {
    dark: '#1b1b1e',
    light: '#f5f5f7',
  },
  bgSidebar: {
    dark: '#0e0f0f',
    light: '#f2f2f2',
  },
  bgContainer: {
    dark: '#0e0f0f',
    light: '#ffffff',
  },
  bgChat: {
    dark: '#1b1b1e',
    light: '#f5f5f7',
  },
  bgChatInput: {
    dark: '#27282a',
    light: '#e9e9ec',
  },
  textPrimary: {
    dark: '#ffffff',
    light: '#1b1b1e',
  },
  textSecondary: {
    dark: 'rgba(255, 255, 255, 0.6)',
    light: 'rgba(0, 0, 0, 0.6)',
  },

  // Accent Colors
  accentPrimary: '#4f6bff',
  accentSecondary: '#42bb4e',
  accentTertiary: '#ffb626',
  accentQuaternary: '#ff5c5c',

  // Status Colors
  statusSuccess: '#42bb4e',
  statusWarning: '#ffb626',
  statusError: '#ff5c5c',
  statusInfo: '#4f6bff',

  // Border Colors
  sidebarBorder: {
    dark: '#2b2c2e',
    light: '#e0e0e2',
  },
  modalBorder: {
    dark: '#3a3b3d',
    light: '#d0d0d2',
  },
  chatInputBorder: {
    dark: '#3a3b3d',
    light: '#d0d0d2',
  },

  // Button Colors
  buttonPrimary: '#4f6bff',
  buttonPrimaryHover: '#3a56e8',
  buttonSecondary: {
    dark: '#27282a',
    light: '#e9e9ec',
  },
  buttonSecondaryHover: {
    dark: '#35363a',
    light: '#dadade',
  },
};

/**
 * Typography Tokens
 */
export const typographyTokens = {
  // Font Families
  fontFamilySans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
  fontFamilyMono: "'Fira Code', 'Roboto Mono', 'Droid Sans Mono', 'MonoLisa', Consolas, monospace",

  // Font Sizes
  textXs: '0.75rem', // 12px
  textSm: '0.875rem', // 14px
  textBase: '1rem', // 16px
  textLg: '1.125rem', // 18px
  textXl: '1.25rem', // 20px
  text2xl: '1.5rem', // 24px

  // Font Weights
  fontLight: '300',
  fontNormal: '400',
  fontMedium: '500',
  fontSemibold: '600',
  fontBold: '700',

  // Line Heights
  leadingNone: '1',
  leadingTight: '1.25',
  leadingNormal: '1.5',
  leadingRelaxed: '1.75',
};

/**
 * Spacing Tokens
 */
export const spacingTokens = {
  space0: '0px',
  space1: '0.25rem', // 4px
  space2: '0.5rem', // 8px
  space3: '0.75rem', // 12px
  space4: '1rem', // 16px
  space5: '1.25rem', // 20px
  space6: '1.5rem', // 24px
  space8: '2rem', // 32px
  space10: '2.5rem', // 40px
  space12: '3rem', // 48px
  space16: '4rem', // 64px
};

/**
 * Border Radius Tokens
 */
export const borderRadiusTokens = {
  radiusSm: '0.125rem', // 2px
  radiusMd: '0.25rem', // 4px
  radiusLg: '0.5rem', // 8px
  radiusXl: '0.75rem', // 12px
  radiusFull: '9999px',
};

/**
 * Shadow Tokens
 */
export const shadowTokens = {
  shadowSm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  shadowXl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
};

/**
 * Breakpoint Tokens
 */
export const breakpointTokens = {
  breakpointSm: '640px',
  breakpointMd: '768px',
  breakpointLg: '1024px',
  breakpointXl: '1280px',
  breakpoint2xl: '1536px',
};

/**
 * Z-Index Tokens
 */
export const zIndexTokens = {
  z0: '0',
  z10: '10',
  z20: '20',
  z30: '30',
  z40: '40',
  z50: '50',
  zAuto: 'auto',
};

/**
 * Animation Tokens
 */
export const animationTokens = {
  transitionFast: '100ms',
  transitionNormal: '200ms',
  transitionSlow: '300ms',
  easeLinear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
};

/**
 * Types for design tokens
 */
export type ColorTokens = typeof colorTokens;
export type TypographyTokens = typeof typographyTokens;
export type SpacingTokens = typeof spacingTokens;
export type BorderRadiusTokens = typeof borderRadiusTokens;
export type ShadowTokens = typeof shadowTokens;
export type BreakpointTokens = typeof breakpointTokens;
export type ZIndexTokens = typeof zIndexTokens;
export type AnimationTokens = typeof animationTokens;

/**
 * Combined design tokens
 */
export const designTokens = {
  colors: colorTokens,
  typography: typographyTokens,
  spacing: spacingTokens,
  borderRadius: borderRadiusTokens,
  shadows: shadowTokens,
  breakpoints: breakpointTokens,
  zIndices: zIndexTokens,
  animations: animationTokens,
};

export type DesignTokens = typeof designTokens;

/**
 * Generate CSS variables for the design tokens
 */
export function generateCssVariables(): string {
  return `
:root {
  /* Colors - Dark Mode (Default) */
  --theme-bg-primary: ${colorTokens.bgPrimary.dark};
  --theme-bg-secondary: ${colorTokens.bgSecondary.dark};
  --theme-bg-sidebar: ${colorTokens.bgSidebar.dark};
  --theme-bg-container: ${colorTokens.bgContainer.dark};
  --theme-bg-chat: ${colorTokens.bgChat.dark};
  --theme-bg-chat-input: ${colorTokens.bgChatInput.dark};
  --theme-text-primary: ${colorTokens.textPrimary.dark};
  --theme-text-secondary: ${colorTokens.textSecondary.dark};
  
  /* Accent Colors */
  --theme-accent-primary: ${colorTokens.accentPrimary};
  --theme-accent-secondary: ${colorTokens.accentSecondary};
  --theme-accent-tertiary: ${colorTokens.accentTertiary};
  --theme-accent-quaternary: ${colorTokens.accentQuaternary};
  
  /* Status Colors */
  --theme-status-success: ${colorTokens.statusSuccess};
  --theme-status-warning: ${colorTokens.statusWarning};
  --theme-status-error: ${colorTokens.statusError};
  --theme-status-info: ${colorTokens.statusInfo};
  
  /* Border Colors */
  --theme-sidebar-border: ${colorTokens.sidebarBorder.dark};
  --theme-modal-border: ${colorTokens.modalBorder.dark};
  --theme-chat-input-border: ${colorTokens.chatInputBorder.dark};
  
  /* Button Colors */
  --theme-button-primary: ${colorTokens.buttonPrimary};
  --theme-button-primary-hover: ${colorTokens.buttonPrimaryHover};
  --theme-button-secondary: ${colorTokens.buttonSecondary.dark};
  --theme-button-secondary-hover: ${colorTokens.buttonSecondaryHover.dark};
  
  /* Typography */
  --theme-font-family-sans: ${typographyTokens.fontFamilySans};
  --theme-font-family-mono: ${typographyTokens.fontFamilyMono};
  --theme-text-xs: ${typographyTokens.textXs};
  --theme-text-sm: ${typographyTokens.textSm};
  --theme-text-base: ${typographyTokens.textBase};
  --theme-text-lg: ${typographyTokens.textLg};
  --theme-text-xl: ${typographyTokens.textXl};
  --theme-text-2xl: ${typographyTokens.text2xl};
  --theme-font-light: ${typographyTokens.fontLight};
  --theme-font-normal: ${typographyTokens.fontNormal};
  --theme-font-medium: ${typographyTokens.fontMedium};
  --theme-font-semibold: ${typographyTokens.fontSemibold};
  --theme-font-bold: ${typographyTokens.fontBold};
  --theme-leading-none: ${typographyTokens.leadingNone};
  --theme-leading-tight: ${typographyTokens.leadingTight};
  --theme-leading-normal: ${typographyTokens.leadingNormal};
  --theme-leading-relaxed: ${typographyTokens.leadingRelaxed};
  
  /* Spacing */
  --theme-space-0: ${spacingTokens.space0};
  --theme-space-1: ${spacingTokens.space1};
  --theme-space-2: ${spacingTokens.space2};
  --theme-space-3: ${spacingTokens.space3};
  --theme-space-4: ${spacingTokens.space4};
  --theme-space-5: ${spacingTokens.space5};
  --theme-space-6: ${spacingTokens.space6};
  --theme-space-8: ${spacingTokens.space8};
  --theme-space-10: ${spacingTokens.space10};
  --theme-space-12: ${spacingTokens.space12};
  --theme-space-16: ${spacingTokens.space16};
  
  /* Border Radius */
  --theme-radius-sm: ${borderRadiusTokens.radiusSm};
  --theme-radius-md: ${borderRadiusTokens.radiusMd};
  --theme-radius-lg: ${borderRadiusTokens.radiusLg};
  --theme-radius-xl: ${borderRadiusTokens.radiusXl};
  --theme-radius-full: ${borderRadiusTokens.radiusFull};
  
  /* Shadows */
  --theme-shadow-sm: ${shadowTokens.shadowSm};
  --theme-shadow-md: ${shadowTokens.shadowMd};
  --theme-shadow-lg: ${shadowTokens.shadowLg};
  --theme-shadow-xl: ${shadowTokens.shadowXl};
  
  /* Z-Index */
  --theme-z-0: ${zIndexTokens.z0};
  --theme-z-10: ${zIndexTokens.z10};
  --theme-z-20: ${zIndexTokens.z20};
  --theme-z-30: ${zIndexTokens.z30};
  --theme-z-40: ${zIndexTokens.z40};
  --theme-z-50: ${zIndexTokens.z50};
  --theme-z-auto: ${zIndexTokens.zAuto};
  
  /* Animations */
  --theme-transition-fast: ${animationTokens.transitionFast};
  --theme-transition-normal: ${animationTokens.transitionNormal};
  --theme-transition-slow: ${animationTokens.transitionSlow};
  --theme-ease-linear: ${animationTokens.easeLinear};
  --theme-ease-in: ${animationTokens.easeIn};
  --theme-ease-out: ${animationTokens.easeOut};
  --theme-ease-in-out: ${animationTokens.easeInOut};
}

/* Light Mode Overrides */
@media (prefers-color-scheme: light) {
  :root {
    --theme-bg-primary: ${colorTokens.bgPrimary.light};
    --theme-bg-secondary: ${colorTokens.bgSecondary.light};
    --theme-bg-sidebar: ${colorTokens.bgSidebar.light};
    --theme-bg-container: ${colorTokens.bgContainer.light};
    --theme-bg-chat: ${colorTokens.bgChat.light};
    --theme-bg-chat-input: ${colorTokens.bgChatInput.light};
    --theme-text-primary: ${colorTokens.textPrimary.light};
    --theme-text-secondary: ${colorTokens.textSecondary.light};
    --theme-sidebar-border: ${colorTokens.sidebarBorder.light};
    --theme-modal-border: ${colorTokens.modalBorder.light};
    --theme-chat-input-border: ${colorTokens.chatInputBorder.light};
    --theme-button-secondary: ${colorTokens.buttonSecondary.light};
    --theme-button-secondary-hover: ${colorTokens.buttonSecondaryHover.light};
  }
}

/* Class-based Theme Overrides */
.light-theme {
  --theme-bg-primary: ${colorTokens.bgPrimary.light};
  --theme-bg-secondary: ${colorTokens.bgSecondary.light};
  --theme-bg-sidebar: ${colorTokens.bgSidebar.light};
  --theme-bg-container: ${colorTokens.bgContainer.light};
  --theme-bg-chat: ${colorTokens.bgChat.light};
  --theme-bg-chat-input: ${colorTokens.bgChatInput.light};
  --theme-text-primary: ${colorTokens.textPrimary.light};
  --theme-text-secondary: ${colorTokens.textSecondary.light};
  --theme-sidebar-border: ${colorTokens.sidebarBorder.light};
  --theme-modal-border: ${colorTokens.modalBorder.light};
  --theme-chat-input-border: ${colorTokens.chatInputBorder.light};
  --theme-button-secondary: ${colorTokens.buttonSecondary.light};
  --theme-button-secondary-hover: ${colorTokens.buttonSecondaryHover.light};
}

.dark-theme {
  --theme-bg-primary: ${colorTokens.bgPrimary.dark};
  --theme-bg-secondary: ${colorTokens.bgSecondary.dark};
  --theme-bg-sidebar: ${colorTokens.bgSidebar.dark};
  --theme-bg-container: ${colorTokens.bgContainer.dark};
  --theme-bg-chat: ${colorTokens.bgChat.dark};
  --theme-bg-chat-input: ${colorTokens.bgChatInput.dark};
  --theme-text-primary: ${colorTokens.textPrimary.dark};
  --theme-text-secondary: ${colorTokens.textSecondary.dark};
  --theme-sidebar-border: ${colorTokens.sidebarBorder.dark};
  --theme-modal-border: ${colorTokens.modalBorder.dark};
  --theme-chat-input-border: ${colorTokens.chatInputBorder.dark};
  --theme-button-secondary: ${colorTokens.buttonSecondary.dark};
  --theme-button-secondary-hover: ${colorTokens.buttonSecondaryHover.dark};
}
`;
}

/**
 * Apply CSS variables to a document
 */
export function applyDesignTokensToDocument(document: Document) {
  const styleElement = document.createElement('style');
  styleElement.textContent = generateCssVariables();
  styleElement.setAttribute('id', 'bizzy-design-tokens');
  document.head.appendChild(styleElement);
  return styleElement;
}

/**
 * Helper functions to get design tokens in different formats
 */

/**
 * Get a CSS variable reference
 * @param tokenPath Dot notation path to the token (e.g., 'colors.bgPrimary.dark')
 * @returns CSS variable reference (e.g., 'var(--theme-bg-primary)')
 */
export function getCssVar(tokenPath: string): string {
  const parts = tokenPath.split('.');
  
  // Simple tokens like colors.accentPrimary
  if (parts.length === 2) {
    const [category, token] = parts;
    return `var(--theme-${kebabCase(token)})`;
  }
  
  // Complex tokens with variants like colors.bgPrimary.dark
  if (parts.length === 3) {
    const [category, token, variant] = parts;
    // Note: For complex tokens, we don't include the variant in the CSS variable name
    // as the variant is controlled by theme switching
    return `var(--theme-${kebabCase(token)})`;
  }
  
  return `var(--theme-${kebabCase(parts.slice(1).join('-'))})`;
}

/**
 * Convert camelCase to kebab-case
 */
function kebabCase(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

export default designTokens; 