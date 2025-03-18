import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ChatContainer } from '../../chat/ChatContainer';
import { action } from '@storybook/addon-actions';

/**
 * The ChatContainer component provides a complete chat interface with messages
 * and an input for sending new messages. It handles scrolling, message display,
 * and user input in one component.
 */
const meta: Meta<typeof ChatContainer> = {
  title: 'Chat/ChatContainer',
  component: ChatContainer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    messages: {
      control: 'object',
      description: 'Array of message objects to display',
    },
    onSendMessage: { action: 'message-sent' },
    isProcessing: {
      control: 'boolean',
      description: 'Whether a message is currently being generated',
    },
    inputPlaceholder: {
      control: 'text',
      description: 'Placeholder text for the input',
    },
    inputDisabled: {
      control: 'boolean', 
      description: 'Whether the input is disabled',
    },
    autoScroll: {
      control: 'boolean',
      description: 'Whether to auto-scroll to the bottom on new messages',
    },
    showAttachment: {
      control: 'boolean',
      description: 'Whether to show the attachment option',
    },
    showVoiceInput: {
      control: 'boolean',
      description: 'Whether to show the voice input option',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '800px', height: '600px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ChatContainer>;

/**
 * Default empty chat
 */
export const Empty: Story = {
  args: {
    messages: [],
    inputPlaceholder: 'Type your question about farming...',
    onSendMessage: action('message-sent'),
  },
};

/**
 * Chat with a sample conversation
 */
export const WithConversation: Story = {
  args: {
    messages: [
      {
        role: 'assistant',
        content: 'Hello! I\'m your farm management assistant. How can I help you today?',
        avatarFallback: 'FA',
        senderName: 'Farm Assistant',
      },
      {
        role: 'user',
        content: 'I need to know when to plant my winter wheat this year.',
        avatarFallback: 'JD',
      },
      {
        role: 'assistant',
        content: 'For winter wheat, the ideal planting time depends on your location. Generally, you want to plant when soil temperatures at a 4-inch depth are between 50-60°F (10-15°C). This is typically 6-8 weeks before the ground freezes. Could you tell me your region so I can provide more specific guidance?',
        avatarFallback: 'FA',
        senderName: 'Farm Assistant',
      },
      {
        role: 'user',
        content: 'I\'m in the Midwest, specifically Iowa.',
        avatarFallback: 'JD',
      },
      {
        role: 'assistant',
        content: 'For Iowa, the optimal winter wheat planting window is typically from late September to mid-October. Aim to plant after the Hessian fly-free date, which is around September 25th for southern Iowa and October 5th for northern Iowa. This timing allows the wheat to establish before winter dormancy while reducing pest pressure. Would you like information about recommended wheat varieties for Iowa?',
        avatarFallback: 'FA',
        senderName: 'Farm Assistant',
      },
    ],
    inputPlaceholder: 'Type your message...',
    onSendMessage: action('message-sent'),
  },
};

/**
 * Interactive chat example with working message submission
 */
export const Interactive: Story = {
  render: () => {
    const [messages, setMessages] = useState([
      {
        role: 'assistant' as const,
        content: 'Hello! I\'m your farm management assistant. How can I help you today?',
        avatarFallback: 'FA',
        timestamp: '10:30 AM',
        showTimestamp: true,
      },
    ]);
    const [isProcessing, setIsProcessing] = useState(false);
    
    const handleSendMessage = (message: string) => {
      // Add user message
      setMessages([
        ...messages,
        {
          role: 'user' as const,
          content: message,
          avatarFallback: 'Me',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          showTimestamp: true,
        },
      ]);
      
      // Simulate AI response
      setIsProcessing(true);
      setTimeout(() => {
        setMessages((currentMessages) => [
          ...currentMessages,
          {
            role: 'assistant' as const,
            content: getFarmResponse(message),
            avatarFallback: 'FA',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            showTimestamp: true,
          },
        ]);
        setIsProcessing(false);
      }, 2000);
    };
    
    return (
      <ChatContainer
        messages={messages}
        onSendMessage={handleSendMessage}
        isProcessing={isProcessing}
        inputPlaceholder="Ask me about farming..."
      />
    );
  },
};

/**
 * Simple AI response generator for the interactive example
 */
function getFarmResponse(message: string): string {
  const lowercaseMessage = message.toLowerCase();
  
  if (lowercaseMessage.includes('crop') || lowercaseMessage.includes('plant')) {
    return 'Based on your soil analysis and local climate data, I recommend focusing on corn, soybeans, and wheat as your primary crops. Would you like detailed planting schedules for each?';
  }
  
  if (lowercaseMessage.includes('pest') || lowercaseMessage.includes('disease')) {
    return 'I\'ve detected several pest management opportunities. Recent satellite imagery shows potential aphid activity in your north fields. Would you like me to suggest integrated pest management strategies?';
  }
  
  if (lowercaseMessage.includes('weather') || lowercaseMessage.includes('forecast')) {
    return 'The 10-day forecast shows mild temperatures with a chance of rain this weekend. This is favorable for your current growth stage. I\'ve updated your irrigation schedule to account for the expected precipitation.';
  }
  
  if (lowercaseMessage.includes('equipment') || lowercaseMessage.includes('machinery')) {
    return 'Your equipment maintenance records indicate the combine harvester is due for servicing. Would you like me to check availability with your preferred service provider?';
  }
  
  return 'I understand you\'re interested in optimizing your farm operations. Could you provide more details about your specific needs, or would you like to see a summary of current field conditions?';
} 