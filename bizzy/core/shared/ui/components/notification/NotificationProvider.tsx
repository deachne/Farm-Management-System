import React, { createContext, useContext, ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNotifications } from '../../hooks/useNotifications';
import { Toaster } from './Toaster';
import { NotificationSeverity, ShowToastOptions } from '../../types/notifications';

// Define the notification context type
export interface NotificationContextType {
  showNotification: (options: ShowToastOptions) => void;
  showSuccess: (message: string, options?: Omit<ShowToastOptions, 'message' | 'type'>) => void;
  showError: (message: string, options?: Omit<ShowToastOptions, 'message' | 'type'>) => void;
  showInfo: (message: string, options?: Omit<ShowToastOptions, 'message' | 'type'>) => void;
  showWarning: (message: string, options?: Omit<ShowToastOptions, 'message' | 'type'>) => void;
}

// Create the notification context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Provider props type
interface NotificationProviderProps {
  children: ReactNode;
}

/**
 * NotificationProvider component that integrates both AnythingLLM and LibreChat
 * notification systems into a unified interface.
 */
export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { showNotification, showSuccess, showError, showInfo, showWarning } = useNotifications();

  return (
    <NotificationContext.Provider 
      value={{ 
        showNotification, 
        showSuccess, 
        showError, 
        showInfo, 
        showWarning 
      }}
    >
      {children}
      
      {/* LibreChat toasts using Shadcn/UI components */}
      <Toaster />
      
      {/* AnythingLLM toasts using react-toastify */}
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        className="bizzy-toastify-container"
        aria-label="Notifications"
      />
    </NotificationContext.Provider>
  );
};

/**
 * Hook to use the notification context
 */
export const useNotificationContext = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
}; 