import React, { useState } from 'react';
import { Card, CardContent } from '../../shared/ui/components/Card';
import { Button } from '../../shared/ui/components/Button';
import { Input } from '../../shared/ui/components/Input';
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Bell, 
  RefreshCw, 
  Database, 
  Shield, 
  Globe, 
  Cpu 
} from 'lucide-react';

/**
 * Settings Component
 * 
 * This component provides an interface for system and user settings.
 * It follows the BizzyPerson design system and allows users to configure
 * various aspects of the application.
 */
export interface SettingsProps {
  // Props can be extended as needed
}

const Settings: React.FC<SettingsProps> = () => {
  // State for toggle settings
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(true);
  
  // Toggle handlers
  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleEmailNotifications = () => setEmailNotifications(!emailNotifications);
  const togglePushNotifications = () => setPushNotifications(!pushNotifications);
  const toggleAutoUpdate = () => setAutoUpdate(!autoUpdate);
  
  // Section for toggle switch UI
  const ToggleSwitch = ({ 
    checked, 
    onChange, 
    label, 
    id 
  }: { 
    checked: boolean; 
    onChange: () => void; 
    label: string; 
    id: string 
  }) => (
    <div className="flex items-center justify-between">
      <label htmlFor={id} className="font-medium text-gray-700 dark:text-gray-200">{label}</label>
      <div className="relative inline-block w-12 align-middle select-none">
        <input 
          type="checkbox" 
          id={id} 
          className="sr-only" 
          checked={checked} 
          onChange={onChange}
        />
        <div 
          className={`block w-12 h-6 rounded-full ${checked ? 'bg-blue-500' : 'bg-gray-300'} transition-colors duration-200`}
        />
        <div 
          className={`absolute w-6 h-6 rounded-full bg-white border border-gray-300 transition-transform duration-200 transform ${checked ? 'translate-x-6' : 'translate-x-0'}`}
        />
      </div>
    </div>
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Settings</h1>
        <Button variant="primary">
          Save Changes
        </Button>
      </div>
      
      {/* User Preferences */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-5 text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">
          User Preferences
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="overflow-hidden shadow-md border-2 border-blue-200 dark:border-blue-900 rounded-lg hover:shadow-xl transition-all">
            <CardContent className="p-5">
              <div className="flex items-center mb-4">
                <Moon className="mr-2 h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-medium">Appearance</h3>
              </div>
              <div className="space-y-4">
                <ToggleSwitch 
                  id="darkMode" 
                  checked={darkMode} 
                  onChange={toggleDarkMode} 
                  label="Dark Mode" 
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden shadow-md border-2 border-blue-200 dark:border-blue-900 rounded-lg hover:shadow-xl transition-all">
            <CardContent className="p-5">
              <div className="flex items-center mb-4">
                <Bell className="mr-2 h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-medium">Notifications</h3>
              </div>
              <div className="space-y-4">
                <ToggleSwitch 
                  id="emailNotifications" 
                  checked={emailNotifications} 
                  onChange={toggleEmailNotifications} 
                  label="Email Notifications" 
                />
                <ToggleSwitch 
                  id="pushNotifications" 
                  checked={pushNotifications} 
                  onChange={togglePushNotifications} 
                  label="Push Notifications" 
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* System Settings */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-5 text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">
          System Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="overflow-hidden shadow-md border-2 border-blue-200 dark:border-blue-900 rounded-lg hover:shadow-xl transition-all">
            <CardContent className="p-5">
              <div className="flex items-center mb-4">
                <RefreshCw className="mr-2 h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-medium">Updates</h3>
              </div>
              <div className="space-y-4">
                <ToggleSwitch 
                  id="autoUpdate" 
                  checked={autoUpdate} 
                  onChange={toggleAutoUpdate} 
                  label="Automatic Updates" 
                />
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                >
                  Check for Updates
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden shadow-md border-2 border-blue-200 dark:border-blue-900 rounded-lg hover:shadow-xl transition-all">
            <CardContent className="p-5">
              <div className="flex items-center mb-4">
                <Database className="mr-2 h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-medium">Storage</h3>
              </div>
              <div className="space-y-4">
                <div className="mb-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Storage Used</span>
                    <span className="text-sm font-medium">65%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                >
                  Manage Storage
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* Integration Settings */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-5 text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">
          Integration Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="overflow-hidden shadow-md border-2 border-blue-200 dark:border-blue-900 rounded-lg hover:shadow-xl transition-all">
            <CardContent className="p-5">
              <div className="flex items-center mb-4">
                <Shield className="mr-2 h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-medium">AnythingLLM Configuration</h3>
              </div>
              <div className="space-y-4">
                <Input
                  label="API Endpoint"
                  placeholder="http://localhost:3001/api"
                  value="http://localhost:3001/api"
                />
                <Input
                  label="API Key"
                  type="password"
                  placeholder="Enter API key"
                  value="••••••••••••••••"
                />
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                >
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden shadow-md border-2 border-blue-200 dark:border-blue-900 rounded-lg hover:shadow-xl transition-all">
            <CardContent className="p-5">
              <div className="flex items-center mb-4">
                <Globe className="mr-2 h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-medium">LibreChat Configuration</h3>
              </div>
              <div className="space-y-4">
                <Input
                  label="Chat Server URL"
                  placeholder="http://localhost:3002"
                  value="http://localhost:3002"
                />
                <Input
                  label="Authentication Method"
                  placeholder="JWT"
                  value="JWT"
                />
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                >
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* Advanced Settings */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-5 text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">
          Advanced Settings
        </h2>
        <Card className="overflow-hidden shadow-md border-2 border-blue-200 dark:border-blue-900 rounded-lg hover:shadow-xl transition-all">
          <CardContent className="p-5">
            <div className="flex items-center mb-4">
              <Cpu className="mr-2 h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-medium">System Configuration</h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Log Level"
                  placeholder="info"
                  value="info"
                />
                <Input
                  label="Cache Size (MB)"
                  type="number"
                  placeholder="1024"
                  value="1024"
                />
                <Input
                  label="Timeout (seconds)"
                  type="number"
                  placeholder="30"
                  value="30"
                />
                <Input
                  label="Max Upload Size (MB)"
                  type="number"
                  placeholder="50"
                  value="50"
                />
              </div>
              <div className="flex justify-end mt-4">
                <Button variant="destructive" className="mr-2">
                  Reset to Defaults
                </Button>
                <Button variant="primary">
                  Apply Advanced Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Settings; 