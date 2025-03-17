# BizzyPerson Error Handling System

This document outlines the error handling strategy and components used in the BizzyPerson project.

## Overview

The BizzyPerson project implements a comprehensive error handling system that integrates with the unified notification system. This approach ensures consistent error reporting, user feedback, and error recovery mechanisms across both AnythingLLM and LibreChat components.

## Error Handling Architecture

The error handling system consists of several key components:

1. **ErrorBoundary**: React error boundary component for catching and handling uncaught errors in component trees
2. **ErrorHandler**: Service for processing and reporting errors to the notification system
3. **GlobalErrorHandler**: A higher-level component that handles global/application-wide errors
4. **useErrorHandler**: Hook that provides error handling functionality to components

## Error Categories

The system handles different types of errors:

1. **Component Rendering Errors**: Caught by ErrorBoundary
2. **API/Network Errors**: Handled explicitly in async operations
3. **User Input Errors**: Validation errors handled through form feedback
4. **Runtime Errors**: Unexpected errors that occur during application execution
5. **Integration Errors**: Errors specific to the integration between AnythingLLM and LibreChat

## Using the Error Handling System

### ErrorBoundary for Component Trees

Wrap components or component trees with the ErrorBoundary component:

```tsx
import { ErrorBoundary } from '../path/to/components/ErrorBoundary';

function MyApp() {
  return (
    <ErrorBoundary>
      <MyComponentThatMightError />
    </ErrorBoundary>
  );
}
```

The ErrorBoundary will:
- Catch errors during rendering, lifecycle methods, or event handlers
- Display a fallback UI
- Report the error to the notification system
- Log detailed error information for debugging

### Handling API Errors

Use the `useErrorHandler` hook for API calls and other async operations:

```tsx
import { useErrorHandler } from '../path/to/components/ErrorHandler';

function DataComponent() {
  const handleError = useErrorHandler();
  
  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      // The error will be reported to the notification system
      handleError(error, 'Failed to fetch data');
      return null;
    }
  };
  
  // Rest of component implementation
}
```

### Global Error Handling

The application includes global error handlers for:

1. **Unhandled Promise Rejections**: `window.addEventListener('unhandledrejection', ...)`
2. **Runtime Errors**: `window.addEventListener('error', ...)`
3. **API Error Interceptors**: For axios or fetch API wrappers

These are configured in the `GlobalErrorHandler` component, which should be included near the root of your application.

## Error Reporting Strategy

Errors are reported following these guidelines:

1. **User-Facing Messages**: Clear, non-technical descriptions of what went wrong
2. **Developer Information**: Detailed error information in console logs
3. **Centralized Logging**: Critical errors are logged to a centralized system
4. **Recovery Information**: Where possible, users are provided with recovery actions

## Integration with Notification System

The error handling system is deeply integrated with the notification system:

```tsx
// Inside ErrorHandler.tsx
export const useErrorHandler = () => {
  const { showError } = useNotificationContext();
  
  return (error: unknown, userMessage?: string) => {
    // Extract meaningful information from the error
    const errorMessage = extractErrorMessage(error);
    
    // Log for developers
    console.error('Error handled:', error);
    
    // Show user-friendly notification
    showError(userMessage || errorMessage, {
      title: 'Error Occurred',
      duration: 6000
    });
    
    // Additional error processing like logging to service
    // logErrorToService(error);
  };
};
```

## Best Practices

### Error Boundary Placement

- Place ErrorBoundaries strategically to isolate failures to specific components
- Consider placing boundaries around:
  - Feature sections
  - Dynamically loaded components
  - Third-party components
  - User input forms

### Error Messages for Users

- Use clear, concise language
- Avoid technical jargon
- Explain what happened and why if possible
- Provide actionable next steps when appropriate

### Error Handling in Forms

- Validate input before submission
- Provide inline validation feedback
- Use notifications for submission errors
- Consider field-level and form-level validation

### API Error Handling

- Handle different HTTP status codes appropriately
- Differentiate between network errors and API errors
- Parse error responses from the server when available
- Implement retry mechanisms for transient failures

## Cross-Platform Considerations

Special considerations for the integrated AnythingLLM and LibreChat platforms:

1. **Authentication Errors**: Handle session expiration and authentication failures consistently across platforms
2. **API Differences**: Account for differences in API error formats between the two platforms
3. **Feature Boundaries**: Clearly define error handling at the boundaries between the platforms
4. **Consistent Messaging**: Maintain consistent error messaging style across both platforms

## Testing Error Handling

The project includes tools for testing error handling:

1. **NotificationTest Component**: Test component for triggering different notification types
2. **Error Simulation**: Methods for simulating different error scenarios
3. **Error Boundary Testing**: Examples of how to test error boundaries

## Debugging Error Handling Issues

When debugging error handling problems:

1. Check console logs for detailed error information
2. Verify ErrorBoundary components are properly placed
3. Ensure error handler hooks are properly imported and used
4. Check for error suppression that might be hiding important errors

## Related Documentation

- [Notification System](./bp-ui--notification-system.md)
- [Form Validation](./bp-ui--form-validation.md)
- [API Integration](./bp-tech--api-integration.md) 