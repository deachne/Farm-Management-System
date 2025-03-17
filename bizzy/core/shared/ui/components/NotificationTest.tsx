import React from 'react';
import { useNotificationContext } from './notification/NotificationProvider';

/**
 * A test component that demonstrates the unified notification system.
 * This component shows buttons for each notification type and source.
 */
export const NotificationTest: React.FC = () => {
  const { 
    showSuccess, 
    showError, 
    showInfo, 
    showWarning, 
    showNotification 
  } = useNotificationContext();

  // Test LibreChat (Shadcn UI) notifications
  const testLibreChatSuccess = () => {
    showSuccess('Operation completed successfully!', { 
      source: 'librechat',
      title: 'Success' 
    });
  };

  const testLibreChatError = () => {
    showError('Something went wrong with your request.', { 
      source: 'librechat',
      title: 'Error' 
    });
  };

  const testLibreChatInfo = () => {
    showInfo('This is an informational message.', { 
      source: 'librechat',
      title: 'Information' 
    });
  };

  const testLibreChatWarning = () => {
    showWarning('This is a warning message.', { 
      source: 'librechat',
      title: 'Warning' 
    });
  };

  // Test AnythingLLM (react-toastify) notifications
  const testAnythingLLMSuccess = () => {
    showSuccess('Operation completed successfully!', { 
      source: 'anythingllm',
      title: 'Success' 
    });
  };

  const testAnythingLLMError = () => {
    showError('Something went wrong with your request.', { 
      source: 'anythingllm',
      title: 'Error' 
    });
  };

  const testAnythingLLMInfo = () => {
    showInfo('This is an informational message.', { 
      source: 'anythingllm',
      title: 'Information' 
    });
  };

  const testAnythingLLMWarning = () => {
    showWarning('This is a warning message.', { 
      source: 'anythingllm',
      title: 'Warning' 
    });
  };

  // Test API error
  const testApiError = () => {
    // Simulate an API error
    fetch('/api/non-existent-endpoint')
      .then(response => {
        if (!response.ok) {
          throw new Error('API Error: ' + response.statusText);
        }
        return response.json();
      })
      .catch(error => {
        showError(error.message, {
          title: 'API Error'
        });
      });
  };

  // Test unhandled error
  const testUnhandledError = () => {
    throw new Error('This is an unhandled error');
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Notification System Test</h1>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">LibreChat Notifications (Shadcn UI)</h2>
        <div className="flex flex-wrap gap-2">
          <button
            className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded"
            onClick={testLibreChatSuccess}
          >
            Success
          </button>
          <button
            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded"
            onClick={testLibreChatError}
          >
            Error
          </button>
          <button
            className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded"
            onClick={testLibreChatInfo}
          >
            Info
          </button>
          <button
            className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded"
            onClick={testLibreChatWarning}
          >
            Warning
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">AnythingLLM Notifications (react-toastify)</h2>
        <div className="flex flex-wrap gap-2">
          <button
            className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 rounded"
            onClick={testAnythingLLMSuccess}
          >
            Success
          </button>
          <button
            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded"
            onClick={testAnythingLLMError}
          >
            Error
          </button>
          <button
            className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded"
            onClick={testAnythingLLMInfo}
          >
            Info
          </button>
          <button
            className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded"
            onClick={testAnythingLLMWarning}
          >
            Warning
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Error Handling Tests</h2>
        <div className="flex flex-wrap gap-2">
          <button
            className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded"
            onClick={testApiError}
          >
            API Error
          </button>
          <button
            className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded"
            onClick={() => {
              try {
                testUnhandledError();
              } catch (error) {
                showError(error instanceof Error ? error.message : 'Unknown error', {
                  title: 'Caught Error'
                });
              }
            }}
          >
            Caught Error
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationTest; 