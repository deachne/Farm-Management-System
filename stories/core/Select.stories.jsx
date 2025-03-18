import React, { useState } from 'react';
import Select from './Select';
import Form from './Form';
import Button from './Button';
import Input from './Input';

export default {
  title: 'Core/Select',
  component: Select,
  parameters: {
    componentSubtitle: 'Dropdown component for selecting from a list of options',
  },
  argTypes: {
    onChange: { action: 'changed' },
    size: {
      control: { type: 'select', options: ['small', 'medium', 'large'] },
    },
  },
};

// Sample options
const countryOptions = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'mx', label: 'Mexico' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Germany' },
  { value: 'jp', label: 'Japan' },
  { value: 'au', label: 'Australia' },
];

// Basic select
export const Basic = () => {
  const [value, setValue] = useState('');
  
  return (
    <div style={{ 
      backgroundColor: 'white', 
      padding: '16px', 
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    }}>
      <Select
        label="Country"
        name="country"
        placeholder="Select a country"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        options={countryOptions}
      />
    </div>
  );
};

// With default value
export const WithDefaultValue = () => {
  const [value, setValue] = useState('ca');
  
  return (
    <div style={{ 
      backgroundColor: 'white', 
      padding: '16px', 
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    }}>
      <Select
        label="Country"
        name="country"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        options={countryOptions}
      />
    </div>
  );
};

// Different sizes
export const Sizes = () => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '16px', 
    backgroundColor: 'white', 
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  }}>
    <Select
      label="Small"
      name="small"
      size="small"
      options={countryOptions}
    />
    <Select
      label="Medium"
      name="medium"
      size="medium"
      options={countryOptions}
    />
    <Select
      label="Large"
      name="large"
      size="large"
      options={countryOptions}
    />
  </div>
);

// Disabled state
export const Disabled = () => (
  <div style={{ 
    backgroundColor: 'white', 
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  }}>
    <Select
      label="Country"
      name="country"
      placeholder="Select a country"
      options={countryOptions}
      disabled
    />
  </div>
);

// With error
export const WithError = () => (
  <div style={{ 
    backgroundColor: 'white', 
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  }}>
    <Select
      label="Country"
      name="country"
      placeholder="Select a country"
      options={countryOptions}
      error="Please select a country"
    />
  </div>
);

// With helper text
export const WithHelperText = () => (
  <div style={{ 
    backgroundColor: 'white', 
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  }}>
    <Select
      label="Country"
      name="country"
      placeholder="Select a country"
      options={countryOptions}
      helperText="Select the country where you currently reside"
    />
  </div>
);

// Required select
export const Required = () => (
  <div style={{ 
    backgroundColor: 'white', 
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  }}>
    <Select
      label="Country"
      name="country"
      placeholder="Select a country"
      options={countryOptions}
      required
    />
  </div>
);

// Full width
export const FullWidth = () => (
  <div style={{ 
    maxWidth: '500px', 
    border: '1px dashed #ccc', 
    padding: '16px', 
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  }}>
    <Select
      label="Country"
      name="country"
      placeholder="Select a country"
      options={countryOptions}
      fullWidth
    />
  </div>
);

// Empty options
export const EmptyOptions = () => (
  <div style={{ 
    backgroundColor: 'white', 
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  }}>
    <Select
      label="Country"
      name="country"
      placeholder="No countries available"
      options={[]}
    />
  </div>
);

// In a form
export const InForm = () => {
  const [formData, setFormData] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (values) => {
    console.log('Form submitted with values:', values);
    setFormData(values);
    setSubmitted(true);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };
  
  const jobOptions = [
    { value: 'developer', label: 'Software Developer' },
    { value: 'designer', label: 'UI/UX Designer' },
    { value: 'manager', label: 'Product Manager' },
    { value: 'marketing', label: 'Marketing Specialist' },
  ];
  
  const experienceOptions = [
    { value: 'entry', label: 'Entry Level (0-2 years)' },
    { value: 'mid', label: 'Mid Level (3-5 years)' },
    { value: 'senior', label: 'Senior Level (6+ years)' },
  ];
  
  return (
    <div style={{ 
      maxWidth: '500px', 
      backgroundColor: 'white', 
      padding: '20px', 
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    }}>
      {submitted && (
        <div style={{ 
          padding: '12px', 
          backgroundColor: '#ecfdf5', 
          color: '#064e3b', 
          borderRadius: '6px',
          marginBottom: '16px' 
        }}>
          <strong>Form Submitted:</strong>
          <pre style={{ 
            marginTop: '8px', 
            backgroundColor: '#d1fae5', 
            padding: '8px', 
            borderRadius: '4px',
            overflow: 'auto'
          }}>
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      )}
      
      <form onSubmit={(e) => {
        e.preventDefault();
        const formValues = {
          name: e.target.name.value,
          email: e.target.email.value,
          job: e.target.job.value,
          experience: e.target.experience.value,
        };
        handleSubmit(formValues);
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            label="Full Name"
            name="name"
            placeholder="Your Name"
            required
            fullWidth
          />
          
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="Your Email"
            required
            fullWidth
          />
          
          <Select
            label="Job Role"
            name="job"
            placeholder="Select your job role"
            options={jobOptions}
            required
            fullWidth
          />
          
          <Select
            label="Experience Level"
            name="experience"
            placeholder="Select your experience level"
            options={experienceOptions}
            required
            fullWidth
          />
          
          <Button type="submit" variant="primary" style={{ marginTop: '20px' }}>
            Submit Application
          </Button>
        </div>
      </form>
    </div>
  );
}; 