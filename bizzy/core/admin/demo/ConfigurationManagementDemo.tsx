import React, { useState } from 'react';
import { ConfigurationManagement } from '../components';
import {
  ConfigCategory,
  ConfigSetting
} from '../components/ConfigurationManagement/types';
import {
  Settings,
  Shield,
  Link,
  Bell,
  BarChart2,
  Database
} from 'lucide-react';
import { Sidebar } from '../components';

/**
 * ConfigurationManagement Demonstration Component
 * 
 * This component provides a fully styled and interactive demonstration
 * of the Configuration Management interface.
 * 
 * To use:
 * 1. Import this component
 * 2. Render it in your application
 * 
 * Example:
 * ```tsx
 * import { ConfigurationManagementDemo } from './bizzy/core/admin/demo/ConfigurationManagementDemo';
 * 
 * function App() {
 *   return <ConfigurationManagementDemo />;
 * }
 * ```
 */
const ConfigurationManagementDemo: React.FC = () => {
  // Track the current view
  const [currentView, setCurrentView] = useState<'dashboard' | 'users' | 'extensions' | 'system' | 'config'>('config');
  // Log actions for demonstration purposes
  const [actionLog, setActionLog] = useState<string[]>([
    'Navigated to Configuration Management',
  ]);

  // Add a log entry and limit log to last 10 entries
  const addLogEntry = (entry: string) => {
    setActionLog(prev => [entry, ...prev.slice(0, 9)]);
  };

  // Sample configuration data
  const [configCategories, setConfigCategories] = useState<ConfigCategory[]>([
    {
      id: 'system',
      name: 'System Settings',
      description: 'Configure general system settings, paths, and behavior.',
      icon: <Settings className="h-5 w-5 text-blue-500" />,
      settings: [
        {
          id: 'system.name',
          name: 'System Name',
          description: 'The name of your BizzyPerson installation.',
          value: 'BizzyPerson Production',
          type: 'text',
          category: 'system',
          validation: {
            required: true
          }
        },
        {
          id: 'system.default_language',
          name: 'Default Language',
          description: 'Default language for the application UI.',
          value: 'en-US',
          type: 'select',
          options: ['en-US', 'es-ES', 'fr-FR', 'de-DE'],
          category: 'system'
        },
        {
          id: 'system.debug_mode',
          name: 'Debug Mode',
          description: 'Enable detailed logging and debugging features.',
          value: false,
          type: 'boolean',
          category: 'system'
        },
        {
          id: 'system.data_retention',
          name: 'Data Retention (days)',
          description: 'Number of days to retain log and temporary data before automatic cleanup.',
          value: 30,
          type: 'number',
          category: 'system',
          validation: {
            min: 1,
            max: 365
          }
        }
      ]
    },
    {
      id: 'security',
      name: 'Security Settings',
      description: 'Configure authentication, authorization, and security policies.',
      icon: <Shield className="h-5 w-5 text-purple-500" />,
      settings: [
        {
          id: 'security.session_timeout',
          name: 'Session Timeout (minutes)',
          description: 'Time in minutes before an inactive session expires.',
          value: 60,
          type: 'number',
          category: 'security',
          validation: {
            min: 5,
            max: 1440
          }
        },
        {
          id: 'security.password_policy',
          name: 'Password Policy',
          description: 'Select the password complexity requirements.',
          value: 'strong',
          type: 'select',
          options: ['basic', 'medium', 'strong', 'very-strong'],
          category: 'security'
        },
        {
          id: 'security.mfa_enabled',
          name: 'Multi-Factor Authentication',
          description: 'Require multi-factor authentication for all users.',
          value: true,
          type: 'boolean',
          category: 'security'
        },
        {
          id: 'security.api_rate_limit',
          name: 'API Rate Limit',
          description: 'Maximum number of API requests per minute per user.',
          value: 100,
          type: 'number',
          category: 'security',
          validation: {
            min: 10,
            max: 1000
          }
        }
      ]
    },
    {
      id: 'integration',
      name: 'Integration Settings',
      description: 'Configure external service connections and API integrations.',
      icon: <Link className="h-5 w-5 text-orange-500" />,
      settings: [
        {
          id: 'integration.anythingllm_url',
          name: 'AnythingLLM URL',
          description: 'The URL of the AnythingLLM instance to connect to.',
          value: 'https://anythingllm.example.com',
          type: 'text',
          category: 'integration',
          validation: {
            required: true,
            pattern: '^https?://.*'
          }
        },
        {
          id: 'integration.anythingllm_api_key',
          name: 'AnythingLLM API Key',
          description: 'API key for authenticating with AnythingLLM.',
          value: 'sk-anythingllm-abcdef123456',
          type: 'password',
          category: 'integration',
          isSecret: true,
          validation: {
            required: true
          }
        },
        {
          id: 'integration.librechat_url',
          name: 'LibreChat URL',
          description: 'The URL of the LibreChat instance to connect to.',
          value: 'https://librechat.example.com',
          type: 'text',
          category: 'integration',
          validation: {
            required: true,
            pattern: '^https?://.*'
          }
        },
        {
          id: 'integration.librechat_api_key',
          name: 'LibreChat API Key',
          description: 'API key for authenticating with LibreChat.',
          value: 'lc-api-abcdef123456',
          type: 'password',
          category: 'integration',
          isSecret: true,
          validation: {
            required: true
          }
        }
      ]
    },
    {
      id: 'notification',
      name: 'Notification Settings',
      description: 'Configure email, SMS, and in-app notification settings.',
      icon: <Bell className="h-5 w-5 text-pink-500" />,
      settings: [
        {
          id: 'notification.email_enabled',
          name: 'Email Notifications',
          description: 'Enable sending email notifications.',
          value: true,
          type: 'boolean',
          category: 'notification'
        },
        {
          id: 'notification.smtp_server',
          name: 'SMTP Server',
          description: 'SMTP server address for sending emails.',
          value: 'smtp.example.com',
          type: 'text',
          category: 'notification'
        },
        {
          id: 'notification.smtp_port',
          name: 'SMTP Port',
          description: 'Port number for the SMTP server.',
          value: 587,
          type: 'number',
          category: 'notification',
          validation: {
            min: 1,
            max: 65535
          }
        },
        {
          id: 'notification.smtp_user',
          name: 'SMTP Username',
          description: 'Username for authenticating with the SMTP server.',
          value: 'notifications@example.com',
          type: 'text',
          category: 'notification'
        },
        {
          id: 'notification.smtp_password',
          name: 'SMTP Password',
          description: 'Password for authenticating with the SMTP server.',
          value: 'smtp-password-123',
          type: 'password',
          category: 'notification',
          isSecret: true
        }
      ]
    },
    {
      id: 'performance',
      name: 'Performance Settings',
      description: 'Configure resource allocation, caching, and performance settings.',
      icon: <BarChart2 className="h-5 w-5 text-green-500" />,
      settings: [
        {
          id: 'performance.max_connections',
          name: 'Maximum Connections',
          description: 'Maximum number of concurrent connections to the server.',
          value: 100,
          type: 'number',
          category: 'performance',
          validation: {
            min: 10,
            max: 1000
          }
        },
        {
          id: 'performance.cache_enabled',
          name: 'Enable Caching',
          description: 'Enable response caching for improved performance.',
          value: true,
          type: 'boolean',
          category: 'performance'
        },
        {
          id: 'performance.cache_ttl',
          name: 'Cache TTL (seconds)',
          description: 'Time to live for cached items in seconds.',
          value: 3600,
          type: 'number',
          category: 'performance',
          validation: {
            min: 60,
            max: 86400
          }
        }
      ]
    }
  ]);

  // Navigation handlers
  const handleNavigateToDashboard = () => {
    setCurrentView('dashboard');
    addLogEntry('Navigated to Dashboard');
    window.location.href = '/dashboard';
  };

  const handleNavigateToUsers = () => {
    setCurrentView('users');
    addLogEntry('Navigated to User Management');
    window.location.href = '/users';
  };

  const handleNavigateToExtensions = () => {
    setCurrentView('extensions');
    addLogEntry('Navigated to Extension Management');
    window.location.href = '/extensions';
  };

  const handleNavigateToSystem = () => {
    setCurrentView('system');
    addLogEntry('Navigated to System Monitoring');
    window.location.href = '/system';
  };

  const handleNavigateToConfig = () => {
    setCurrentView('config');
    addLogEntry('Navigated to Configuration Management');
    // Already on config page, no need to navigate
  };

  // Demo action handlers
  const handleSaveSetting = (settingId: string, value: string | number | boolean) => {
    console.log(`Saving setting ${settingId} with value:`, value);
    addLogEntry(`Updated setting: ${settingId}`);
    setConfigCategories(prev => 
      prev.map(category => ({
        ...category,
        settings: category.settings.map(setting => 
          setting.id === settingId 
            ? { ...setting, value } 
            : setting
        )
      }))
    );
  };

  const handleResetToDefault = (settingId: string) => {
    console.log(`Resetting setting ${settingId} to default`);
    addLogEntry(`Reset setting to default: ${settingId}`);
    // In a real implementation, we would fetch the default value from somewhere
    // For demo purposes, we'll just log it
  };

  const handleImportConfig = (configFile: File) => {
    console.log(`Importing configuration from file:`, configFile.name);
    addLogEntry(`Imported configuration from: ${configFile.name}`);
    // In a real implementation, we would read the file and parse the JSON
    // For demo purposes, we'll just log it
  };

  const handleExportConfig = () => {
    console.log(`Exporting configuration`);
    addLogEntry('Exported configuration');
    // In a real implementation, we would generate a JSON file and trigger a download
    // For demo purposes, we'll just log it
  };

  const handleTestConnection = async (categoryId: string) => {
    console.log(`Testing connection for category:`, categoryId);
    addLogEntry(`Testing connection: ${categoryId}`);
    
    // Simulate an API call
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        // For demo purposes, we'll randomly succeed or fail
        const success = Math.random() > 0.3;
        console.log(`Connection test ${success ? 'succeeded' : 'failed'}`);
        addLogEntry(`Connection test ${success ? 'succeeded' : 'failed'}`);
        resolve(success);
      }, 1500);
    });
  };

  // Determine what to render based on current view
  const renderContent = () => {
    switch (currentView) {
      case 'config':
        return (
          <>
            <h2 className="text-xl font-bold mb-8">Configuration Management</h2>
            <ConfigurationManagement
              categories={configCategories}
              onSaveSetting={handleSaveSetting}
              onResetToDefault={handleResetToDefault}
              onImportConfig={handleImportConfig}
              onExportConfig={handleExportConfig}
              onTestConnection={handleTestConnection}
            />
          </>
        );
      case 'dashboard':
      case 'users':
      case 'extensions':
      case 'system':
      default:
        // This is just a fallback message since the actual redirect would happen via window.location
        return (
          <div className="text-center p-12">
            <h2 className="text-xl font-bold mb-4">Navigating to {currentView}...</h2>
            <p>You would be redirected to the {currentView} page in a full implementation.</p>
          </div>
        );
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <Sidebar 
        currentView={currentView}
        onNavigateToDashboard={handleNavigateToDashboard}
        onNavigateToUsers={handleNavigateToUsers}
        onNavigateToExtensions={handleNavigateToExtensions}
        onNavigateToSystem={handleNavigateToSystem}
        onNavigateToConfig={handleNavigateToConfig}
      />
      
      {/* Main Content */}
      <main className="ml-64 w-full pl-8 pr-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 shadow-lg">
          <div className="px-6 sm:px-8 lg:px-10">
            <div className="flex items-center justify-between py-5">
              <h1 className="text-2xl font-bold text-white flex items-center">
                <span className="bg-white text-blue-600 px-3 py-1 rounded-md mr-3">BizzyPerson</span>
                {currentView === 'dashboard' && 'Dashboard'}
                {currentView === 'users' && 'User Management'}
                {currentView === 'extensions' && 'Extension Management'}
                {currentView === 'system' && 'System Monitoring'}
                {currentView === 'config' && 'Configuration Management'}
              </h1>
            </div>
          </div>
        </div>
        
        <div className="px-6 sm:px-8 lg:px-10 py-7">
          {renderContent()}
        </div>
      </main>
      
      {/* Action Log */}
      <div className="fixed bottom-0 right-0 max-w-md bg-white shadow-lg border rounded-tl-lg overflow-hidden">
        <div className="px-3 py-2 bg-gray-100 border-b flex justify-between items-center">
          <h3 className="text-sm font-medium">Action Log:</h3>
        </div>
        <div className="p-3 text-xs max-h-40 overflow-y-auto">
          <div className="space-y-2">
            {actionLog.map((log, index) => (
              <div key={index} className="text-xs border-l-2 border-blue-500 pl-2 py-1">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationManagementDemo; 