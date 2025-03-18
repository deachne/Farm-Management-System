import React from 'react';
import { Meta, StoryObj } from '@storybook/react';

import { RadioGroup } from '../RadioGroup';
import { Radio } from '../Radio';

/**
 * RadioGroup component for organizing related Radio buttons
 */
const meta: Meta<typeof RadioGroup> = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'text',
      description: 'Name attribute for the radio inputs',
    },
    label: {
      control: 'text',
      description: 'Label for the radio group',
    },
    hideLabel: {
      control: 'boolean',
      description: 'Whether to hide the label visually',
    },
    helperText: {
      control: 'text',
      description: 'Helper text to display below the radio group',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message to display below the radio group',
    },
    orientation: {
      control: 'radio',
      options: ['vertical', 'horizontal'],
      description: 'Layout direction for radio options',
    },
    value: {
      control: 'text',
      description: 'Currently selected value',
    },
    onChange: {
      action: 'changed',
      description: 'Handler for when selection changes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

/**
 * Default vertical radio group
 */
export const Default: Story = {
  render: () => (
    <RadioGroup name="default-group" label="Select an option">
      <Radio label="Option 1" value="option1" />
      <Radio label="Option 2" value="option2" />
      <Radio label="Option 3" value="option3" />
    </RadioGroup>
  ),
};

/**
 * Horizontal layout for radio options
 */
export const HorizontalLayout: Story = {
  render: () => (
    <RadioGroup 
      name="horizontal-group" 
      label="Select an option" 
      orientation="horizontal"
    >
      <Radio label="Option 1" value="option1" />
      <Radio label="Option 2" value="option2" />
      <Radio label="Option 3" value="option3" />
    </RadioGroup>
  ),
};

/**
 * With helper text at the group level
 */
export const WithHelperText: Story = {
  render: () => (
    <RadioGroup 
      name="helper-group" 
      label="Subscription Plan" 
      helperText="Choose the option that best fits your needs"
    >
      <Radio 
        label="Basic" 
        value="basic" 
        helperText="For individual users"
      />
      <Radio 
        label="Pro" 
        value="pro" 
        helperText="For small teams up to 5 users"
      />
      <Radio 
        label="Enterprise" 
        value="enterprise" 
        helperText="For large organizations with unlimited users"
      />
    </RadioGroup>
  ),
};

/**
 * With error message
 */
export const WithError: Story = {
  render: () => (
    <RadioGroup 
      name="error-group" 
      label="Required Selection" 
      errorMessage="Please select an option to continue"
    >
      <Radio label="Option 1" value="option1" />
      <Radio label="Option 2" value="option2" />
      <Radio label="Option 3" value="option3" />
    </RadioGroup>
  ),
};

/**
 * Controlled example with state
 */
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState('option2');
    
    return (
      <div className="space-y-4">
        <p>Selected value: <strong>{value}</strong></p>
        <RadioGroup 
          name="controlled-group" 
          label="Controlled Example" 
          value={value}
          onChange={setValue}
        >
          <Radio label="Option 1" value="option1" />
          <Radio label="Option 2" value="option2" />
          <Radio label="Option 3" value="option3" />
        </RadioGroup>
        <div className="flex gap-2">
          {['option1', 'option2', 'option3'].map((option) => (
            <button
              key={option}
              onClick={() => setValue(option)}
              className={`px-3 py-1 rounded-md ${
                value === option
                  ? 'bg-theme-accent-primary text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Set {option}
            </button>
          ))}
        </div>
      </div>
    );
  },
};

/**
 * With different radio sizes
 */
export const MixedRadioSizes: Story = {
  render: () => (
    <RadioGroup name="sizes-group" label="Different Radio Sizes">
      <Radio label="Small Radio" value="small" size="sm" />
      <Radio label="Medium Radio" value="medium" size="md" />
      <Radio label="Large Radio" value="large" size="lg" />
    </RadioGroup>
  ),
};

/**
 * With disabled options
 */
export const WithDisabledOptions: Story = {
  render: () => (
    <RadioGroup name="disabled-group" label="Some options are disabled">
      <Radio label="Available option" value="available" />
      <Radio label="Disabled option" value="disabled" disabled />
      <Radio label="Another available option" value="another" />
      <Radio label="Disabled and checked" value="disabled-checked" disabled defaultChecked />
    </RadioGroup>
  ),
}; 