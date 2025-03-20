import React, { useState } from 'react';
import { Card, CardContent } from '@/core/shared/ui/components/Card';
import { Button } from '@/core/shared/ui/components/Button';
import { Input } from '@/core/shared/ui/components/Input';
import { Extension } from './types';
import { X, Save, Settings, ArrowLeft } from 'lucide-react';

interface ExtensionConfigPanelProps {
  extension: Extension;
  onClose: () => void;
  onSave?: (extension: Extension, config: Record<string, any>) => void;
}

/**
 * Extension Configuration Panel
 * 
 * A slide-in panel for configuring extension settings.
 * Provides a UI for editing extension configuration options.
 */
const ExtensionConfigPanel: React.FC<ExtensionConfigPanelProps> = ({
  extension,
  onClose,
  onSave
}) => {
  // Initialize config state with current extension config
  const [config, setConfig] = useState<Record<string, any>>(extension.config || {});
  const [isEditing, setIsEditing] = useState(false);

  // Sample configuration fields (these would come from the extension schema in a real implementation)
  const configFields = [
    { key: 'apiKey', type: 'password', label: 'API Key', description: 'API key for external service access' },
    { key: 'endpoint', type: 'text', label: 'API Endpoint', description: 'Service endpoint URL' },
    { key: 'maxResults', type: 'number', label: 'Max Results', description: 'Maximum number of results to return' },
    { key: 'enableCaching', type: 'checkbox', label: 'Enable Caching', description: 'Cache results for better performance' },
    { key: 'refreshInterval', type: 'number', label: 'Refresh Interval (min)', description: 'Data refresh interval in minutes' }
  ];

  // Update config field
  const updateConfig = (key: string, value: any) => {
    setConfig({
      ...config,
      [key]: value
    });
    setIsEditing(true);
  };

  // Handle save
  const handleSave = () => {
    if (onSave) {
      onSave(extension, config);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md h-full overflow-y-auto shadow-lg">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-blue-50 dark:bg-blue-900/20">
          <div className="flex items-center">
            <button 
              onClick={onClose}
              className="p-1 mr-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <Settings className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                Configure Extension
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{extension.name} v{extension.version}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Extension Configuration</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Configure the settings for {extension.name}. These settings will apply to all users with access to this extension.
            </p>
          </div>
          
          <Card className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm mb-6">
            <CardContent className="p-5 space-y-6">
              {/* Configuration fields */}
              {configFields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <label 
                    htmlFor={field.key} 
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {field.label}
                    {field.type === 'password' && (
                      <span className="ml-2 text-xs text-blue-600 dark:text-blue-400">(Encrypted)</span>
                    )}
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{field.description}</p>
                  
                  {field.type === 'checkbox' ? (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={field.key}
                        checked={config[field.key] || false}
                        onChange={(e) => updateConfig(field.key, e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:focus:ring-blue-400"
                      />
                      <label 
                        htmlFor={field.key} 
                        className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                      >
                        {config[field.key] ? 'Enabled' : 'Disabled'}
                      </label>
                    </div>
                  ) : (
                    <Input
                      type={field.type}
                      id={field.key}
                      value={config[field.key] || ''}
                      onChange={(e) => updateConfig(field.key, field.type === 'number' ? parseInt(e.target.value) : e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-md text-sm"
                      placeholder={`Enter ${field.label}`}
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm mb-6">
            <CardContent className="p-5">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Extension Information</h4>
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1.5">
                <p><span className="font-semibold">ID:</span> {extension.id}</p>
                <p><span className="font-semibold">Version:</span> {extension.version}</p>
                <p><span className="font-semibold">Status:</span> {extension.status === 'active' ? 'Active' : 'Inactive'}</p>
                {extension.description && (
                  <p className="mt-2">{extension.description}</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Action buttons */}
          <div className="flex justify-end space-x-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSave}
              disabled={!isEditing}
              className={`px-4 py-2 ${isEditing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-400 cursor-not-allowed'} text-white transition-colors flex items-center`}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtensionConfigPanel; 