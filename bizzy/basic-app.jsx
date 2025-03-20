// Import React and ReactDOM from module
import React from 'react';
import ReactDOM from 'react-dom/client';

console.log('basic-app.js is running');

// Simple Dashboard Component
function Dashboard() {
  const [activeView, setActiveView] = React.useState('home');
  
  const renderContent = () => {
    switch(activeView) {
      case 'users':
        return (
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">User Management</h2>
            <p className="mb-4">This is the user management view.</p>
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setActiveView('home')}
            >
              Back to Dashboard
            </button>
          </div>
        );
      case 'home':
      default:
        return (
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
            <p className="mb-4">Welcome to BizzyPerson Dashboard.</p>
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setActiveView('users')}
            >
              Go to User Management
            </button>
          </div>
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">BizzyPerson</h1>
        </div>
      </header>
      
      <main>
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

// Try to render
try {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    console.log('Found root element, rendering Dashboard...');
    const root = ReactDOM.createRoot(rootElement);
    root.render(React.createElement(Dashboard));
    console.log('Dashboard rendered successfully');
  } else {
    console.error('Could not find root element');
  }
} catch (error) {
  console.error('Error rendering React app:', error);
  document.body.innerHTML += `<div style="color:red; padding: 20px;">Error: ${error.message}</div>`;
} 