// Router implementation in pure JavaScript (no TypeScript)
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';

console.log('router-app.js is running');

// Dashboard Home component
const DashboardHome = () => {
  return React.createElement('div', null,
    React.createElement('h2', { className: 'text-xl font-semibold mb-4' }, 'Dashboard Overview'),
    
    // Summary Cards
    React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6' },
      React.createElement('div', { className: 'bg-white p-6 rounded-lg shadow' }, 
        React.createElement('h3', { className: 'text-gray-500 text-sm font-medium mb-2' }, 'Total Workspaces'),
        React.createElement('div', { className: 'flex items-center' },
          React.createElement('span', { className: 'text-3xl font-bold' }, '12')
        )
      ),
      React.createElement('div', { className: 'bg-white p-6 rounded-lg shadow' }, 
        React.createElement('h3', { className: 'text-gray-500 text-sm font-medium mb-2' }, 'Active Users'),
        React.createElement('div', { className: 'flex items-center' },
          React.createElement('span', { className: 'text-3xl font-bold' }, '48')
        )
      ),
      React.createElement('div', { className: 'bg-white p-6 rounded-lg shadow' }, 
        React.createElement('h3', { className: 'text-gray-500 text-sm font-medium mb-2' }, 'Documents Processed'),
        React.createElement('div', { className: 'flex items-center' },
          React.createElement('span', { className: 'text-3xl font-bold' }, '156')
        )
      )
    ),
    
    // Recent Activity
    React.createElement('div', { className: 'bg-white p-6 rounded-lg shadow mb-6' },
      React.createElement('h3', { className: 'font-semibold mb-4' }, 'Recent Activity'),
      React.createElement('div', { className: 'space-y-4' },
        React.createElement('div', { className: 'flex items-start space-x-4' },
          React.createElement('div', { className: 'flex-1' },
            React.createElement('p', { className: 'text-sm font-medium' }, 'New workspace created: Farm Operations'),
            React.createElement('p', { className: 'text-xs text-gray-500' }, '2 hours ago')
          )
        ),
        React.createElement('div', { className: 'flex items-start space-x-4' },
          React.createElement('div', { className: 'flex-1' },
            React.createElement('p', { className: 'text-sm font-medium' }, 'Document uploaded: 2023 Crop Yield Report'),
            React.createElement('p', { className: 'text-xs text-gray-500' }, '5 hours ago')
          )
        ),
        React.createElement('div', { className: 'flex items-start space-x-4' },
          React.createElement('div', { className: 'flex-1' },
            React.createElement('p', { className: 'text-sm font-medium' }, 'New user registered: John Smith'),
            React.createElement('p', { className: 'text-xs text-gray-500' }, 'Yesterday at 3:45 PM')
          )
        )
      )
    )
  );
};

// Settings component 
const Settings = () => {
  return React.createElement('div', { className: 'bg-white rounded-lg shadow p-6' },
    React.createElement('h2', { className: 'text-xl font-semibold mb-4' }, 'Settings'),
    React.createElement('div', { className: 'space-y-6' },
      // User Preferences Section
      React.createElement('div', { className: 'border-b pb-4' },
        React.createElement('h3', { className: 'text-lg font-medium mb-2' }, 'User Preferences'),
        React.createElement('div', { className: 'grid grid-cols-1 gap-4' },
          React.createElement('div', { className: 'flex items-center justify-between' },
            React.createElement('label', { htmlFor: 'darkMode', className: 'font-medium' }, 'Dark Mode'),
            React.createElement('div', { className: 'relative inline-block w-10 mr-2 align-middle select-none' },
              React.createElement('input', { type: 'checkbox', id: 'darkMode', className: 'sr-only' }),
              React.createElement('div', { className: 'w-10 h-5 bg-gray-300 rounded-full shadow-inner' }),
              React.createElement('div', { className: 'absolute w-5 h-5 bg-white rounded-full shadow inset-y-0 left-0' })
            )
          )
        )
      ),
      
      // Notifications Section
      React.createElement('div', { className: 'border-b pb-4' },
        React.createElement('h3', { className: 'text-lg font-medium mb-2' }, 'Notifications'),
        React.createElement('div', { className: 'grid grid-cols-1 gap-4' },
          React.createElement('div', { className: 'flex items-center justify-between' },
            React.createElement('label', { htmlFor: 'emailNotifications', className: 'font-medium' }, 'Email Notifications'),
            React.createElement('div', { className: 'relative inline-block w-10 mr-2 align-middle select-none' },
              React.createElement('input', { type: 'checkbox', id: 'emailNotifications', className: 'sr-only' }),
              React.createElement('div', { className: 'w-10 h-5 bg-gray-300 rounded-full shadow-inner' }),
              React.createElement('div', { className: 'absolute w-5 h-5 bg-white rounded-full shadow inset-y-0 left-0' })
            )
          )
        )
      ),
      
      // System Section
      React.createElement('div', null,
        React.createElement('h3', { className: 'text-lg font-medium mb-2' }, 'System'),
        React.createElement('div', { className: 'grid grid-cols-1 gap-4' },
          React.createElement('button', { 
            className: 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors',
            onClick: () => alert('Checking for updates...')
          }, 'Check for Updates')
        )
      )
    )
  );
};

// User Management Component
const UserManagement = () => {
  return React.createElement('div', { className: 'bg-white rounded-lg shadow p-6' },
    React.createElement('h2', { className: 'text-xl font-semibold mb-4' }, 'User Management'),
    
    // Search and Add User
    React.createElement('div', { className: 'flex justify-between items-center mb-6' },
      React.createElement('div', { className: 'relative' },
        React.createElement('input', { 
          type: 'text', 
          placeholder: 'Search users...', 
          className: 'px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' 
        }),
        React.createElement('button', { 
          className: 'absolute right-2 top-2 text-gray-400',
          onClick: () => alert('Search users')
        }, '🔍')
      ),
      React.createElement('button', { 
        className: 'px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors',
        onClick: () => alert('Add new user')
      }, '+ Add User')
    ),
    
    // Users Table
    React.createElement('div', { className: 'overflow-x-auto' },
      React.createElement('table', { className: 'w-full table-auto' },
        React.createElement('thead', null,
          React.createElement('tr', { className: 'bg-gray-100 text-left' },
            React.createElement('th', { className: 'p-3 font-semibold' }, 'Name'),
            React.createElement('th', { className: 'p-3 font-semibold' }, 'Email'),
            React.createElement('th', { className: 'p-3 font-semibold' }, 'Role'),
            React.createElement('th', { className: 'p-3 font-semibold' }, 'Status'),
            React.createElement('th', { className: 'p-3 font-semibold' }, 'Actions')
          )
        ),
        React.createElement('tbody', null,
          // Sample User Rows
          React.createElement('tr', { className: 'border-b' },
            React.createElement('td', { className: 'p-3' }, 'John Smith'),
            React.createElement('td', { className: 'p-3' }, 'john.smith@example.com'),
            React.createElement('td', { className: 'p-3' }, 'Admin'),
            React.createElement('td', { className: 'p-3' }, 
              React.createElement('span', { className: 'px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs' }, 'Active')
            ),
            React.createElement('td', { className: 'p-3' },
              React.createElement('button', { 
                className: 'text-blue-500 hover:underline mr-2',
                onClick: () => alert('Edit user: John Smith')
              }, 'Edit'),
              React.createElement('button', { 
                className: 'text-red-500 hover:underline',
                onClick: () => alert('Delete user: John Smith')
              }, 'Delete')
            )
          ),
          React.createElement('tr', { className: 'border-b' },
            React.createElement('td', { className: 'p-3' }, 'Jane Doe'),
            React.createElement('td', { className: 'p-3' }, 'jane.doe@example.com'),
            React.createElement('td', { className: 'p-3' }, 'User'),
            React.createElement('td', { className: 'p-3' }, 
              React.createElement('span', { className: 'px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs' }, 'Active')
            ),
            React.createElement('td', { className: 'p-3' },
              React.createElement('button', { 
                className: 'text-blue-500 hover:underline mr-2',
                onClick: () => alert('Edit user: Jane Doe')
              }, 'Edit'),
              React.createElement('button', { 
                className: 'text-red-500 hover:underline',
                onClick: () => alert('Delete user: Jane Doe')
              }, 'Delete')
            )
          )
        )
      )
    )
  );
};

// Dashboard Layout component with navigation
const DashboardLayout = ({ children }) => {
  return React.createElement('div', { className: 'flex h-screen bg-gray-100' },
    // Sidebar
    React.createElement('div', { className: 'w-64 bg-white shadow-md' },
      React.createElement('div', { className: 'p-4 border-b' },
        React.createElement('h2', { className: 'text-xl font-semibold' }, 'BizzyPerson')
      ),
      React.createElement('nav', { className: 'p-4' },
        React.createElement('ul', { className: 'space-y-2' },
          React.createElement('li', null,
            React.createElement(Link, { 
              to: '/', 
              className: 'block px-4 py-2 rounded hover:bg-gray-100 transition-colors' 
            }, 'Dashboard')
          ),
          React.createElement('li', null,
            React.createElement(Link, { 
              to: '/users', 
              className: 'block px-4 py-2 rounded hover:bg-gray-100 transition-colors' 
            }, 'User Management')
          ),
          React.createElement('li', null,
            React.createElement(Link, { 
              to: '/settings', 
              className: 'block px-4 py-2 rounded hover:bg-gray-100 transition-colors' 
            }, 'Settings')
          )
        )
      )
    ),
    
    // Main Content
    React.createElement('div', { className: 'flex-1 overflow-auto' },
      React.createElement('header', { className: 'bg-white shadow-sm p-4 border-b' },
        React.createElement('h1', { className: 'text-xl font-semibold' }, 'Dashboard')
      ),
      React.createElement('main', { className: 'p-6' },
        // This is where child routes will render
        children
      )
    )
  );
};

// App with Routes
const App = () => {
  return React.createElement(HashRouter, null,
    React.createElement(Routes, null,
      React.createElement(Route, { 
        path: '/', 
        element: React.createElement(DashboardLayout, null, 
          React.createElement(DashboardHome, null)
        )
      }),
      React.createElement(Route, { 
        path: '/settings', 
        element: React.createElement(DashboardLayout, null,
          React.createElement(Settings, null)
        ) 
      }),
      React.createElement(Route, { 
        path: '/users', 
        element: React.createElement(DashboardLayout, null,
          React.createElement(UserManagement, null)
        ) 
      })
    )
  );
};

// Try to render
try {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    console.log('Found root element, rendering router app...');
    const root = ReactDOM.createRoot(rootElement);
    root.render(React.createElement(App, null));
    console.log('Router app rendered successfully');
  } else {
    console.error('Could not find root element');
  }
} catch (error) {
  console.error('Error rendering router app:', error);
  const loadingMessage = document.getElementById('loading-message');
  if (loadingMessage) {
    loadingMessage.innerHTML = `<strong>Router Error:</strong> ${error.message || 'Unknown error'}`;
  }
} 