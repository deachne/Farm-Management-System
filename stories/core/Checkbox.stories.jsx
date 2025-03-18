import React from 'react';
import { Checkbox } from './Checkbox';

export default {
  title: 'Core/Checkbox',
  component: Checkbox,
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the checkbox',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'The orientation of the checkbox relative to its label',
      table: {
        defaultValue: { summary: 'horizontal' },
      },
    },
    checked: {
      control: 'boolean',
      description: 'Whether the checkbox is checked',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    indeterminate: {
      control: 'boolean',
      description: 'Whether the checkbox is in an indeterminate state',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the checkbox is disabled',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    label: {
      control: 'text',
      description: 'Label text for the checkbox',
    },
    helperText: {
      control: 'text',
      description: 'Helper text to display below the checkbox',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message to display below the checkbox',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Checkbox component with multiple states and variations. Follows the BizzyPerson design system.',
      },
    },
  },
};

// Base story
export const Default = {
  args: {
    label: 'Default Checkbox',
  },
};

// Size examples
export const Small = {
  args: {
    label: 'Small Checkbox',
    size: 'sm',
  },
};

export const Medium = {
  args: {
    label: 'Medium Checkbox',
    size: 'md',
  },
};

export const Large = {
  args: {
    label: 'Large Checkbox',
    size: 'lg',
  },
};

// State examples
export const Checked = {
  args: {
    label: 'Checked Checkbox',
    checked: true,
  },
};

export const Unchecked = {
  args: {
    label: 'Unchecked Checkbox',
    checked: false,
  },
};

export const Indeterminate = {
  args: {
    label: 'Indeterminate Checkbox',
    indeterminate: true,
  },
};

export const Disabled = {
  args: {
    label: 'Disabled Checkbox',
    disabled: true,
  },
};

export const DisabledChecked = {
  args: {
    label: 'Disabled Checked Checkbox',
    disabled: true,
    checked: true,
  },
};

// Orientation examples
export const VerticalOrientation = {
  args: {
    label: 'Vertical Orientation',
    orientation: 'vertical',
    helperText: 'Helper text appears below the checkbox',
  },
};

// Text examples
export const WithHelperText = {
  args: {
    label: 'With Helper Text',
    helperText: 'This is a helpful message about the checkbox',
  },
};

export const WithErrorMessage = {
  args: {
    label: 'With Error Message',
    errorMessage: 'This field is required',
  },
};

export const NoLabel = {
  args: {},
};

// Example of multiple checkboxes
export const CheckboxGroup = () => (
  <div className="space-y-4">
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Basic options</h3>
      <Checkbox label="Option 1" id="option-1" />
      <Checkbox label="Option 2" id="option-2" defaultChecked />
      <Checkbox label="Option 3" id="option-3" />
    </div>
    
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Advanced options</h3>
      <Checkbox 
        label="Option with helper text" 
        id="option-4" 
        helperText="This option enables advanced features" 
      />
      <Checkbox 
        label="Required option" 
        id="option-5"
        errorMessage="This field is required" 
      />
      <Checkbox 
        label="Disabled option" 
        id="option-6"
        disabled 
      />
      <Checkbox 
        label="Indeterminate option" 
        id="option-7"
        indeterminate 
      />
    </div>
  </div>
);

CheckboxGroup.parameters = {
  docs: {
    description: {
      story: 'An example of a group of checkboxes in a form.',
    },
  },
};

// Controlled checkbox example
export const ControlledCheckbox = () => {
  const [isChecked, setIsChecked] = React.useState(false);
  
  return (
    <div className="space-y-4">
      <Checkbox 
        label={`Controlled checkbox (${isChecked ? 'checked' : 'unchecked'})`}
        checked={isChecked}
        onChange={(e) => setIsChecked(e.target.checked)}
      />
      <button 
        onClick={() => setIsChecked(!isChecked)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Toggle Checkbox
      </button>
    </div>
  );
};

ControlledCheckbox.parameters = {
  docs: {
    description: {
      story: 'An example of a controlled checkbox using React state.',
    },
  },
}; 