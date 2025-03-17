import React, { useState } from 'react';
import { useNotificationContext } from '../notification/NotificationProvider';

/**
 * Example component that demonstrates how to use the notification system
 * in a real-world component. This example shows a form with validation
 * and uses notifications for feedback.
 */
export const NotificationExample: React.FC = () => {
  const { showSuccess, showError, showInfo } = useNotificationContext();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!email || !email.includes('@')) {
      showError('Please enter a valid email address.', {
        title: 'Validation Error'
      });
      return;
    }
    
    if (!message) {
      showError('Please enter a message.', {
        title: 'Validation Error'
      });
      return;
    }
    
    // Show info notification while submitting
    showInfo('Submitting your message...', {
      title: 'Please Wait'
    });
    
    setIsSubmitting(true);
    
    // Simulate API call
    try {
      // In a real component, this would be an actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success case
      showSuccess('Your message has been sent successfully!', {
        title: 'Success',
        duration: 5000
      });
      
      // Reset form
      setEmail('');
      setMessage('');
    } catch (error) {
      // Error case
      showError('Failed to send your message. Please try again later.', {
        title: 'Error',
        duration: 8000
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Contact Form Example</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="your@email.com"
            disabled={isSubmitting}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Your message here..."
            disabled={isSubmitting}
          />
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NotificationExample; 