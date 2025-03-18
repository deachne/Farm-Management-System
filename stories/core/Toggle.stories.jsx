import React from 'react';
import { Toggle } from './Toggle';

export default {
  title: 'Core/Toggle',
  component: Toggle,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'success', 'warning', 'danger'],
      description: 'The visual style of the toggle',
      table: {
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the toggle',
      table: {
        defaultValue: { summary: 'md' },
      },
    },
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'The orientation of the toggle relative to its label',
      table: {
        defaultValue: { summary: 'horizontal' },
      },
    },
    checked: {
      control: 'boolean',
      description: 'Whether the toggle is checked (controlled mode)',
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Whether the toggle is initially checked (uncontrolled mode)',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the toggle is disabled',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    label: {
      control: 'text',
      description: 'Label text for the toggle',
    },
    helperText: {
      control: 'text',
      description: 'Helper text to display below the toggle',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message to display below the toggle',
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Toggle switch component with multiple variants and states. Follows the BizzyPerson design system.',
      },
    },
  },
};

// Base story
export const Default = {
  args: {
    label: 'Toggle Switch',
  },
};

// Variant examples
export const Primary = {
  args: {
    variant: 'primary',
    label: 'Primary Toggle',
    defaultChecked: true,
  },
};

export const Success = {
  args: {
    variant: 'success',
    label: 'Success Toggle',
    defaultChecked: true,
  },
};

export const Warning = {
  args: {
    variant: 'warning',
    label: 'Warning Toggle',
    defaultChecked: true,
  },
};

export const Danger = {
  args: {
    variant: 'danger',
    label: 'Danger Toggle',
    defaultChecked: true,
  },
};

// Size examples
export const Small = {
  args: {
    size: 'sm',
    label: 'Small Toggle',
  },
};

export const Medium = {
  args: {
    size: 'md',
    label: 'Medium Toggle',
  },
};

export const Large = {
  args: {
    size: 'lg',
    label: 'Large Toggle',
  },
};

// State examples
export const Checked = {
  args: {
    label: 'Checked Toggle',
    defaultChecked: true,
  },
};

export const Unchecked = {
  args: {
    label: 'Unchecked Toggle',
    defaultChecked: false,
  },
};

export const Disabled = {
  args: {
    label: 'Disabled Toggle',
    disabled: true,
  },
};

export const DisabledChecked = {
  args: {
    label: 'Disabled Checked Toggle',
    disabled: true,
    defaultChecked: true,
  },
};

// Orientation examples
export const VerticalOrientation = {
  args: {
    label: 'Vertical Orientation',
    orientation: 'vertical',
    helperText: 'Helper text appears below the toggle',
  },
};

// Text examples
export const WithHelperText = {
  args: {
    label: 'With Helper Text',
    helperText: 'This is a helpful message about the toggle',
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

// Controlled example
export const ControlledToggle = () => {
  const [isChecked, setIsChecked] = React.useState(false);
  
  return (
    <div className="space-y-4">
      <Toggle 
        label={`Controlled toggle (${isChecked ? 'on' : 'off'})`}
        checked={isChecked}
        onChange={(e) => setIsChecked(e.target.checked)}
      />
      <button 
        onClick={() => setIsChecked(!isChecked)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Toggle Switch
      </button>
    </div>
  );
};

ControlledToggle.parameters = {
  docs: {
    description: {
      story: 'An example of a controlled toggle using React state.',
    },
  },
};

// Multiple toggles showcase
export const ToggleShowcase = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Variant Examples</h3>
      <div className="flex flex-col gap-2">
        <Toggle label="Primary Toggle" variant="primary" defaultChecked />
        <Toggle label="Success Toggle" variant="success" defaultChecked />
        <Toggle label="Warning Toggle" variant="warning" defaultChecked />
        <Toggle label="Danger Toggle" variant="danger" defaultChecked />
      </div>
    </div>
    
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Size Examples</h3>
      <div className="flex flex-col gap-2">
        <Toggle label="Small Toggle" size="sm" />
        <Toggle label="Medium Toggle" size="md" />
        <Toggle label="Large Toggle" size="lg" />
      </div>
    </div>
    
    <div className="space-y-2">
      <h3 className="text-lg font-medium">State Examples</h3>
      <div className="flex flex-col gap-2">
        <Toggle label="Default Toggle" />
        <Toggle label="Checked Toggle" defaultChecked />
        <Toggle label="Disabled Toggle" disabled />
        <Toggle label="Disabled Checked Toggle" disabled defaultChecked />
      </div>
    </div>
    
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Additional Examples</h3>
      <div className="flex flex-col gap-2">
        <Toggle 
          label="With Helper Text" 
          helperText="This is a helpful description" 
        />
        <Toggle 
          label="With Error Message" 
          errorMessage="This field is required" 
        />
        <Toggle 
          label="Vertical Orientation" 
          orientation="vertical"
          helperText="Helper text appears below the toggle" 
        />
      </div>
    </div>
  </div>
);

ToggleShowcase.parameters = {
  docs: {
    description: {
      story: 'A showcase of all toggle variants and states.',
    },
  },
}; 