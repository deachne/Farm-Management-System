import React from 'react';
import { Radio } from './Radio';

export default {
  title: 'Core/Radio',
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
  },
  parameters: {
    docs: {
      description: {
        component: 'Radio button component with multiple sizes and states. Follows the BizzyPerson design system.',
      },
    },
  },
};

// Base story
export const Default = {
  args: {
    label: 'Radio Option',
    name: 'default-radio'
  },
};

// Size examples
export const Small = {
  args: {
    label: 'Small Radio',
    size: 'sm',
    name: 'size-radio',
  },
};

export const Medium = {
  args: {
    label: 'Medium Radio',
    size: 'md',
    name: 'size-radio',
  },
};

export const Large = {
  args: {
    label: 'Large Radio',
    size: 'lg',
    name: 'size-radio',
  },
};

// State examples
export const Checked = {
  args: {
    label: 'Checked Radio',
    checked: true,
    name: 'state-radio',
  },
};

export const Unchecked = {
  args: {
    label: 'Unchecked Radio',
    checked: false,
    name: 'state-radio',
  },
};

export const Disabled = {
  args: {
    label: 'Disabled Radio',
    disabled: true,
    name: 'state-radio',
  },
};

export const DisabledChecked = {
  args: {
    label: 'Disabled Checked Radio',
    disabled: true,
    checked: true,
    name: 'state-radio',
  },
};

// Orientation examples
export const VerticalOrientation = {
  args: {
    label: 'Vertical Orientation',
    orientation: 'vertical',
    helperText: 'Helper text appears below the radio button',
    name: 'orientation-radio',
  },
};

// Text examples
export const WithHelperText = {
  args: {
    label: 'With Helper Text',
    helperText: 'This is a helpful message about the radio button',
    name: 'text-radio',
  },
};

export const WithErrorMessage = {
  args: {
    label: 'With Error Message',
    errorMessage: 'This selection is required',
    name: 'text-radio',
  },
};

export const NoLabel = {
  args: {
    name: 'no-label-radio',
  },
};

// Radio group example
export const RadioGroupExample = () => (
  <div className="space-y-6">
    <fieldset className="space-y-2">
      <legend className="text-lg font-medium mb-2">Select an option</legend>
      <Radio 
        label="Option 1" 
        name="radio-group-1" 
        id="option-1" 
        defaultChecked 
      />
      <Radio 
        label="Option 2" 
        name="radio-group-1" 
        id="option-2" 
      />
      <Radio 
        label="Option 3" 
        name="radio-group-1" 
        id="option-3" 
      />
    </fieldset>
    
    <fieldset className="space-y-2">
      <legend className="text-lg font-medium mb-2">With helper text</legend>
      <Radio 
        label="Basic plan" 
        name="radio-group-2" 
        id="plan-1" 
        helperText="Best for personal use" 
        defaultChecked 
      />
      <Radio 
        label="Professional plan" 
        name="radio-group-2" 
        id="plan-2" 
        helperText="Best for small teams" 
      />
      <Radio 
        label="Enterprise plan" 
        name="radio-group-2" 
        id="plan-3" 
        helperText="Best for large organizations" 
      />
    </fieldset>
    
    <fieldset className="space-y-2">
      <legend className="text-lg font-medium mb-2">Different sizes</legend>
      <Radio 
        label="Small radio" 
        name="radio-group-3" 
        id="size-1" 
        size="sm" 
      />
      <Radio 
        label="Medium radio" 
        name="radio-group-3" 
        id="size-2" 
        size="md" 
        defaultChecked 
      />
      <Radio 
        label="Large radio" 
        name="radio-group-3" 
        id="size-3" 
        size="lg" 
      />
    </fieldset>
    
    <fieldset className="space-y-2">
      <legend className="text-lg font-medium mb-2">Disabled state</legend>
      <Radio 
        label="Disabled radio" 
        name="radio-group-4" 
        id="disabled-1" 
        disabled 
      />
      <Radio 
        label="Disabled checked radio" 
        name="radio-group-4" 
        id="disabled-2" 
        disabled 
        defaultChecked 
      />
    </fieldset>
  </div>
);

RadioGroupExample.parameters = {
  docs: {
    description: {
      story: 'Examples of radio button groups in different configurations.',
    },
  },
};

// Controlled Radio example
export const ControlledRadio = () => {
  const [selected, setSelected] = React.useState('option1');
  
  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2">Selected option: <strong>{selected}</strong></p>
        <div className="space-y-2">
          <Radio 
            label="Option 1" 
            name="controlled-radio" 
            id="controlled-1" 
            checked={selected === 'option1'}
            onChange={() => setSelected('option1')}
          />
          <Radio 
            label="Option 2" 
            name="controlled-radio" 
            id="controlled-2" 
            checked={selected === 'option2'}
            onChange={() => setSelected('option2')}
          />
          <Radio 
            label="Option 3" 
            name="controlled-radio" 
            id="controlled-3" 
            checked={selected === 'option3'}
            onChange={() => setSelected('option3')}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button 
          onClick={() => setSelected('option1')}
          className="px-3 py-1 bg-blue-600 text-white rounded-md"
        >
          Select Option 1
        </button>
        <button 
          onClick={() => setSelected('option2')}
          className="px-3 py-1 bg-blue-600 text-white rounded-md"
        >
          Select Option 2
        </button>
        <button 
          onClick={() => setSelected('option3')}
          className="px-3 py-1 bg-blue-600 text-white rounded-md"
        >
          Select Option 3
        </button>
      </div>
    </div>
  );
};

ControlledRadio.parameters = {
  docs: {
    description: {
      story: 'An example of controlled radio buttons using React state.',
    },
  },
}; 