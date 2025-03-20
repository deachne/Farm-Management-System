import React from 'react';

export default function DashboardHome() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Summary Cards */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Total Workspaces</h3>
          <div className="flex items-center">
            <span className="text-3xl font-bold">12</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Active Users</h3>
          <div className="flex items-center">
            <span className="text-3xl font-bold">48</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Documents Processed</h3>
          <div className="flex items-center">
            <span className="text-3xl font-bold">156</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {/* Activity items */}
          <div className="flex items-start space-x-4">
            <div className="flex-1">
              <p className="text-sm font-medium">New workspace created: Farm Operations</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="flex-1">
              <p className="text-sm font-medium">Document uploaded: 2023 Crop Yield Report</p>
              <p className="text-xs text-gray-500">5 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="flex-1">
              <p className="text-sm font-medium">New user registered: John Smith</p>
              <p className="text-xs text-gray-500">Yesterday at 3:45 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 