import React from 'react';
import { Meta, StoryObj } from '@storybook/react';

import { Radio } from '../Radio';
import { RadioGroup } from '../RadioGroup';

const meta: Meta<typeof Radio> = {
  title: 'Components/Radio',
  component: Radio,
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the radio button',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'The orientation of the radio button relative to its label',
      table: {
        defaultValue: { summary: 'horizontal' },
      },
    },
    checked: {
      control: 'boolean',
      description: 'Whether the radio button is checked',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the radio button is disabled',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    label: {
      control: 'text',
      description: 'Label text for the radio button',
    },
    helperText: {
      control: 'text',
      description: 'Helper text to display below the radio button',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message to display below the radio button',
    },
    name: {
      control: 'text',
      description: 'Name attribute for the radio input',
    },
    value: {
      control: 'text',
      description: 'Value attribute for the radio input',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Radio button component with multiple sizes and states. Follows the BizzyPerson design system.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Radio>;

// Base story
export const Default: Story = {
  args: {
    label: 'Radio Option',
    name: 'default-radio'
  },
};

// Size examples
export const Small: Story = {
  args: {
    label: 'Small Radio',
    size: 'sm',
    name: 'size-radio',
  },
};

export const Medium: Story = {
  args: {
    label: 'Medium Radio',
    size: 'md',
    name: 'size-radio',
  },
};

export const Large: Story = {
  args: {
    label: 'Large Radio',
    size: 'lg',
    name: 'size-radio',
  },
};

// State examples
export const Checked: Story = {
  args: {
    label: 'Checked Radio',
    checked: true,
    name: 'state-radio',
  },
};

export const Unchecked: Story = {
  args: {
    label: 'Unchecked Radio',
    checked: false,
    name: 'state-radio',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Radio',
    disabled: true,
    name: 'state-radio',
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'Disabled Checked Radio',
    disabled: true,
    checked: true,
    name: 'state-radio',
  },
};

// Orientation examples
export const VerticalOrientation: Story = {
  args: {
    label: 'Vertical Orientation',
    orientation: 'vertical',
    helperText: 'Helper text appears below the radio button',
    name: 'orientation-radio',
  },
};

// Text examples
export const WithHelperText: Story = {
  args: {
    label: 'With Helper Text',
    helperText: 'This is a helpful message about the radio button',
    name: 'text-radio',
  },
};

export const WithErrorMessage: Story = {
  args: {
    label: 'With Error Message',
    errorMessage: 'This selection is required',
    name: 'text-radio',
  },
};

export const NoLabel: Story = {
  args: {
    name: 'no-label-radio',
  },
};

/**
 * Example using the RadioGroup component
 */
export const WithRadioGroup: Story = {
  render: () => (
    <div className="space-y-6">
      <RadioGroup 
        name="radio-group-1" 
        label="Select an option"
      >
        <Radio 
          label="Option 1" 
          value="option1" 
          defaultChecked 
        />
        <Radio 
          label="Option 2" 
          value="option2" 
        />
        <Radio 
          label="Option 3" 
          value="option3" 
        />
      </RadioGroup>
      
      <RadioGroup 
        name="radio-group-2" 
        label="With helper text"
        helperText="Choose the plan that best fits your needs"
      >
        <Radio 
          label="Basic plan" 
          value="basic" 
          helperText="Best for personal use" 
          defaultChecked 
        />
        <Radio 
          label="Professional plan" 
          value="pro" 
          helperText="Best for small teams" 
        />
        <Radio 
          label="Enterprise plan" 
          value="enterprise" 
          helperText="Best for large organizations" 
        />
      </RadioGroup>
      
      <RadioGroup 
        name="radio-group-3" 
        label="Different sizes"
      >
        <Radio 
          label="Small radio" 
          value="sm" 
          size="sm" 
        />
        <Radio 
          label="Medium radio" 
          value="md" 
          size="md" 
          defaultChecked 
        />
        <Radio 
          label="Large radio" 
          value="lg" 
          size="lg" 
        />
      </RadioGroup>
      
      <RadioGroup 
        name="radio-group-4" 
        label="Disabled state"
      >
        <Radio 
          label="Disabled radio" 
          value="disabled-1" 
          disabled 
        />
        <Radio 
          label="Disabled checked radio" 
          value="disabled-2" 
          disabled 
          defaultChecked 
        />
      </RadioGroup>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example using the RadioGroup component to organize radio buttons.',
      },
    },
  },
};

// Controlled Radio example
export const ControlledRadioGroup: Story = {
  render: () => {
    const [selected, setSelected] = React.useState('option1');
    
    return (
      <div className="space-y-4">
        <div>
          <p className="mb-2">Selected option: <strong>{selected}</strong></p>
          <RadioGroup 
            name="controlled-radio" 
            label="Controlled Radio Group"
            value={selected}
            onChange={setSelected}
          >
            <Radio 
              label="Option 1" 
              value="option1" 
            />
            <Radio 
              label="Option 2" 
              value="option2" 
            />
            <Radio 
              label="Option 3" 
              value="option3" 
            />
          </RadioGroup>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setSelected('option1')}
            className="px-3 py-1 bg-theme-accent-primary text-white rounded-md"
          >
            Select Option 1
          </button>
          <button 
            onClick={() => setSelected('option2')}
            className="px-3 py-1 bg-theme-accent-primary text-white rounded-md"
          >
            Select Option 2
          </button>
          <button 
            onClick={() => setSelected('option3')}
            className="px-3 py-1 bg-theme-accent-primary text-white rounded-md"
          >
            Select Option 3
          </button>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'An example of controlled radio buttons using React state with RadioGroup.',
      },
    },
  },
}; 