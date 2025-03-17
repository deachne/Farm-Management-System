import React, { ReactNode } from 'react';
import { useNotificationContext } from './notification/NotificationProvider';
import { ErrorHandler } from './ErrorHandler';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

/**
 * ErrorBoundary component that simply wraps the functional ErrorHandler
 * for catching React errors in a component tree.
 */
export function ErrorBoundary({ children, fallback, onError }: ErrorBoundaryProps) {
  return (
    <ErrorHandler fallback={fallback}>
      {children}
    </ErrorHandler>
  );
}

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

export default ErrorBoundary; 