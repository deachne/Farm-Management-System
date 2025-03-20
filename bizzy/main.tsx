import React from 'react';
import ReactDOM from 'react-dom/client';
import './core/admin/styles/index.css';
import DashboardDemo from './core/admin/demo/DashboardDemo';

console.log('BizzyPerson main.tsx is running');

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<DashboardDemo />);
    console.log('BizzyPerson app rendered successfully');
  } catch (err) {
    console.error('Error rendering React:', err);
  }
} else {
  console.error('Could not find root element!');
} 