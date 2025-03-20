import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">BizzyPerson</h2>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link 
                to="/" 
                className="block px-4 py-2 rounded hover:bg-gray-100 transition-colors"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/settings" 
                className="block px-4 py-2 rounded hover:bg-gray-100 transition-colors"
              >
                Settings
              </Link>
            </li>
            {/* Add more navigation items as needed */}
          </ul>
        </nav>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-4 border-b">
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </header>
        <main className="p-6">
          {/* This is where nested routes will render */}
          <Outlet />
        </main>
      </div>
    </div>
  );
} 