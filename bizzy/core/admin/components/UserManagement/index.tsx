import React, { useState } from 'react';
import { Button } from '../../../shared/ui/components/Button';
import { Card } from '../../../shared/ui/components/Card';
import { Input } from '../../../shared/ui/components/Input';
import { 
  User, 
  UserRole, 
  UserStatus
} from './types';

/**
 * User Management Component
 * 
 * This component provides an interface for managing users in the system.
 * It allows administrators to view, create, edit, and delete users, as well as
 * manage their roles and statuses.
 */
const UserManagement: React.FC = () => {
  // Demo users for initial implementation
  const [users] = useState<User[]>([
    {
      id: '1',
      email: 'admin@example.com',
      name: 'Admin User',
      username: 'admin',
      role: 'admin',
      provider: 'local',
      emailVerified: true,
      twoFactorEnabled: false,
      createdAt: '2023-01-01T00:00:00.000Z',
      lastLogin: '2023-06-01T00:00:00.000Z',
      status: 'active'
    },
    {
      id: '2',
      email: 'user@example.com',
      name: 'Regular User',
      username: 'user',
      role: 'user',
      provider: 'local',
      emailVerified: true,
      twoFactorEnabled: false,
      createdAt: '2023-02-15T00:00:00.000Z',
      lastLogin: '2023-06-10T00:00:00.000Z',
      status: 'active'
    },
    {
      id: '3',
      email: 'moderator@example.com',
      name: 'Moderator User',
      username: 'moderator',
      role: 'moderator',
      provider: 'local',
      emailVerified: true,
      twoFactorEnabled: true,
      createdAt: '2023-03-20T00:00:00.000Z',
      lastLogin: '2023-06-05T00:00:00.000Z',
      status: 'active'
    }
  ]);

  // Render role badge with appropriate color
  const renderRoleBadge = (role: UserRole) => {
    const colors: Record<UserRole, string> = {
      admin: 'bg-blue-500 text-white',
      user: 'bg-gray-200 text-gray-800',
      moderator: 'bg-green-500 text-white'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[role]}`}>
        {role}
      </span>
    );
  };
  
  // Render status badge with appropriate color
  const renderStatusBadge = (status: UserStatus) => {
    const colors: Record<UserStatus, string> = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {status}
      </span>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-theme-text-primary">User Management</h1>
        <Button variant="primary">
          Add User
        </Button>
      </div>
      
      {/* Filters */}
      <Card className="p-4">
        <h2 className="text-lg font-medium mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Input
              placeholder="Search by name or email"
              type="search"
            />
          </div>
        </div>
      </Card>
      
      {/* User List */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-theme-bg-secondary">
              <tr>
                <th className="p-3 text-left text-sm font-medium text-theme-text-secondary">User</th>
                <th className="p-3 text-left text-sm font-medium text-theme-text-secondary">Email</th>
                <th className="p-3 text-left text-sm font-medium text-theme-text-secondary">Role</th>
                <th className="p-3 text-left text-sm font-medium text-theme-text-secondary">Status</th>
                <th className="p-3 text-left text-sm font-medium text-theme-text-secondary">Created</th>
                <th className="p-3 text-left text-sm font-medium text-theme-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-theme-sidebar-border">
                  <td className="p-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center font-medium">
                        {user.name?.[0] || user.email[0]}
                      </div>
                      <div>
                        <div className="font-medium">{user.name || 'N/A'}</div>
                        <div className="text-sm text-theme-text-secondary">{user.username || 'No username'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{renderRoleBadge(user.role)}</td>
                  <td className="p-3">{renderStatusBadge(user.status)}</td>
                  <td className="p-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <Button variant="ghost" size="sm">
                      Actions
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default UserManagement; 