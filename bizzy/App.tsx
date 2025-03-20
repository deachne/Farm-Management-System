import React from 'react';

const App: React.FC = () => {
  return (
    <div className="p-8 bg-blue-100 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-600 mb-5">BizzyPerson Dashboard</h1>
      <p className="mb-6">Simple test component to verify React is working</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Card 1</h2>
          <p>This is a test card to check if Tailwind CSS is working properly.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Card 2</h2>
          <p>If you can see this styled properly, React and Tailwind are working!</p>
        </div>
      </div>
      <button 
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => alert('Button clicked!')}
      >
        Test Button
      </button>
    </div>
  );
};

export default App; 