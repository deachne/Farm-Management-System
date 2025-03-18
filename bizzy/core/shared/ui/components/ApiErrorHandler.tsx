import React, { useState, useEffect, ReactNode } from 'react';
import { useNotificationContext } from './notification/NotificationProvider';

interface ApiErrorHandlerProps {
  children: ReactNode;
}

interface ApiError {
  status: number;
  message: string;
  timestamp: Date;
  path?: string;
}

/**
 * ApiErrorHandler component that intercepts API errors and displays appropriate
 * notifications using the unified notification system.
 */
export const ApiErrorHandler: React.FC<ApiErrorHandlerProps> = ({ children }) => {
  const { showError, showWarning } = useNotificationContext();
  const [lastInterceptedError, setLastInterceptedError] = useState<ApiError | null>(null);

  useEffect(() => {
    // Intercept fetch and XMLHttpRequest to catch API errors
    
    // Save original fetch method
    const originalFetch = window.fetch;
    
    // Override fetch to intercept errors
    window.fetch = async function(input, init) {
      try {
        const response = await originalFetch(input, init);
        
        // Check if the response is an error
        if (!response.ok) {
          let errorMessage = `${response.status}: ${response.statusText}`;
          let path = '';
          
          try {
            // Try to parse the error response
            const errorData = await response.clone().json();
            errorMessage = errorData.message || errorMessage;
            path = errorData.path || '';
          } catch (e) {
            // If parsing fails, use default message
          }
          
          const error: ApiError = {
            status: response.status,
            message: errorMessage,
            timestamp: new Date(),
            path: typeof input === 'string' ? input : path
          };
          
          handleApiError(error);
        }
        
        return response;
      } catch (error) {
        // Handle network errors
        const apiError: ApiError = {
          status: 0,
          message: error.message || 'Network error occurred',
          timestamp: new Date(),
          path: typeof input === 'string' ? input : undefined
        };
        
        handleApiError(apiError);
        throw error;
      }
    };
    
    // Intercept XHR for older code
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    const originalXhrSend = XMLHttpRequest.prototype.send;
    
    XMLHttpRequest.prototype.open = function(method, url) {
      // @ts-ignore
      this.__url = url;
      return originalXhrOpen.apply(this, arguments as any);
    };
    
    XMLHttpRequest.prototype.send = function() {
      // @ts-ignore
      const xhr = this;
      
      const originalOnReadyStateChange = xhr.onreadystatechange;
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if (xhr.status >= 400) {
            let errorMessage = `${xhr.status}: ${xhr.statusText}`;
            let errorData;
            
            try {
              errorData = JSON.parse(xhr.responseText);
              errorMessage = errorData.message || errorMessage;
            } catch (e) {
              // Use default message if parsing fails
            }
            
            const error: ApiError = {
              status: xhr.status,
              message: errorMessage,
              timestamp: new Date(),
              // @ts-ignore
              path: xhr.__url
            };
            
            handleApiError(error);
          }
        }
        
        if (originalOnReadyStateChange) {
          originalOnReadyStateChange.apply(xhr, arguments as any);
        }
      };
      
      return originalXhrSend.apply(this, arguments as any);
    };
    
    // Cleanup function to restore original methods
    return () => {
      window.fetch = originalFetch;
      XMLHttpRequest.prototype.open = originalXhrOpen;
      XMLHttpRequest.prototype.send = originalXhrSend;
    };
  }, [showError, showWarning]);
  
  // Handle API errors based on status code
  const handleApiError = (error: ApiError) => {
    // Prevent duplicates (same error within 2 seconds)
    if (lastInterceptedError && 
        error.status === lastInterceptedError.status && 
        error.message === lastInterceptedError.message &&
        error.timestamp.getTime() - lastInterceptedError.timestamp.getTime() < 2000) {
      return;
    }
    
    setLastInterceptedError(error);
    
    // Format path for display
    const pathDisplay = error.path ? ` (${error.path})` : '';
    
    // Display different notifications based on error status
    if (error.status === 0) {
      showError(`Network Error: Could not connect to server${pathDisplay}`, {
        title: 'Connection Error',
        duration: 8000,
      });
    } else if (error.status === 401) {
      showWarning(`Authentication required${pathDisplay}`, {
        title: 'Session Expired',
        duration: 10000,
      });
    } else if (error.status === 403) {
      showError(`You don't have permission to access this resource${pathDisplay}`, {
        title: 'Access Denied',
        duration: 5000,
      });
    } else if (error.status === 404) {
      showWarning(`Resource not found${pathDisplay}`, {
        title: 'Not Found',
        duration: 5000,
      });
    } else if (error.status >= 500) {
      showError(`Server error occurred${pathDisplay}: ${error.message}`, {
        title: 'Server Error',
        duration: 8000,
      });
    } else {
      showError(`${error.message}${pathDisplay}`, {
        title: `Error (${error.status})`,
        duration: 5000,
      });
    }
  };
  
  return <>{children}</>;
};

export default ApiErrorHandler; 