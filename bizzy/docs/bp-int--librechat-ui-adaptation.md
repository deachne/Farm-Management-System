# LibreChat UI Adaptation to AnythingLLM Design (BP-INT-06)

## Overview

This document outlines the strategy for adapting LibreChat UI components to match the AnythingLLM design system. The goal is to create a seamless user experience where users cannot perceive they are using two different systems. This adaptation will focus on styling, interaction patterns, and visual consistency.

## Key Components to Adapt

### 1. Chat Messages

#### AnythingLLM Design
- Simple, clean chat bubbles with clear user/system distinction
- Consistent padding and spacing
- Markdown rendering with proper sanitization
- User icons for visual identification
- Background color using `bg-theme-bg-secondary`
- Text styling using `text-white font-normal text-sm`

#### LibreChat Components to Adapt
- `Message.tsx`
- `MessageRender.tsx`
- CSS classes and styling

#### Adaptation Strategy
- Replace LibreChat's message styling with AnythingLLM's styling
- Adapt the message container to use AnythingLLM's background colors and spacing
- Ensure consistent rendering of markdown content
- Implement AnythingLLM's user icon system
- Maintain LibreChat's advanced features (multi-message, artifacts) while adapting the visual style

### 2. Chat Input

#### AnythingLLM Design
- Clean, minimal input area
- Consistent border and background colors
- Simple send button
- Proper spacing and padding

#### LibreChat Components to Adapt
- `ChatForm.tsx`
- Input styling and layout

#### Adaptation Strategy
- Adapt the input container to match AnythingLLM's styling
- Maintain LibreChat's advanced input features (mentions, commands, etc.)
- Ensure consistent border colors and background
- Adapt button styling to match AnythingLLM

### 3. UI Elements and Controls

#### AnythingLLM Design
- Consistent button styling
- Modal and popover designs
- Color scheme based on CSS variables
- Typography and spacing patterns

#### LibreChat Components to Adapt
- Button components
- Modal components
- Dropdown and menu components

#### Adaptation Strategy
- Create shared CSS variables that match AnythingLLM's theme
- Adapt LibreChat's UI controls to use these variables
- Ensure consistent border radius, shadows, and transitions
- Maintain LibreChat's functionality while adapting the visual style

## Implementation Approach

### 1. Create Shared Styling

Create a shared styling module that defines common CSS variables, utility classes, and components that match AnythingLLM's design system:

```typescript
// shared-styling.ts
export const sharedClasses = {
  chatBubble: 'flex justify-center items-end w-full bg-theme-bg-secondary',
  chatBubbleContainer: 'py-8 px-4 w-full flex gap-x-5 md:max-w-[80%] flex-col',
  chatBubbleContent: 'markdown whitespace-pre-line text-white font-normal text-sm md:text-sm flex flex-col gap-y-1 mt-2',
  // ... other shared classes
};
```

### 2. Adapt Message Components

Modify LibreChat's message components to use AnythingLLM's styling:

```tsx
// Adapted MessageRender.tsx
import { sharedClasses } from '~/utils/shared-styling';

// ... existing imports

const MessageRender = memo(
  ({ ... }) => {
    // ... existing code
    
    return (
      <div
        id={msg.messageId}
        aria-label={`message-${msg.depth}-${msg.messageId}`}
        className={cn(
          sharedClasses.chatBubble,
          // ... other classes
        )}
        onClick={clickHandler}
        // ... other props
      >
        {/* ... content */}
      </div>
    );
  }
);
```

### 3. Adapt Input Components

Modify LibreChat's input components to match AnythingLLM's styling:

```tsx
// Adapted ChatForm.tsx
import { sharedClasses } from '~/utils/shared-styling';

// ... existing imports

const ChatForm = ({ index = 0 }) => {
  // ... existing code
  
  return (
    <form
      onSubmit={methods.handleSubmit((data) => submitMessage(data))}
      className={cn(
        'mx-auto flex flex-row gap-3 pl-2 transition-all duration-200 last:mb-2',
        maximizeChatSpace ? 'w-full max-w-full' : 'md:max-w-2xl xl:max-w-3xl',
        sharedClasses.chatForm
      )}
    >
      {/* ... content */}
    </form>
  );
};
```

### 4. Create Theme Integration

Create a theme integration module that maps LibreChat's theme variables to AnythingLLM's:

```typescript
// theme-integration.ts
export const mapLibreChatToAnythingLLM = {
  // Text colors
  'text-text-primary': 'text-white',
  'text-token-text-secondary': 'text-white/60',
  
  // Background colors
  'bg-surface-primary': 'bg-theme-bg-primary',
  'bg-surface-secondary': 'bg-theme-bg-secondary',
  'bg-surface-tertiary': 'bg-theme-bg-chat-input',
  
  // ... other mappings
};
```

## CSS Variables to Adapt

### AnythingLLM Variables to Use

```css
:root {
  --theme-bg-primary: #0e0f0f;
  --theme-bg-secondary: #1b1b1e;
  --theme-bg-sidebar: #0e0f0f;
  --theme-bg-container: #0e0f0f;
  --theme-bg-chat: #1b1b1e;
  --theme-bg-chat-input: #27282a;
  --theme-text-primary: #ffffff;
  --theme-text-secondary: rgba(255, 255, 255, 0.6);
  /* ... other variables */
}
```

### LibreChat Variables to Adapt

Map LibreChat's CSS variables to AnythingLLM's variables:

```css
:root {
  --surface-primary: var(--theme-bg-primary);
  --surface-secondary: var(--theme-bg-secondary);
  --surface-tertiary: var(--theme-bg-chat-input);
  --text-primary: var(--theme-text-primary);
  --text-secondary: var(--theme-text-secondary);
  /* ... other mappings */
}
```

## Component-Specific Adaptations

### 1. Chat Bubbles

- Replace LibreChat's message container with AnythingLLM's chat bubble design
- Adapt the message icon to use AnythingLLM's UserIcon component
- Ensure consistent padding and spacing

### 2. Input Area

- Adapt the input container to match AnythingLLM's styling
- Ensure consistent border colors and background
- Maintain LibreChat's advanced input features

### 3. Buttons and Controls

- Adapt button styling to match AnythingLLM
- Ensure consistent hover and active states
- Maintain LibreChat's functionality

## Testing Strategy

1. Create visual comparison tests to ensure consistency
2. Test in both light and dark modes
3. Verify that all LibreChat functionality remains intact
4. Test with various content types (text, code, images, etc.)
5. Ensure responsive design works across different screen sizes

## Implementation Plan

1. Create shared styling module
2. Adapt message components
3. Adapt input components
4. Create theme integration
5. Test and refine
6. Document the adaptation process

## Conclusion

By adapting LibreChat's UI components to match AnythingLLM's design system, we will create a seamless user experience where the integration between the two systems is invisible to the user. This adaptation will maintain all of LibreChat's advanced features while ensuring visual consistency with AnythingLLM. 