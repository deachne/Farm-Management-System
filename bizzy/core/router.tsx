import { createHashRouter, Link } from 'react-router-dom';
import ErrorPage from './components/ErrorPage';

// Simple test components
const SimpleHome = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-600 mb-5">BizzyPerson Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="mb-4">Simple dashboard component to test routing.</p>
        <Link 
          to="/users" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 inline-block"
        >
          Go to Users
        </Link>
      </div>
    </div>
  );
};

const SimpleUsers = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-600 mb-5">User Management</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="mb-4">Simple user management component to test routing.</p>
        <Link 
          to="/" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 inline-block"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

// Router configuration
export const router = createHashRouter([
  {
    path: '/',
    element: <SimpleHome />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/users',
    element: <SimpleUsers />,
  },
]); 