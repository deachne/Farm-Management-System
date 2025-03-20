import React from 'react';
import { useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Oops!</h1>
        <p className="text-gray-600 mb-4">Sorry, an unexpected error has occurred.</p>
        <p className="text-gray-500 text-sm">
          {(error as Error)?.message || 'Unknown error occurred'}
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
} 