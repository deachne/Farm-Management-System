# Unified Notification System

This directory contains components for the BizzyPerson unified notification system, which integrates notification mechanisms from both AnythingLLM and LibreChat.

## Directory Contents

- **NotificationProvider.tsx**: Context provider component that exposes notification methods
- **NotificationRenderer.tsx**: Component that renders notifications from both systems
- **hooks.ts**: Custom hooks for accessing notification context
- **types.ts**: TypeScript type definitions for the notification system

## Quick Start

1. **Wrap your application with the NotificationProvider**:

```tsx
// In your top-level component:
import { NotificationProvider } from './path/to/notification/NotificationProvider';

function App() {
  return (
    <NotificationProvider>
      <YourAppComponents />
    </NotificationProvider>
  );
}
```

2. **Use the notification hook in your components**:

```tsx
import { useNotificationContext } from './path/to/notification/NotificationProvider';

function YourComponent() {
  const { showSuccess, showError, showInfo, showWarning } = useNotificationContext();
  
  const handleAction = () => {
    try {
      // Your logic here
      showSuccess('Action completed successfully!');
    } catch (error) {
      showError('Failed to complete action');
    }
  };
  
  return (
    <button onClick={handleAction}>Perform Action</button>
  );
}
```

## Available Methods

- **showSuccess(message, options?)**: Display a success notification
- **showError(message, options?)**: Display an error notification
- **showInfo(message, options?)**: Display an informational notification
- **showWarning(message, options?)**: Display a warning notification

## Options

All notification methods accept an optional options object:

```typescript
{
  title?: string;       // Optional title for the notification
  duration?: number;    // How long the notification stays visible (in ms)
  source?: 'libreChatUI' | 'anythingLLM'; // Default is determined by code location
  position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
}
```

## Integration with Error Handling

The notification system is integrated with the error handling system. See the ErrorHandler and ErrorBoundary components in the parent directory for details on error handling integration.

## Testing

Use the `NotificationTest.tsx` component in the parent directory to test different notification types and error handling scenarios.

## Examples

See `NotificationExample.tsx` in the examples directory for a real-world example of using the notification system in a form component.

## Documentation

For more detailed documentation, see:

- [Notification System Documentation](../../../docs/bp-ui--notification-system.md)
- [Error Handling Documentation](../../../docs/bp-ui--error-handling.md) 