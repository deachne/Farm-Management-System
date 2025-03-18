import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ChatInput } from '../../chat/ChatInput';
import { action } from '@storybook/addon-actions';

/**
 * ChatInput component provides a textarea with buttons for sending messages,
 * attaching files, and recording voice in a chat interface.
 */
const meta: Meta<typeof ChatInput> = {
  title: 'Chat/ChatInput',
  component: ChatInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onSubmit: { action: 'submitted' },
    onChange: { action: 'changed' },
    initialValue: {
      control: 'text',
      description: 'Initial text value in the input',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text to display when empty',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    showSendButton: {
      control: 'boolean',
      description: 'Whether to show the send button',
    },
    showAttachmentButton: {
      control: 'boolean',
      description: 'Whether to show the attachment button',
    },
    showVoiceButton: {
      control: 'boolean',
      description: 'Whether to show the voice input button',
    },
    maxHeight: {
      control: { type: 'number', min: 40, max: 500, step: 10 },
      description: 'Maximum height of the input in pixels',
    },
    isProcessing: {
      control: 'boolean',
      description: 'Whether the system is processing a message',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ChatInput>;

/**
 * Default state of the chat input
 */
export const Default: Story = {
  args: {
    placeholder: 'Type a message about your farm...',
    onSubmit: action('message-submitted'),
    onChange: action('input-changed'),
  },
};

/**
 * Input with initial text value
 */
export const WithInitialValue: Story = {
  args: {
    initialValue: 'How do I manage irrigation for my corn field?',
    onSubmit: action('message-submitted'),
    onChange: action('input-changed'),
  },
};

/**
 * Disabled input state
 */
export const Disabled: Story = {
  args: {
    placeholder: 'Type a message...',
    disabled: true,
  },
};

/**
 * Input in processing state (when AI is generating a response)
 */
export const Processing: Story = {
  args: {
    placeholder: 'Type a message...',
    isProcessing: true,
  },
};

/**
 * Custom configuration with only send button
 */
export const SendOnly: Story = {
  args: {
    placeholder: 'Type a message...',
    showAttachmentButton: false,
    showVoiceButton: false,
  },
};

/**
 * Input with controlled state example
 */
export const Controlled: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState('');
    
    return (
      <div className="flex flex-col gap-4">
        <div className="font-medium">Current value: {value || '(empty)'}</div>
        <ChatInput 
          placeholder="Type something..."
          onChange={(v) => setValue(v)}
          onSubmit={(msg) => {
            action('submitted')(msg);
            setValue('');
          }}
        />
      </div>
    );
  },
};

/**
 * Input with agricultural preset options
 */
export const WithFarmContext: Story = {
  args: {
    placeholder: "Ask about crop management, livestock, or weather...",
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState(args.initialValue || '');
    
    const presetMessages = [
      "How do I optimize irrigation for my corn fields?",
      "What's the best crop rotation for wheat?",
      "When should I apply fertilizer to my soybeans?",
      "How can I monitor my livestock health more efficiently?"
    ];
    
    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {presetMessages.map((msg, i) => (
            <button 
              key={i}
              className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm"
              onClick={() => setValue(msg)}
            >
              {msg}
            </button>
          ))}
        </div>
        
        <ChatInput 
          {...args}
          initialValue={value}
          onChange={(v) => setValue(v)}
          onSubmit={(msg) => {
            action('submitted')(msg);
            setValue('');
          }}
        />
      </div>
    );
  },
}; 