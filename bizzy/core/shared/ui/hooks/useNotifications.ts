import { toast as libreChatToast } from './useToast';
import { toast as anythingLLMToast } from 'react-toastify';
import { NotificationSeverity, ShowToastOptions } from '../types/notifications';

/**
 * Hook that provides a unified interface for showing notifications
 * in both AnythingLLM and LibreChat.
 */
export function useNotifications() {
  /**
   * Show a notification in the appropriate system based on source
   */
  const showNotification = (options: ShowToastOptions) => {
    const {
      message,
      type = NotificationSeverity.SUCCESS,
      duration = 5000,
      showIcon = true,
      source,
      title,
      action,
    } = options;

    // Normalize the type to match NotificationSeverity enum
    const severity = type as NotificationSeverity;

    // If source is specified as 'anythingllm', use AnythingLLM's react-toastify
    if (source === 'anythingllm') {
      const theme = localStorage?.getItem('theme') || 'default';
      const toastOptions = {
        position: 'bottom-center' as const,
        autoClose: duration,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: theme === 'default' ? 'dark' : 'light',
      };

      switch (severity) {
        case NotificationSeverity.SUCCESS:
          anythingLLMToast.success(message, toastOptions);
          break;
        case NotificationSeverity.ERROR:
          anythingLLMToast.error(message, toastOptions);
          break;
        case NotificationSeverity.INFO:
          anythingLLMToast.info(message, toastOptions);
          break;
        case NotificationSeverity.WARNING:
          anythingLLMToast.warn(message, toastOptions);
          break;
        default:
          anythingLLMToast(message, toastOptions);
      }
      return;
    }

    // Default to LibreChat's toast system (Shadcn UI) or if source is 'librechat'
    libreChatToast({
      title,
      description: message,
      severity,
      duration,
      showIcon,
      action,
    });
  };

  /**
   * Show a success notification
   */
  const showSuccess = (message: string, options?: Omit<ShowToastOptions, 'message' | 'type'>) => {
    showNotification({
      message,
      type: NotificationSeverity.SUCCESS,
      ...options,
    });
  };

  /**
   * Show an error notification
   */
  const showError = (message: string, options?: Omit<ShowToastOptions, 'message' | 'type'>) => {
    showNotification({
      message,
      type: NotificationSeverity.ERROR,
      ...options,
    });
  };

  /**
   * Show an info notification
   */
  const showInfo = (message: string, options?: Omit<ShowToastOptions, 'message' | 'type'>) => {
    showNotification({
      message,
      type: NotificationSeverity.INFO,
      ...options,
    });
  };

  /**
   * Show a warning notification
   */
  const showWarning = (message: string, options?: Omit<ShowToastOptions, 'message' | 'type'>) => {
    showNotification({
      message,
      type: NotificationSeverity.WARNING,
      ...options,
    });
  };

  return {
    showNotification,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
}

export default useNotifications; 