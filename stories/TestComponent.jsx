import React from 'react';

// A simple component with no props
const TestComponent = () => {
  return (
    <div style={{ 
      backgroundColor: 'white', 
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      maxWidth: '300px'
    }}>
      <h2>Test Component</h2>
      <p>This is a simple test component to verify Storybook is working correctly.</p>
    </div>
  );
};

export default TestComponent; 