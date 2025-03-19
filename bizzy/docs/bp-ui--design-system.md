# BizzyPerson Unified Design System (BP-UI-07)

## Overview

This document defines the unified design system for BizzyPerson, based on AnythingLLM's UI with integrated LibreChat capabilities. The design system ensures visual consistency, usability, and accessibility across all interfaces while maintaining a seamless user experience between the integrated systems.

## Design Principles

### 1. Clarity First
- Clear information hierarchy with obvious primary actions
- Unambiguous interaction patterns that work the same way everywhere
- Focused content with minimal distractions

### 2. Functional Elegance
- Prioritize functionality over decoration
- Clean, professional aesthetic suitable for agricultural contexts
- Subtle visual polish that doesn't impede usability

### 3. Field-Ready
- High contrast elements that remain legible in outdoor settings
- Touch-friendly interface elements with adequate spacing
- Reduced reliance on fine motor control for key interactions
- Optimized for use with work gloves or dirty hands

### 4. Consistent Experience
- Uniform styling across AnythingLLM and LibreChat components
- Predictable navigation patterns throughout the application
- Cohesive transition between document management and chat functionality

### 5. Responsive by Default
- Mobile-first approach to all component designs
- Seamless transition between desktop and mobile views
- Critical functions accessible regardless of device

## Color System

### Primary Colors

| Token | Value (Dark) | Value (Light) | Usage |
|-------|-------------|--------------|-------|
| `--theme-bg-primary` | `#0e0f0f` | `#ffffff` | Main application background |
| `--theme-bg-secondary` | `#1b1b1e` | `#f5f5f7` | Secondary surfaces, cards |
| `--theme-bg-sidebar` | `#0e0f0f` | `#f2f2f2` | Sidebar background |
| `--theme-bg-container` | `#0e0f0f` | `#ffffff` | Container backgrounds |
| `--theme-bg-chat` | `#1b1b1e` | `#f5f5f7` | Chat area background |
| `--theme-bg-chat-input` | `#27282a` | `#e9e9ec` | Chat input background |
| `--theme-text-primary` | `#ffffff` | `#1b1b1e` | Primary text color |
| `--theme-text-secondary` | `rgba(255, 255, 255, 0.6)` | `rgba(0, 0, 0, 0.6)` | Secondary text color |

### Accent Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--theme-accent-primary` | `#4f6bff` | Primary accent color for buttons, links |
| `--theme-accent-secondary` | `#42bb4e` | Agricultural highlight color |
| `--theme-accent-tertiary` | `#ffb626` | Warning and notification color |
| `--theme-accent-quaternary` | `#ff5c5c` | Error and destructive action color |

### Status Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--theme-status-success` | `#42bb4e` | Success messages and indicators |
| `--theme-status-warning` | `#ffb626` | Warning messages and indicators |
| `--theme-status-error` | `#ff5c5c` | Error messages and indicators |
| `--theme-status-info` | `#4f6bff` | Informational messages and indicators |

### Border Colors

| Token | Value (Dark) | Value (Light) | Usage |
|-------|-------------|--------------|-------|
| `--theme-sidebar-border` | `#2b2c2e` | `#e0e0e2` | Sidebar and container borders |
| `--theme-modal-border` | `#3a3b3d` | `#d0d0d2` | Modal and dialog borders |
| `--theme-chat-input-border` | `#3a3b3d` | `#d0d0d2` | Chat input borders |

### Button Colors

| Token | Value (Dark) | Value (Light) | Usage |
|-------|-------------|--------------|-------|
| `--theme-button-primary` | `#4f6bff` | `#4f6bff` | Primary button background |
| `--theme-button-primary-hover` | `#3a56e8` | `#3a56e8` | Primary button hover state |
| `--theme-button-secondary` | `#27282a` | `#e9e9ec` | Secondary button background |
| `--theme-button-secondary-hover` | `#35363a` | `#dadade` | Secondary button hover state |

## Typography

### Font Family

```css
--theme-font-family-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
--theme-font-family-mono: 'Fira Code', 'Roboto Mono', 'Droid Sans Mono', 'MonoLisa', Consolas, monospace;
```

### Font Sizes

| Token | Value | Example Usage |
|-------|-------|---------------|
| `--theme-text-xs` | `0.75rem` (12px) | Fine print, metadata |
| `--theme-text-sm` | `0.875rem` (14px) | Body text, chat messages |
| `--theme-text-base` | `1rem` (16px) | Default text size |
| `--theme-text-lg` | `1.125rem` (18px) | Section headings |
| `--theme-text-xl` | `1.25rem` (20px) | Page headings |
| `--theme-text-2xl` | `1.5rem` (24px) | Large headings |

### Font Weights

| Token | Value | Example Usage |
|-------|-------|---------------|
| `--theme-font-light` | `300` | Decorative headings |
| `--theme-font-normal` | `400` | Body text, general content |
| `--theme-font-medium` | `500` | Emphasized content, subheadings |
| `--theme-font-semibold` | `600` | Section headings |
| `--theme-font-bold` | `700` | Main headings, key information |

### Line Heights

| Token | Value | Example Usage |
|-------|-------|---------------|
| `--theme-leading-none` | `1` | Headings |
| `--theme-leading-tight` | `1.25` | Compact text |
| `--theme-leading-normal` | `1.5` | Body text |
| `--theme-leading-relaxed` | `1.75` | Paragraph text |

## Spacing System

The spacing system is based on a 4px grid, with utility classes for margin and padding following the pattern:

```
[property][direction]-[size]
```

### Spacing Scale

| Token | Value | Example Usage |
|-------|-------|---------------|
| `--theme-space-0` | `0px` | No spacing |
| `--theme-space-1` | `0.25rem` (4px) | Minimal separation |
| `--theme-space-2` | `0.5rem` (8px) | Close elements |
| `--theme-space-3` | `0.75rem` (12px) | Form elements |
| `--theme-space-4` | `1rem` (16px) | Standard spacing |
| `--theme-space-5` | `1.25rem` (20px) | Medium spacing |
| `--theme-space-6` | `1.5rem` (24px) | Section spacing |
| `--theme-space-8` | `2rem` (32px) | Large spacing |
| `--theme-space-10` | `2.5rem` (40px) | Extra large spacing |
| `--theme-space-12` | `3rem` (48px) | Component separation |
| `--theme-space-16` | `4rem` (64px) | Major section separation |

## Border Radius

| Token | Value | Example Usage |
|-------|-------|---------------|
| `--theme-radius-sm` | `0.125rem` (2px) | Subtle rounding |
| `--theme-radius-md` | `0.25rem` (4px) | Buttons, inputs |
| `--theme-radius-lg` | `0.5rem` (8px) | Cards, modals |
| `--theme-radius-xl` | `0.75rem` (12px) | Large components |
| `--theme-radius-full` | `9999px` | Pills, avatars |

## Shadows

| Token | Value | Example Usage |
|-------|-------|---------------|
| `--theme-shadow-sm` | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` | Subtle elevation |
| `--theme-shadow-md` | `0 4px 6px -1px rgba(0, 0, 0, 0.1)` | Buttons, cards |
| `--theme-shadow-lg` | `0 10px 15px -3px rgba(0, 0, 0, 0.1)` | Modals, popovers |
| `--theme-shadow-xl` | `0 20px 25px -5px rgba(0, 0, 0, 0.1)` | Floating elements |

## Component Library

### Core Components

#### 1. Button

The primary interaction element, with several variants:

```jsx
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="ghost">Ghost Button</Button>
<Button variant="destructive">Delete Action</Button>
```

#### 2. Input

Text input fields for user data entry:

```jsx
<Input placeholder="Enter information" />
<Input type="password" placeholder="Password" />
<Input disabled placeholder="Disabled input" />
```

#### 3. Card

Container for related content:

```jsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Optional description text</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

#### 4. Dropdown Menu

Menu for selecting from a list of options:

```jsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Options</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Option 1</DropdownMenuItem>
    <DropdownMenuItem>Option 2</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Option 3</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Specialized Components

#### 1. Chat Message

Chat message component with user/assistant distinction:

```jsx
<ChatMessage 
  role="user" 
  content="How do I monitor soil moisture?" 
/>

<ChatMessage 
  role="assistant" 
  content="You can monitor soil moisture using sensors or manual testing. Would you like information about specific methods?" 
/>
```

#### 2. Document Card

Card for displaying document information:

```jsx
<DocumentCard
  title="Crop Rotation Guide"
  type="pdf"
  date="2023-05-15"
  size="1.2 MB"
  tags={["crops", "planning"]}
/>
```

#### 3. Field Data Display

Component for displaying agricultural field data:

```jsx
<FieldDataDisplay
  fieldName="North Field"
  crop="Corn"
  soilMoisture={42}
  temperature={72}
  lastUpdated="2 hours ago"
/>
```

## Responsive Design

### Breakpoints

| Token | Value | Description |
|-------|-------|-------------|
| `--theme-breakpoint-sm` | `640px` | Small devices (mobile) |
| `--theme-breakpoint-md` | `768px` | Medium devices (tablets) |
| `--theme-breakpoint-lg` | `1024px` | Large devices (laptops) |
| `--theme-breakpoint-xl` | `1280px` | Extra large devices (desktops) |
| `--theme-breakpoint-2xl` | `1536px` | 2X large devices (large desktops) |

### Responsive Patterns

1. **Mobile-First Approach**
   - Design for mobile first, then enhance for larger screens
   - Use min-width media queries to add complexity as screen size increases

2. **Flexible Layouts**
   - Use flexbox and grid for responsive layouts
   - Avoid fixed widths that may cause overflow on small screens

3. **Touch-Friendly Targets**
   - Minimum touch target size of 44px × 44px
   - Adequate spacing between interactive elements

## Accessibility Guidelines

### Color Contrast

- Maintain minimum contrast ratios:
  - 4.5:1 for normal text
  - 3:1 for large text (18pt+) and UI components

### Keyboard Navigation

- All interactive elements must be keyboard accessible
- Visible focus indicators with adequate contrast
- Logical tab order matching visual layout

### Screen Reader Support

- Semantic HTML structure
- Proper ARIA attributes where needed
- Meaningful text alternatives for non-text content

## Implementation Guidelines

### 1. CSS Variables Integration

To implement the design system, add these CSS variables to the root stylesheet:

```css
:root {
  /* Colors */
  --theme-bg-primary: #0e0f0f;
  --theme-bg-secondary: #1b1b1e;
  /* ...other variables... */
  
  /* Light mode overrides */
  @media (prefers-color-scheme: light) {
    --theme-bg-primary: #ffffff;
    --theme-bg-secondary: #f5f5f7;
    /* ...other light mode variables... */
  }
}
```

### 2. Applying to AnythingLLM Components

AnythingLLM components should use these variables directly:

```jsx
// Button component example
const Button = ({ variant = "primary", children, ...props }) => {
  const classes = {
    primary: "bg-theme-button-primary hover:bg-theme-button-primary-hover text-white",
    secondary: "bg-theme-button-secondary hover:bg-theme-button-secondary-hover text-theme-text-primary",
    // ...other variants
  };
  
  return (
    <button className={`px-4 py-2 rounded-md ${classes[variant]}`} {...props}>
      {children}
    </button>
  );
};
```

### 3. Adapting LibreChat Components

LibreChat components should be adapted to use the AnythingLLM design system:

```jsx
// Use the LibreChatUIAdapter
import { withAnythingLLMStyling } from '@/shared/ui/librechat-ui-adapter';

// Original LibreChat component
const LibreChatButton = ({ children, ...props }) => (
  <button {...props}>{children}</button>
);

// Adapted component
export const AdaptedButton = withAnythingLLMStyling(LibreChatButton);
```

### 4. CSS Class Mapping

Use the CSS class mapping system to adapt LibreChat classes:

```js
// In shared-styling.ts
export const mapLibreChatToAnythingLLM = {
  'bg-surface-primary': 'bg-theme-bg-primary',
  'text-text-primary': 'text-theme-text-primary',
  // ...other mappings
};
```

## Tooling

### Design Token Generation

Automate design token generation with a build script:

```js
// Example token generation script
const fs = require('fs');
const tokens = require('./design-tokens.json');

const cssOutput = `:root {
  ${Object.entries(tokens.colors).map(([key, value]) => `--theme-${key}: ${value};`).join('\n  ')}
  /* ...other token categories... */
}`;

fs.writeFileSync('./src/styles/tokens.css', cssOutput);
```

### Component Playground

Use Storybook to document and test components:

```js
// Example Storybook story
export default {
  title: 'Components/Button',
  component: Button,
};

export const Primary = () => <Button variant="primary">Primary Button</Button>;
export const Secondary = () => <Button variant="secondary">Secondary Button</Button>;
// ...other variants
```

## Integration Testing

Test components in both AnythingLLM and LibreChat contexts:

```jsx
// Example integration test
describe('Button component', () => {
  it('renders consistently in AnythingLLM', () => {
    render(<Button variant="primary">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-theme-button-primary');
  });
  
  it('renders consistently in LibreChat context', () => {
    render(<AnythingLLMProvider><AdaptedButton>Test</AdaptedButton></AnythingLLMProvider>);
    expect(screen.getByRole('button')).toHaveStyle('background-color: var(--theme-button-primary)');
  });
});
```

## Migration Strategy

1. **Phased Approach**
   - Start with core components (buttons, inputs, cards)
   - Progress to more complex components
   - Complete with specialized and rare components

2. **Parallel Development**
   - Keep existing components functional during migration
   - Develop new components in parallel
   - Switch once new components are fully tested

3. **Testing Milestones**
   - Test after each component type is migrated
   - Get user feedback at key migration points
   - Address issues before proceeding to next phase

## Recent UI Enhancements (Dashboard Implementation)

### Dashboard Component Styling

The recent updates to the BizzyPerson admin dashboard established several key design patterns that serve as practical implementation examples of this design system:

1. **Sidebar Styling**
   - Blue gradient background (`bg-gradient-to-b from-blue-800 to-blue-900`) for improved visual hierarchy
   - Higher contrast white text (`text-white`) with consistent sizing (`text-sm` for items, `text-lg` for section headers)
   - Colored icons for improved scannability (`text-blue-300`, `text-amber-300`, `text-green-300`, etc.)
   - Proper padding for touch targets (`px-6 py-2` for list items)
   - Subtle hover effects for interactive elements

2. **Card Component Implementation**
   - Consistent border radius (`rounded-lg`)
   - Light shadow for depth (`shadow-sm`)
   - Structured padding system (`p-6` for outer padding, `space-y-2` for inner elements)
   - Clear visual hierarchy with title/content separation
   - Background color variation based on card type/category

3. **Status Panel Design**
   - Clean horizontal layout using flexbox
   - Status indicators with semantic colors
   - Compact information display with consistent spacing
   - Clear visual hierarchy between title and content

4. **Typography Implementation**
   - Section headers: `text-xl font-semibold text-gray-800`
   - Card titles: `text-lg font-medium text-gray-700`
   - Body text: `text-sm text-gray-600`
   - Status text: `text-sm font-medium` with contextual colors

5. **Layout Structure**
   - Balanced padding between sidebar and main content (`pl-8 pr-8`)
   - Consistent spacing between sections (`space-y-8`)
   - Grid-based card layouts using CSS Grid (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`)
   - Responsive adjustments for mobile viewing

These implementations provide practical examples of how to apply the design system principles in new components and should be referenced when developing additional features.

## Conclusion

This unified design system provides a comprehensive foundation for integrating AnythingLLM and LibreChat UI components. By following these guidelines, we can create a seamless user experience that maintains the strengths of both systems while presenting a consistent visual language and interaction patterns. 