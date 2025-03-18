import type { Meta, StoryObj } from '@storybook/react';
import { ChatMessage } from '../../chat/ChatMessage';

/**
 * ChatMessage component displays individual messages in a chat interface
 * with support for different roles (user, assistant, system) and states.
 */
const meta: Meta<typeof ChatMessage> = {
  title: 'Chat/ChatMessage',
  component: ChatMessage,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    role: {
      control: 'select',
      options: ['user', 'assistant', 'system'],
      description: 'The role of the message sender',
    },
    content: {
      control: 'text',
      description: 'The message content',
    },
    isTyping: {
      control: 'boolean',
      description: 'Whether the message is currently being typed',
    },
    avatarSrc: {
      control: 'text',
      description: 'URL for the avatar image',
    },
    avatarFallback: {
      control: 'text',
      description: 'Fallback text for avatar (typically initials)',
    },
    senderName: {
      control: 'text',
      description: 'Display name of the sender',
    },
    timestamp: {
      control: 'text',
      description: 'Message timestamp',
    },
    showTimestamp: {
      control: 'boolean',
      description: 'Whether to show the timestamp',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ChatMessage>;

/**
 * Default assistant message
 */
export const DefaultAssistant: Story = {
  args: {
    role: 'assistant',
    content: 'Hello! How can I help you with your farm management today?',
    avatarFallback: 'AI',
  },
};

/**
 * User message example
 */
export const UserMessage: Story = {
  args: {
    role: 'user',
    content: "I'm looking for information about crop rotation for my wheat fields.",
    avatarFallback: 'JD',
  },
};

/**
 * System message example
 */
export const SystemMessage: Story = {
  args: {
    role: 'system',
    content: 'The system is processing your request. This may take a moment.',
    avatarFallback: 'S',
  },
};

/**
 * Typing indicator in action
 */
export const TypingMessage: Story = {
  args: {
    role: 'assistant',
    content: '',
    isTyping: true,
    avatarFallback: 'AI',
  },
};

/**
 * Long message with complex text
 */
export const LongMessage: Story = {
  args: {
    role: 'assistant',
    content: `Here's some detailed information about crop rotation for wheat fields:

1. **Benefits of Crop Rotation**:
   - Disrupts pest and disease cycles
   - Improves soil structure and fertility
   - Reduces soil erosion
   - Increases biodiversity

2. **Common Rotation Partners for Wheat**:
   - Legumes (soybeans, field peas, lentils)
   - Oilseeds (canola, sunflower)
   - Row crops (corn, potatoes)
   - Cover crops (clover, alfalfa)

3. **Rotation Timeline**:
   - Typical rotation is 3-4 years
   - Wheat → Legume → Row Crop → Back to Wheat
   
Would you like specific recommendations based on your soil type and climate?`,
    avatarFallback: 'AI',
  },
};

/**
 * Message with timestamp displayed
 */
export const MessageWithTimestamp: Story = {
  args: {
    role: 'assistant',
    content: 'Your soil test results have been analyzed. The pH level is 6.5, which is optimal for most crops.',
    avatarSrc: 'https://api.dicebear.com/7.x/bottts/svg?seed=farm-ai',
    avatarFallback: 'AI',
    timestamp: '10:45 AM',
    showTimestamp: true,
  },
};

/**
 * Message with sender name displayed
 */
export const MessageWithSenderName: Story = {
  args: {
    role: 'assistant',
    content: 'I recommend applying nitrogen fertilizer at a rate of 120 lbs/acre based on your current soil tests.',
    avatarFallback: 'AI',
    senderName: 'Farm Assistant',
  },
};

/**
 * User message with custom avatar
 */
export const UserWithCustomAvatar: Story = {
  args: {
    role: 'user',
    content: 'When should I start planting my spring wheat?',
    avatarSrc: 'https://api.dicebear.com/7.x/avataaars/svg?seed=farmer',
    avatarFallback: 'JD',
    senderName: 'John Deere',
  },
}; 