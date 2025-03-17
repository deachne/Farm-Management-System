export * from './Toast';
export * from './Toaster';
export { NotificationProvider, useNotificationContext } from './NotificationProvider';

// Import what we're exporting to use in the default export
import { NotificationProvider, useNotificationContext } from './NotificationProvider';

// Export a default object for importing everything at once
export default {
  NotificationProvider,
  useNotificationContext,
}; 