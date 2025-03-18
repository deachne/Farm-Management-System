# Unified Error Handling and Notifications - BizzyPerson UI

## Overview

This document describes the unified error handling and notification system implemented for BizzyPerson, which integrates both AnythingLLM and LibreChat notification patterns into a single cohesive interface. The system provides consistent error reporting and user notifications across the entire platform.

## Implementation Details

### Architecture

The unified notification system uses a layered approach:

1. **Core Notification Types** - Shared type definitions for notifications
2. **Toast Management** - State management for notifications using a reducer pattern
3. **NotificationProvider** - Context provider that exposes notification methods
4. **Error Handling Components** - Various error handling utilities that use the notification system

### Components and Files

- `types/notifications.ts` - Type definitions for notification system
- `hooks/useToast.ts` - Core toast state management hook
- `hooks/useNotifications.ts` - Unified notification interface for both systems
- `components/notification/NotificationProvider.tsx` - Provider component with context
- `components/notification/Toaster.tsx` - LibreChat toast display component
- `components/notification/Toast.tsx` - Individual toast components
- `components/ErrorHandler.tsx` - React error handling components
- `components/ApiErrorHandler.tsx` - API error interception and handling

### Notification Types

```typescript
enum NotificationSeverity {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}
```

### Usage Examples

#### Basic Notification Usage

```typescript
import { useNotificationContext } from '../components/notification/NotificationProvider';

function MyComponent() {
  const { showSuccess, showError, showInfo, showWarning } = useNotificationContext();
  
  const handleAction = () => {
    // Show a success notification
    showSuccess('Operation completed successfully!');
    
    // Show an error notification
    showError('Something went wrong', { 
      title: 'Error', 
      duration: 8000 
    });
  };
  
  // ...
}
```

#### Error Handling

```typescript
import { ErrorHandler, useErrorReporter } from '../components/ErrorHandler';

function MyComponent() {
  const { reportError } = useErrorReporter();
  
  const handleRiskyOperation = () => {
    try {
      // Some risky operation
    } catch (error) {
      reportError(error, 'MyComponent.handleRiskyOperation');
    }
  };
  
  return (
    <ErrorHandler>
      {/* Component content */}
    </ErrorHandler>
  );
}
```

#### API Error Handling

```tsx
import { ApiErrorHandler } from '../components/ApiErrorHandler';

function App() {
  return (
    <NotificationProvider>
      <ApiErrorHandler>
        {/* Application content */}
      </ApiErrorHandler>
    </NotificationProvider>
  );
}
```

## Integration Points

### AnythingLLM Integration

The system integrates with AnythingLLM's existing notification system through react-toastify:

- Uses `react-toastify` for displaying notifications when specifying `source: 'anythingllm'`
- Maintains AnythingLLM's toast positioning and styling
- Supports the same notification types (success, error, info, warning)

### LibreChat Integration

For LibreChat components, the system uses a Shadcn UI based toast implementation:

- Uses Radix UI Toast components styled with Tailwind CSS
- Supports the same notification types
- Displays at the same position as LibreChat's native notifications

## Mobile Considerations

The notification system is designed to be mobile-friendly:

- Responsive positioning (bottom center on mobile, bottom right on desktop)
- Touch-friendly dismiss actions
- Appropriate sizing and spacing for small screens
- Longer duration for critical errors on mobile

## Extensibility

The notification system can be extended in several ways:

1. **Additional Notification Types** - New types can be added to the NotificationSeverity enum
2. **Custom Toast Components** - The Toaster component can be extended with custom toast renderers
3. **Integration with Other Systems** - New adapters can be added to support additional notification systems

## Best Practices

1. **Use Specific Methods** - Use specific methods like `showSuccess` instead of generic `showNotification`
2. **Include Context** - When reporting errors, include context about where the error occurred
3. **Appropriate Duration** - Use longer durations for critical errors, shorter for informational messages
4. **Clear Messages** - Keep notification messages clear and concise
5. **Error Recovery** - When possible, include recovery actions in error notifications

## Future Improvements

- Add support for notification queueing to prevent overwhelming the user
- Implement notification grouping for similar messages
- Add support for interactive notifications with actions
- Create specialized notifications for field usage scenarios 