import { expect } from '@storybook/jest';
import { within, userEvent, waitFor } from '@storybook/testing-library';
import Notification from './Notification.jsx';

export default {
  title: 'Core/Notification',
  component: Notification,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['info', 'success', 'warning', 'error'],
    },
    onDismiss: { action: 'dismissed' },
    autoClose: { control: 'boolean' },
    duration: { control: 'number' },
    showIcon: { control: 'boolean' },
  },
};

// Info notification
export const Info = {
  args: {
    title: 'Information',
    message: 'This is an informational notification.',
    type: 'info',
    autoClose: false,
  },
};

// Success notification
export const Success = {
  args: {
    title: 'Success',
    message: 'The operation was completed successfully.',
    type: 'success',
    autoClose: false,
  },
};

// Warning notification
export const Warning = {
  args: {
    title: 'Warning',
    message: 'This action might have consequences.',
    type: 'warning',
    autoClose: false,
  },
};

// Error notification
export const Error = {
  args: {
    title: 'Error',
    message: 'An error occurred while processing your request.',
    type: 'error',
    autoClose: false,
  },
};

// Auto-closing notification
export const AutoClose = {
  args: {
    title: 'Auto-closing Notification',
    message: 'This notification will automatically close in 3 seconds.',
    type: 'info',
    autoClose: true,
    duration: 3000,
  },
};

// Without title
export const MessageOnly = {
  args: {
    message: 'This is a notification with only a message and no title.',
    type: 'info',
    autoClose: false,
  },
};

// Without icon
export const WithoutIcon = {
  args: {
    title: 'No Icon',
    message: 'This notification is displayed without an icon.',
    type: 'info',
    showIcon: false,
    autoClose: false,
  },
};

// Interactive test - dismissal
export const Dismissible = {
  args: {
    title: 'Dismissible Notification',
    message: 'Click the X button to dismiss this notification.',
    type: 'info',
    autoClose: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Verify notification is rendered
    const notification = canvas.getByText('Dismissible Notification').closest('div');
    await expect(notification).toBeInTheDocument();
    
    // Find and click the dismiss button
    const dismissButton = canvas.getByLabelText('Dismiss');
    await userEvent.click(dismissButton);
    
    // Verify notification is removed
    await waitFor(() => {
      const notifications = canvas.queryByText('Dismissible Notification');
      expect(notifications).not.toBeInTheDocument();
    });
  },
};

// Multiple notifications
export const NotificationGroup = {
  render: () => (
    <div>
      <Notification
        title="Success"
        message="Document successfully uploaded."
        type="success"
        autoClose={false}
      />
      <Notification
        title="Information"
        message="Your account settings have been updated."
        type="info"
        autoClose={false}
      />
      <Notification
        title="Warning"
        message="Your session will expire in 5 minutes."
        type="warning"
        autoClose={false}
      />
    </div>
  ),
}; 