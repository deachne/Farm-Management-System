import React, { useState } from 'react';
import Input from './Input';

export default {
  title: 'Core/Input',
  component: Input,
  parameters: {
    componentSubtitle: 'Form input component with validation capabilities',
  },
  argTypes: {
    onChange: { action: 'changed' },
    onValidate: { action: 'validated' },
    size: {
      control: { type: 'select', options: ['small', 'medium', 'large'] },
    },
    type: {
      control: { 
        type: 'select', 
        options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'date']
      },
    },
  },
};

// Basic text input
export const Basic = {
  args: {
    label: 'Username',
    placeholder: 'Enter your username',
    helperText: 'Your unique username for the system',
  },
};

// Required input
export const Required = {
  args: {
    label: 'Email Address',
    placeholder: 'Enter your email',
    type: 'email',
    required: true,
  },
};

// With error state
export const WithError = {
  args: {
    label: 'Password',
    type: 'password',
    error: 'Password must be at least 8 characters',
    value: 'pass',
  },
};

// Disabled state
export const Disabled = {
  args: {
    label: 'Disabled Input',
    placeholder: 'This input is disabled',
    disabled: true,
    value: 'Cannot edit this value',
  },
};

// Different sizes
export const Sizes = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <Input 
      label="Small Input" 
      size="small" 
      placeholder="Small input"
    />
    <Input 
      label="Medium Input" 
      size="medium" 
      placeholder="Medium input"
    />
    <Input 
      label="Large Input" 
      size="large" 
      placeholder="Large input"
    />
  </div>
);

// With validation
export const WithValidation = () => {
  const [value, setValue] = useState('');
  
  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email) || email === '' ? true : 'Please enter a valid email address';
  };
  
  return (
    <Input
      label="Email with Validation"
      placeholder="Enter an email address"
      type="email"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      validation={validateEmail}
      helperText="Enter a valid email address"
    />
  );
};

// Full width input
export const FullWidth = {
  args: {
    label: 'Full Width Input',
    placeholder: 'This input takes the full width of its container',
    fullWidth: true,
  },
};

// Multiple inputs in a form
export const FormExample = () => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
  });
  
  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    });
  };
  
  return (
    <div style={{ maxWidth: '400px' }}>
      <Input
        label="Full Name"
        name="name"
        placeholder="Enter your full name"
        value={values.name}
        onChange={handleChange}
        fullWidth
        required
      />
      <Input
        label="Email Address"
        name="email"
        type="email"
        placeholder="Enter your email address"
        value={values.email}
        onChange={handleChange}
        fullWidth
        required
        validation={(value) => {
          const re = /\S+@\S+\.\S+/;
          return re.test(value) || value === '' ? true : 'Please enter a valid email address';
        }}
      />
      <Input
        label="Phone Number"
        name="phone"
        type="tel"
        placeholder="Enter your phone number"
        value={values.phone}
        onChange={handleChange}
        fullWidth
        helperText="Format: (123) 456-7890"
      />
    </div>
  );
}; 