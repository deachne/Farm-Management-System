import React, { useState } from 'react';
import Form from './Form';
import Input from './Input';
import Button from './Button';
import Notification from './Notification';
import Select from './Select';

export default {
  title: 'Core/Form',
  component: Form,
  parameters: {
    componentSubtitle: 'A component for handling form state, validation, and submission',
  },
  argTypes: {
    onSubmit: { action: 'submitted' },
    onValidationChange: { action: 'validation changed' },
  },
};

// Basic form with a single field
export const Basic = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState(null);
  
  const handleSubmit = (values) => {
    setFormData(values);
    setSubmitted(true);
    
    // Hide the success message after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };
  
  return (
    <div style={{ 
      maxWidth: '500px', 
      backgroundColor: 'white', 
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' 
    }}>
      {submitted && (
        <Notification
          type="success"
          title="Form Submitted"
          message={`Name: ${formData.name}`}
          autoClose={true}
          duration={3000}
        />
      )}
      
      <Form
        onSubmit={handleSubmit}
        initialValues={{ name: '' }}
        validationSchema={{
          name: (value) => value.trim() ? true : 'Name is required',
        }}
      >
        <Input
          label="Name"
          name="name"
          placeholder="Enter your name"
          required
          fullWidth
        />
        
        <div style={{ marginTop: '20px' }}>
          <Button type="submit" variant="primary">
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
};

// Form with multiple fields and validation
export const WithValidation = () => {
  const [formValid, setFormValid] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState(null);
  
  const handleValidationChange = (isValid) => {
    setFormValid(isValid);
  };
  
  const handleSubmit = (values) => {
    setFormData(values);
    setSubmitted(true);
    
    // Hide the success message after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };
  
  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email) ? true : 'Please enter a valid email address';
  };
  
  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    return true;
  };
  
  const validateConfirmPassword = (confirmPassword, values) => {
    return confirmPassword === values.password ? true : 'Passwords do not match';
  };
  
  return (
    <div style={{ 
      maxWidth: '500px', 
      backgroundColor: 'white', 
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' 
    }}>
      {submitted && (
        <Notification
          type="success"
          title="Registration Successful"
          message={`Welcome, ${formData.name}!`}
          autoClose={true}
          duration={3000}
        />
      )}
      
      <Form
        onSubmit={handleSubmit}
        onValidationChange={handleValidationChange}
        initialValues={{
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={{
          name: (value) => value.trim() ? true : 'Name is required',
          email: validateEmail,
          password: validatePassword,
          confirmPassword: validateConfirmPassword,
        }}
      >
        <Input
          label="Full Name"
          name="name"
          placeholder="Enter your full name"
          required
          fullWidth
        />
        
        <Input
          label="Email Address"
          name="email"
          type="email"
          placeholder="Enter your email"
          required
          fullWidth
        />
        
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Create a password"
          required
          fullWidth
        />
        
        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          required
          fullWidth
        />
        
        <div style={{ marginTop: '20px' }}>
          <Button 
            type="submit" 
            variant="primary"
            disabled={!formValid && submitted}
          >
            Register
          </Button>
        </div>
      </Form>
    </div>
  );
};

// Form with loading state
export const Loading = () => {
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };
  
  return (
    <div style={{ 
      maxWidth: '500px', 
      backgroundColor: 'white', 
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' 
    }}>
      <Form
        onSubmit={handleSubmit}
        loading={loading}
        initialValues={{ username: '', password: '' }}
        validationSchema={{
          username: (value) => value.trim() ? true : 'Username is required',
          password: (value) => value.trim() ? true : 'Password is required',
        }}
      >
        <Input
          label="Username"
          name="username"
          placeholder="Enter your username"
          required
          fullWidth
        />
        
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          required
          fullWidth
        />
        
        <div style={{ marginTop: '20px' }}>
          <Button type="submit" variant="primary">
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

// Form with dynamic fields
export const DynamicFields = () => {
  const [fieldCount, setFieldCount] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState(null);
  
  const initialValues = {
    title: '',
  };
  
  // Add initial values for dynamic fields
  for (let i = 0; i < fieldCount; i++) {
    initialValues[`item_${i}`] = '';
  }
  
  // Create validation schema with dynamic fields
  const validationSchema = {
    title: (value) => value.trim() ? true : 'Title is required',
  };
  
  // Add validation for dynamic fields
  for (let i = 0; i < fieldCount; i++) {
    validationSchema[`item_${i}`] = (value) => value.trim() ? true : `Item ${i + 1} is required`;
  }
  
  const handleSubmit = (values) => {
    setFormData(values);
    setSubmitted(true);
    
    // Hide the success message after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };
  
  const handleAddField = () => {
    setFieldCount(prevCount => prevCount + 1);
  };
  
  const handleRemoveField = () => {
    if (fieldCount > 1) {
      setFieldCount(prevCount => prevCount - 1);
    }
  };
  
  // Generate dynamic fields
  const renderDynamicFields = () => {
    const fields = [];
    
    for (let i = 0; i < fieldCount; i++) {
      fields.push(
        <Input
          key={`item_${i}`}
          label={`Item ${i + 1}`}
          name={`item_${i}`}
          placeholder={`Enter item ${i + 1}`}
          required
          fullWidth
        />
      );
    }
    
    return fields;
  };
  
  return (
    <div style={{ 
      maxWidth: '500px', 
      backgroundColor: 'white', 
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' 
    }}>
      {submitted && (
        <Notification
          type="success"
          title="Form Submitted"
          message={`Created list "${formData.title}" with ${fieldCount} items`}
          autoClose={true}
          duration={3000}
        />
      )}
      
      <Form
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}
        resetOnSubmit={false}
      >
        <Input
          label="List Title"
          name="title"
          placeholder="Enter list title"
          required
          fullWidth
        />
        
        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          <h4>Items</h4>
          {renderDynamicFields()}
        </div>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <Button type="button" variant="secondary" onClick={handleAddField}>
            Add Item
          </Button>
          <Button 
            type="button" 
            variant="secondary" 
            onClick={handleRemoveField}
            disabled={fieldCount <= 1}
          >
            Remove Item
          </Button>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <Button type="submit" variant="primary">
            Submit List
          </Button>
        </div>
      </Form>
    </div>
  );
};

// Form with Select component
export const WithSelect = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState(null);
  
  const fruitOptions = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'orange', label: 'Orange' },
    { value: 'grape', label: 'Grape' },
    { value: 'kiwi', label: 'Kiwi' },
  ];
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const values = {
      name: e.target.name.value,
      fruit: e.target.fruit.value,
    };
    
    setFormData(values);
    setSubmitted(true);
    
    // Hide the success message after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };
  
  return (
    <div style={{ 
      maxWidth: '500px', 
      backgroundColor: 'white', 
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' 
    }}>
      {submitted && (
        <Notification
          type="success"
          title="Form Submitted"
          message={`Name: ${formData.name}, Favorite Fruit: ${formData.fruit}`}
          autoClose={true}
          duration={3000}
        />
      )}
      
      <form onSubmit={handleSubmit}>
        <Input
          label="Name"
          name="name"
          placeholder="Enter your name"
          required
          fullWidth
        />
        
        <div style={{ marginTop: '20px' }}>
          <Select
            label="Favorite Fruit"
            name="fruit"
            placeholder="Select your favorite fruit"
            options={fruitOptions}
            required
            fullWidth
          />
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <Button type="submit" variant="primary">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}; 