import React, { useState } from 'react';
import { Card, CardContent } from '@/core/shared/ui/components/Card';
import { Button } from '@/core/shared/ui/components/Button';
import { Extension, ExtensionPermission } from './types';
import { X, Shield, Save, Check, Info, AlertTriangle } from 'lucide-react';

interface ExtensionPermissionsModalProps {
  extension: Extension;
  onClose: () => void;
  onSave: (permissions: Record<string, boolean>) => void;
}

/**
 * Extension Permissions Modal
 * 
 * Provides a modal interface for managing extension permissions.
 */
const ExtensionPermissionsModal: React.FC<ExtensionPermissionsModalProps> = ({
  extension,
  onClose,
  onSave
}) => {
  // Initialize permissions state based on current extension permissions
  const [permissions, setPermissions] = useState<Record<string, boolean>>({
    documentAccess: extension.permissions?.documentAccess || false,
    searchAccess: extension.permissions?.searchAccess || false,
    networkAccess: extension.permissions?.networkAccess || false,
    userDataAccess: false,
    systemSettingsAccess: false,
    fileSystemAccess: false,
    apiAccess: false,
    extensionAccess: false,
    ...extension.permissions
  });
  
  // Sample permissions for UI organization
  const permissionGroups = [
    {
      title: 'Data Access',
      description: 'Permissions for accessing various data sources',
      permissions: [
        {
          id: 'documentAccess',
          name: 'Document Access',
          description: 'Access to read and modify documents in the knowledge base',
          category: 'document',
          riskLevel: 'medium'
        },
        {
          id: 'searchAccess',
          name: 'Search Access',
          description: 'Access to search functionality and user search history',
          category: 'search',
          riskLevel: 'low'
        },
        {
          id: 'userDataAccess',
          name: 'User Data Access',
          description: 'Access to user profile data and preferences',
          category: 'user',
          riskLevel: 'high'
        }
      ]
    },
    {
      title: 'System Access',
      description: 'Permissions for accessing system features',
      permissions: [
        {
          id: 'networkAccess',
          name: 'Network Access',
          description: 'Access to make network requests to external services',
          category: 'network',
          riskLevel: 'high'
        },
        {
          id: 'systemSettingsAccess',
          name: 'System Settings Access',
          description: 'Access to read and modify system settings',
          category: 'system',
          riskLevel: 'high'
        },
        {
          id: 'fileSystemAccess',
          name: 'File System Access',
          description: 'Access to read and write files on the server',
          category: 'system',
          riskLevel: 'critical'
        }
      ]
    },
    {
      title: 'Integration Access',
      description: 'Permissions for integrating with other systems',
      permissions: [
        {
          id: 'apiAccess',
          name: 'API Access',
          description: 'Access to the BizzyPerson API for custom integrations',
          category: 'system',
          riskLevel: 'medium'
        },
        {
          id: 'extensionAccess',
          name: 'Extension Access',
          description: 'Access to interact with other extensions',
          category: 'system',
          riskLevel: 'medium'
        }
      ]
    }
  ];
  
  // Toggle permission
  const togglePermission = (id: string) => {
    setPermissions({
      ...permissions,
      [id]: !permissions[id]
    });
  };
  
  // Handle save
  const handleSave = () => {
    onSave(permissions);
  };
  
  // Get risk badge for permission risk level
  const getRiskBadge = (riskLevel: string) => {
    switch(riskLevel) {
      case 'low':
        return (
          <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            <Info className="h-3 w-3 mr-1" />
            Low Risk
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
            <Info className="h-3 w-3 mr-1" />
            Medium Risk
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
            <AlertTriangle className="h-3 w-3 mr-1" />
            High Risk
          </span>
        );
      case 'critical':
        return (
          <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Critical Risk
          </span>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-blue-50 dark:bg-blue-900/20">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <Shield className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            Manage Permissions: {extension.name}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage which permissions this extension has access to. Limiting permissions can enhance security but may restrict functionality.
            </p>
          </div>
          
          {permissionGroups.map((group) => (
            <Card key={group.title} className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm mb-6">
              <CardContent className="p-5">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">{group.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{group.description}</p>
                
                <div className="space-y-4">
                  {group.permissions.map((permission) => (
                    <div key={permission.id} className="flex items-start py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mr-2">
                            {permission.name}
                          </h4>
                          {getRiskBadge(permission.riskLevel)}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{permission.description}</p>
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() => togglePermission(permission.id)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            permissions[permission.id] 
                              ? 'bg-blue-600 dark:bg-blue-500' 
                              : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              permissions[permission.id] ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Security warning for high-risk permissions */}
          {Object.entries(permissions).some(([key, value]) => {
            const highRiskPermissions = ['userDataAccess', 'systemSettingsAccess', 'fileSystemAccess', 'networkAccess'];
            return highRiskPermissions.includes(key) && value;
          }) && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-6 rounded-md">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Security Warning</h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-200 mt-1">
                    You have granted high-risk permissions to this extension. This may pose security risks to your system.
                    Only grant these permissions if you trust the extension developer and understand the potential risks.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-4 bg-gray-50 dark:bg-gray-800">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Permissions
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExtensionPermissionsModal; 