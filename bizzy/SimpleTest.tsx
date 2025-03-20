import React from 'react';

interface SimpleTestProps {
  title?: string;
}

const SimpleTest: React.FC<SimpleTestProps> = ({ title = "Test Component" }) => {
  return (
    <div className="bg-blue-100 border border-blue-300 rounded-md p-4 my-4">
      <h2 className="text-xl font-semibold text-blue-800">{title}</h2>
      <p className="text-blue-600">This is a separate component file.</p>
    </div>
  );
};

export default SimpleTest; 