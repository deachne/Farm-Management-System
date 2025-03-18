import React from 'react';
import TestComponent from './TestComponent';

export default {
  title: 'Test/TestComponent',
  component: TestComponent,
};

export const Default = () => <TestComponent />;

export const WithWrapper = () => (
  <div style={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
    <TestComponent />
  </div>
); 