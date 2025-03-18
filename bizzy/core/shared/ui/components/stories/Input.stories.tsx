import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Search, Mail, Lock, User, AlertCircle, Check } from 'lucide-react';

import { Input } from '../Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'filled', 'fieldInput'],
      description: 'The visual style of the input field',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the input field',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    status: {
      control: 'select',
      options: ['default', 'error', 'success', 'warning'],
      description: 'The validation status of the input',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input field is disabled',
    },
    required: {
      control: 'boolean',
      description: 'Whether the input field is required',
    },
    label: {
      control: 'text',
      description: 'Label text for the input field',
    },
    helperText: {
      control: 'text',
      description: 'Helper text to display below the input field',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message to display below the input field',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input field',
    },
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'tel', 'url'],
      description: 'The type of input field',
      table: {
        defaultValue: { summary: 'text' },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Input component for text entry with multiple variants, sizes, and states. Follows the BizzyPerson design system.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

// Base story
export const Default: Story = {
  args: {
    placeholder: 'Enter text',
    id: 'default-input',
  },
};

// Variant examples
export const DefaultVariant: Story = {
  args: {
    variant: 'default',
    placeholder: 'Default input',
    id: 'default-variant',
  },
};

export const OutlineVariant: Story = {
  args: {
    variant: 'outline',
    placeholder: 'Outline input',
    id: 'outline-variant',
  },
};

export const FilledVariant: Story = {
  args: {
    variant: 'filled',
    placeholder: 'Filled input',
    id: 'filled-variant',
  },
};

export const FieldInputVariant: Story = {
  args: {
    variant: 'fieldInput',
    placeholder: 'Field input',
    id: 'field-variant',
  },
};

// Size examples
export const Small: Story = {
  args: {
    size: 'sm',
    placeholder: 'Small input',
    id: 'small-input',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    placeholder: 'Medium input',
    id: 'medium-input',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    placeholder: 'Large input',
    id: 'large-input',
  },
};

// Status examples
export const ErrorState: Story = {
  args: {
    status: 'error',
    placeholder: 'Error input',
    id: 'error-input',
    errorMessage: 'This field contains an error',
  },
};

export const SuccessState: Story = {
  args: {
    status: 'success',
    placeholder: 'Success input',
    id: 'success-input',
    helperText: 'Input is valid',
  },
};

export const WarningState: Story = {
  args: {
    status: 'warning',
    placeholder: 'Warning input',
    id: 'warning-input',
    helperText: 'This value may need attention',
  },
};

// State examples
export const WithLabel: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email',
    id: 'input-with-label',
  },
};

export const Required: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email',
    id: 'required-input',
    required: true,
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter password',
    type: 'password',
    id: 'input-with-helper',
    helperText: 'Password must be at least 8 characters',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter username',
    id: 'disabled-input',
    disabled: true,
  },
};

// Input with icons
export const WithLeftIcon: Story = {
  args: {
    placeholder: 'Search...',
    id: 'input-with-left-icon',
    leftIcon: <Search className="h-4 w-4" />,
  },
};

export const WithRightIcon: Story = {
  args: {
    placeholder: 'Enter email',
    id: 'input-with-right-icon',
    rightIcon: <Mail className="h-4 w-4" />,
  },
};

export const WithBothIcons: Story = {
  args: {
    placeholder: 'Enter username',
    id: 'input-with-both-icons',
    leftIcon: <User className="h-4 w-4" />,
    rightIcon: <Check className="h-4 w-4" />,
  },
};

// Different input types
export const PasswordInput: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter password',
    type: 'password',
    id: 'password-input',
    leftIcon: <Lock className="h-4 w-4" />,
  },
};

export const EmailInput: Story = {
  args: {
    label: 'Email',
    placeholder: 'your@email.com',
    type: 'email',
    id: 'email-input',
    leftIcon: <Mail className="h-4 w-4" />,
  },
};

// Example of multiple inputs in a form
export const InputVariantShowcase: Story = {
  render: () => (
    <div className="flex flex-col gap-6 max-w-md">
      <Input 
        label="Username" 
        placeholder="Enter username" 
        id="showcase-username"
        leftIcon={<User className="h-4 w-4" />}
      />
      
      <Input 
        label="Email" 
        placeholder="your@email.com" 
        type="email" 
        id="showcase-email"
        leftIcon={<Mail className="h-4 w-4" />}
        required
      />
      
      <Input 
        label="Password" 
        placeholder="Enter password" 
        type="password" 
        id="showcase-password"
        leftIcon={<Lock className="h-4 w-4" />}
        helperText="Password must be at least 8 characters"
      />
      
      <Input 
        label="Confirm Password" 
        placeholder="Confirm password" 
        type="password" 
        id="showcase-confirm"
        leftIcon={<Lock className="h-4 w-4" />}
        status="error"
        errorMessage="Passwords do not match"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'An example form showcasing different input variants and states.',
      },
    },
  },
}; 