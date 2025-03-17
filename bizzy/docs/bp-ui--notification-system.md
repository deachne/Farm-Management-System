# BizzyPerson Unified Notification System

This document provides guidelines and examples for using the unified notification system in the BizzyPerson project.

## Overview

The BizzyPerson project integrates notification mechanisms from both AnythingLLM (react-toastify) and LibreChat (Shadcn UI) into a unified notification system. This allows for consistent error handling and user feedback across the entire application.

## Key Components

1. **NotificationProvider**: Context provider that maintains notification state and exposes methods for showing notifications.
2. **useNotificationContext**: Hook to access notification methods from any component.
3. **NotificationRenderer**: Responsible for rendering notifications from both systems.
4. **ErrorBoundary and ErrorHandler**: Components for catching and displaying errors.

## Using the Notification System

### Basic Usage

Import and use the `useNotificationContext` hook in your component:

```tsx
import { useNotificationContext } from '../path/to/notification/NotificationProvider';

function MyComponent() {
  const { showSuccess, showError, showInfo, showWarning } = useNotificationContext();
  
  const handleAction = () => {
    try {
      // Perform some action
      showSuccess('Action completed successfully!');
    } catch (error) {
      showError('Failed to complete action.');
    }
  };
  
  return (
    <button onClick={handleAction}>
      Perform Action
    </button>
  );
}
```

### Available Methods

- **showSuccess(message, options?)**: Display a success notification
- **showError(message, options?)**: Display an error notification
- **showInfo(message, options?)**: Display an informational notification
- **showWarning(message, options?)**: Display a warning notification

### Notification Options

All notification methods accept an optional options object with the following properties:

```typescript
{
  title?: string;       // Optional title for the notification
  duration?: number;    // How long the notification stays visible (in ms)
  source?: 'libreChatUI' | 'anythingLLM'; // Default is determined by code location
  position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
  // Additional options specific to each notification system
}
```

## Error Handling

The notification system is integrated with error handling components:

### Using ErrorBoundary

Wrap components that might throw errors with the ErrorBoundary:

```tsx
import { ErrorBoundary } from '../path/to/ErrorBoundary';

function MyApp() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  );
}
```

### Using ErrorHandler for API Errors

For API requests and other async operations:

```tsx
import { useErrorHandler } from '../path/to/ErrorHandler';

function DataFetchingComponent() {
  const handleError = useErrorHandler();
  
  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      const data = await response.json();
      return data;
    } catch (error) {
      handleError(error, 'Failed to fetch data');
      return null;
    }
  };
  
  // Component implementation
}
```

## Best Practices

1. **Be Specific**: Provide clear, concise messages that explain what happened.
2. **Include Actions When Possible**: If there's an action the user can take, mention it.
3. **Use Appropriate Type**: Match the notification type to the content (success, error, info, warning).
4. **Set Appropriate Duration**: Critical errors might need longer duration than success messages.
5. **Consistent Tone**: Maintain a consistent tone in all notification messages.
6. **Avoid Notification Overload**: Don't show too many notifications at once.
7. **Handle Errors Close to Source**: Catch and handle errors as close to their source as possible.

## Implementation Examples

### Form Validation Example

See the `NotificationExample.tsx` component for a complete example of form validation with notifications.

### API Error Handling Example

```tsx
import { useNotificationContext } from '../path/to/notification/NotificationProvider';

function UserProfile() {
  const { showSuccess, showError, showInfo } = useNotificationContext();
  const [user, setUser] = useState(null);
  
  const fetchUserProfile = async () => {
    showInfo('Loading profile...', { duration: 2000 });
    
    try {
      const response = await fetch('/api/user/profile');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const userData = await response.json();
      setUser(userData);
      showSuccess('Profile loaded successfully');
    } catch (error) {
      showError('Failed to load user profile. Please try again later.', {
        title: 'Profile Error',
        duration: 6000
      });
      console.error('Profile fetch error:', error);
    }
  };
  
  // Component implementation
}
```

## Testing Notifications

Use the `NotificationTest.tsx` component to test all notification types across both systems. This component provides buttons to trigger various notification types and test error handling scenarios.

## Platform Differences

While the notification system provides a unified API, there are some differences in how notifications appear between AnythingLLM and LibreChat:

- **AnythingLLM notifications**: Use react-toastify and appear with the AnythingLLM styling
- **LibreChat notifications**: Use Shadcn UI components with their distinct styling

The notification system automatically selects the appropriate platform based on the code context, but you can explicitly specify which platform to use with the `source` option.

## Troubleshooting

### Common Issues

1. **Notifications not appearing**: Ensure the component is wrapped with NotificationProvider somewhere in the component tree.

2. **Wrong styling**: If notifications appear with unexpected styling, check if the `source` property is correctly set.

3. **Errors not being caught**: Verify that ErrorBoundary components are correctly placed around components that might throw errors.

4. **Multiple notifications for same event**: Check for duplicate notification calls in your component.

## Contributing to the Notification System

When extending the notification system:

1. Maintain compatibility with both AnythingLLM and LibreChat notification systems
2. Add unit tests for new functionality
3. Update this documentation with any new features or options
4. Follow the existing patterns for consistent behavior

## Related Documentation

- [Error Handling System](./bp-ui--error-handling.md)
- [UI Component Library Standards](./bp-ui--component-standards.md) 