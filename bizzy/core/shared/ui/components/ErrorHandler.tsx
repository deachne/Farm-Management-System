import React, { ReactNode, useState, useEffect } from 'react';
import { useNotificationContext } from './notification/NotificationProvider';

interface ErrorHandlerProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * GlobalErrorHandler that provides a convenient way to report errors through
 * the notification system.
 */
export const GlobalErrorHandler: React.FC = () => {
  const { showError } = useNotificationContext();

  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      showError(`Unhandled Promise Rejection: ${event.reason?.message || 'Unknown error'}`, {
        title: 'Application Error',
        duration: 8000,
      });
      console.error('Unhandled Promise Rejection:', event.reason);
    };

    // Handle uncaught errors
    const handleError = (event: ErrorEvent) => {
      showError(`Uncaught Error: ${event.message || 'Unknown error'}`, {
        title: 'Application Error', 
        duration: 8000,
      });
      console.error('Uncaught Error:', event.error);
    };

    // Add event listeners
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    // Clean up event listeners on unmount
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, [showError]);

  return null;
};

/**
 * ErrorHandler component that uses try/catch and React's error handling
 * to catch and display errors in its child components.
 */
export const ErrorHandler: React.FC<ErrorHandlerProps> = ({ children, fallback }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showError } = useNotificationContext();

  useEffect(() => {
    if (error) {
      showError(`Component Error: ${error.message || 'Unknown error'}`, {
        title: 'Component Error',
        duration: 8000,
      });
    }
  }, [error, showError]);

  // Reset error state after displaying fallback
  useEffect(() => {
    if (hasError) {
      const timer = setTimeout(() => {
        setHasError(false);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [hasError]);

  if (hasError) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className="p-4 border border-red-500 rounded-md bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-50">
        <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
        <p className="mb-2">{error?.message || 'An unexpected error occurred'}</p>
        <button
          className="px-3 py-1 bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 rounded-md transition-colors"
          onClick={() => {
            setHasError(false);
            setError(null);
          }}
        >
          Try again
        </button>
      </div>
    );
  }

  try {
    return <>{children}</>;
  } catch (err) {
    setHasError(true);
    setError(err instanceof Error ? err : new Error(String(err)));
    return null;
  }
};

/**
 * Hook to report errors to the notification system
 */
export function useErrorReporter() {
  const { showError } = useNotificationContext();

  const reportError = (error: Error, context?: string) => {
    const message = context 
      ? `Error in ${context}: ${error.message}` 
      : error.message;
    
    console.error(message, error);
    showError(message, { 
      title: 'Error Occurred',
      duration: 8000 // Display longer for errors
    });
  };

  return { reportError };
}

export default ErrorHandler; 