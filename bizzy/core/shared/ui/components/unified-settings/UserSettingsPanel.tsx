import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

// Import common elements
const Card = ({ className = '', children, ...props }) => (
  <div className={`bg-theme-bg-secondary rounded-lg p-4 mb-4 ${className}`} {...props}>
    {children}
  </div>
);

const SectionTitle = ({ children }) => (
  <h3 className="text-lg font-medium text-theme-text-primary mb-3">{children}</h3>
);

const Label = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium text-theme-text-secondary mb-1">
    {children}
  </label>
);

const Input = ({ id, type = 'text', value, onChange, className = '', ...props }) => (
  <input
    id={id}
    type={type}
    value={value}
    onChange={onChange}
    className={`w-full px-3 py-2 rounded-md border border-theme-sidebar-border bg-theme-bg-primary text-theme-text-primary mb-4 focus:outline-none focus:border-theme-ring ${className}`}
    {...props}
  />
);

const Button = ({ type = 'button', variant = 'primary', className = '', children, ...props }) => {
  const baseClasses = 'px-4 py-2 rounded-md focus:outline-none transition-colors';
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };
  
  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const UserSettingsPanel: React.FC = () => {
  // State for user settings from AnythingLLM
  const [anythingLlmUser, setAnythingLlmUser] = useState({
    username: '',
    email: '',
    password: '',
  });

  // State for user settings from LibreChat
  const [libreChatUser, setLibreChatUser] = useState({
    username: '',
    email: '',
    password: '',
  });

  // State for showing/hiding password
  const [showPassword, setShowPassword] = useState(false);

  // Placeholder for fetching user data
  useEffect(() => {
    // TODO: Fetch user data from AnythingLLM
    setAnythingLlmUser({
      username: 'AnythingLLM User',
      email: 'user@anythingllm.com',
      password: '••••••••',
    });

    // TODO: Fetch user data from LibreChat
    setLibreChatUser({
      username: 'LibreChat User',
      email: 'user@librechat.com',
      password: '••••••••',
    });
  }, []);

  // Placeholder for handling profile updates
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    // TODO: Implement profile update logic
    alert('Profile update functionality will be implemented');
  };

  // Placeholder for handling password changes
  const handlePasswordChange = (e) => {
    e.preventDefault();
    // TODO: Implement password change logic
    alert('Password change functionality will be implemented');
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-theme-text-primary">User Settings</h2>
        <p className="text-theme-text-secondary">
          Manage your account, profile, and preferences
        </p>
      </div>

      <Card>
        <SectionTitle>Profile Information</SectionTitle>
        <form onSubmit={handleProfileUpdate}>
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center mr-4">
              <User className="w-8 h-8 text-gray-500" />
            </div>
            <div>
              <h4 className="font-medium text-theme-text-primary">{anythingLlmUser.username}</h4>
              <p className="text-sm text-theme-text-secondary">{anythingLlmUser.email}</p>
            </div>
          </div>

          <div className="mb-4">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <Input
                id="username"
                value={anythingLlmUser.username}
                onChange={(e) => setAnythingLlmUser({ ...anythingLlmUser, username: e.target.value })}
                placeholder="Enter your username"
              />
              <User className="absolute top-2.5 right-3 w-5 h-5 text-theme-text-tertiary" />
            </div>
          </div>

          <div className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={anythingLlmUser.email}
                onChange={(e) => setAnythingLlmUser({ ...anythingLlmUser, email: e.target.value })}
                placeholder="Enter your email"
              />
              <Mail className="absolute top-2.5 right-3 w-5 h-5 text-theme-text-tertiary" />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="primary">
              Update Profile
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <SectionTitle>Change Password</SectionTitle>
        <form onSubmit={handlePasswordChange}>
          <div className="mb-4">
            <Label htmlFor="current-password">Current Password</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showPassword ? 'text' : 'password'}
                value={anythingLlmUser.password}
                onChange={(e) => setAnythingLlmUser({ ...anythingLlmUser, password: e.target.value })}
                placeholder="Enter your current password"
              />
              <button
                type="button"
                className="absolute top-2.5 right-3 text-theme-text-tertiary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your new password"
              />
              <Lock className="absolute top-2.5 right-3 w-5 h-5 text-theme-text-tertiary" />
            </div>
          </div>

          <div className="mb-4">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm your new password"
              />
              <Lock className="absolute top-2.5 right-3 w-5 h-5 text-theme-text-tertiary" />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="primary">
              Change Password
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <SectionTitle>Interface Preferences</SectionTitle>
        <div className="mb-4">
          <Label htmlFor="theme">Theme</Label>
          <select
            id="theme"
            className="w-full px-3 py-2 rounded-md border border-theme-sidebar-border bg-theme-bg-primary text-theme-text-primary mb-4 focus:outline-none"
          >
            <option value="system">System Default</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div className="mb-4">
          <Label htmlFor="fontSize">Font Size</Label>
          <select
            id="fontSize"
            className="w-full px-3 py-2 rounded-md border border-theme-sidebar-border bg-theme-bg-primary text-theme-text-primary mb-4 focus:outline-none"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <div className="mb-4">
          <div className="flex items-center">
            <input
              id="autoScroll"
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-theme-sidebar-border rounded focus:ring-blue-500"
            />
            <label htmlFor="autoScroll" className="ml-2 text-sm text-theme-text-secondary">
              Enable auto-scroll in conversations
            </label>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserSettingsPanel; 