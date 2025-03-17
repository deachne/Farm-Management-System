/**
 * Utility functions for handling and formatting errors
 */

type ApiErrorResponse = {
  message?: string;
  error?: string;
  details?: string | string[] | Record<string, string>;
};

/**
 * Extracts a user-friendly error message from various error types
 * 
 * @param error The error object to extract a message from
 * @returns A user-friendly error message string
 */
export function extractErrorMessage(error: unknown): string {
  // Default message for truly unknown errors
  const defaultMessage = 'An unexpected error occurred';
  
  if (!error) {
    return defaultMessage;
  }
  
  // Handle Error objects
  if (error instanceof Error) {
    return error.message || defaultMessage;
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }
  
  // Handle API response errors (common pattern in fetch/axios)
  if (typeof error === 'object') {
    const errorObj = error as Record<string, unknown>;
    
    // Check for response object (typical in fetch/axios errors)
    if (errorObj.response && typeof errorObj.response === 'object') {
      const response = errorObj.response as Record<string, unknown>;
      
      // Extract from response.data if it exists
      if (response.data && typeof response.data === 'object') {
        const data = response.data as ApiErrorResponse;
        
        // Check common API error response patterns
        if (data.message) return data.message;
        if (data.error) return data.error;
        
        // Handle details field which might be a string, array, or object
        if (data.details) {
          if (typeof data.details === 'string') {
            return data.details;
          }
          if (Array.isArray(data.details)) {
            return data.details.join(', ');
          }
          if (typeof data.details === 'object') {
            return Object.values(data.details).join(', ');
          }
        }
      }
      
      // Check response.statusText (common in fetch API)
      if (response.statusText && typeof response.statusText === 'string') {
        return response.statusText;
      }
    }
    
    // Check for message property directly on the error object
    if (errorObj.message && typeof errorObj.message === 'string') {
      return errorObj.message;
    }
    
    // Check for error property directly on the error object
    if (errorObj.error) {
      if (typeof errorObj.error === 'string') {
        return errorObj.error;
      }
      if (typeof errorObj.error === 'object' && errorObj.error !== null) {
        const errorData = errorObj.error as Record<string, unknown>;
        if (errorData.message && typeof errorData.message === 'string') {
          return errorData.message;
        }
      }
    }
  }
  
  // If all else fails, try to stringify the error
  try {
    return `Error: ${JSON.stringify(error)}`;
  } catch (e) {
    // If stringify fails, return the default message
    return defaultMessage;
  }
}

/**
 * Formats an error for developer logging
 * 
 * @param error The error to format
 * @param context Additional context about where the error occurred
 * @returns Formatted error information
 */
export function formatErrorForLogging(error: unknown, context?: string): Record<string, unknown> {
  const timestamp = new Date().toISOString();
  const errorMessage = extractErrorMessage(error);
  const errorType = error instanceof Error ? error.constructor.name : typeof error;
  const errorStack = error instanceof Error ? error.stack : undefined;
  
  return {
    timestamp,
    context: context || 'unknown',
    errorType,
    message: errorMessage,
    stack: errorStack,
    originalError: error,
  };
}

/**
 * Determines if an error should be treated as a critical error
 * Critical errors are those that might require immediate attention
 * 
 * @param error The error to check
 * @returns boolean indicating if error is critical
 */
export function isCriticalError(error: unknown): boolean {
  // Check for network errors
  if (error instanceof Error) {
    // Network errors in fetch have name 'TypeError'
    if (error.name === 'TypeError' && error.message.includes('network')) {
      return true;
    }
    
    // Server errors (5xx)
    if (
      typeof error === 'object' && 
      error !== null && 
      'response' in error && 
      typeof error.response === 'object' && 
      error.response !== null &&
      'status' in error.response &&
      typeof error.response.status === 'number' &&
      error.response.status >= 500
    ) {
      return true;
    }
  }
  
  return false;
}

/**
 * Groups similar errors to prevent notification spam
 * 
 * @param error Current error
 * @param previousErrors Array of previous errors
 * @returns boolean indicating if this error is similar to recent errors
 */
export function isSimilarToRecentErrors(
  error: unknown, 
  previousErrors: Array<{ message: string; timestamp: number }>
): boolean {
  const errorMessage = extractErrorMessage(error);
  const currentTime = Date.now();
  const recentErrorWindow = 5 * 60 * 1000; // 5 minutes
  
  // Check for similar errors in the recent window
  return previousErrors.some(prevError => {
    const isRecent = (currentTime - prevError.timestamp) < recentErrorWindow;
    const isSimilar = prevError.message === errorMessage;
    return isRecent && isSimilar;
  });
}

/**
 * Generates a user-friendly message for common error types
 * 
 * @param error The error object
 * @returns A user-friendly message
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
  // Default cases for common error patterns
  if (error instanceof Error) {
    // Network connectivity issues
    if (error.message.includes('network') || error.message.includes('ECONNREFUSED')) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    
    // Timeout errors
    if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
      return 'The request timed out. Please try again later.';
    }
  }
  
  // Handle HTTP status codes for API errors
  if (
    typeof error === 'object' && 
    error !== null && 
    'response' in error && 
    typeof error.response === 'object' && 
    error.response !== null &&
    'status' in error.response
  ) {
    const status = (error.response as { status: number }).status;
    
    switch (status) {
      case 400:
        return 'The request contained invalid data. Please check your input and try again.';
      case 401:
        return 'You need to log in to access this resource.';
      case 403:
        return 'You do not have permission to access this resource.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'There was a conflict with the current state of the resource.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'An unexpected server error occurred. Our team has been notified.';
      case 503:
        return 'The service is currently unavailable. Please try again later.';
    }
  }
  
  // Fall back to the extracted error message
  return extractErrorMessage(error);
} 