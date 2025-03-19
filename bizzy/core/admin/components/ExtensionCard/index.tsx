import React from 'react';
import { Card, CardContent } from '../../../shared/ui/components/Card';
import { Button } from '../../../shared/ui/components/Button';
import { Badge } from '../../../shared/ui/components/Badge';
import { ExtensionCardProps } from './types';
import { FileText, Search, Network, Users as UsersIcon, Database } from 'lucide-react';

const ExtensionCard: React.FC<ExtensionCardProps> = ({
  name,
  icon,
  version,
  status,
  permissions = {},
  resources = {},
  onConfigure,
  onActivate,
  onDeactivate,
}) => {
  const { documentAccess, searchAccess, networkAccess } = permissions;
  const { users, storage } = resources;
  
  return (
    <Card className={`border ${status === 'active' ? 'border-gray-200 dark:border-gray-700' : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50'} rounded-lg shadow-sm hover:shadow-md transition-shadow mb-4 overflow-hidden`}>
      <CardContent className="p-0">
        <div className="p-5 flex items-start justify-between">
          <div className="flex items-center">
            <div className={`mr-4 p-3 rounded-lg ${status === 'active' ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
              <div className={`text-2xl ${status === 'active' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
                {icon}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">v{version}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge 
              variant={status === 'active' ? 'success' : 'secondary'}
              className={`px-3 py-1 ${status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400'}`}
            >
              {status === 'active' ? 'Active' : 'Inactive'}
            </Badge>
            {status === 'active' ? (
              <Button 
                variant="primary" 
                onClick={onConfigure}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm hover:shadow text-white"
              >
                Configure
              </Button>
            ) : (
              <Button 
                variant="outline"
                onClick={onActivate}
                className="px-4 py-2 border border-blue-500 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 transition-colors"
              >
                Activate
              </Button>
            )}
          </div>
        </div>
        
        <div className={`${status === 'active' ? 'bg-gray-50 dark:bg-gray-800/70' : 'bg-gray-100 dark:bg-gray-800'} p-4 flex flex-wrap items-center gap-3 border-t border-gray-200 dark:border-gray-700`}>
          <div className="flex items-center gap-2">
            {documentAccess ? (
              <div className="flex items-center bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-md text-sm text-blue-700 dark:text-blue-300">
                <FileText className="h-4 w-4 mr-1.5" />
                Document Access
              </div>
            ) : (
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-md text-sm text-gray-500 dark:text-gray-400 opacity-70">
                <FileText className="h-4 w-4 mr-1.5" />
                No Document Access
              </div>
            )}
            
            {searchAccess ? (
              <div className="flex items-center bg-purple-50 dark:bg-purple-900/20 px-3 py-1.5 rounded-md text-sm text-purple-700 dark:text-purple-300">
                <Search className="h-4 w-4 mr-1.5" />
                Search Access
              </div>
            ) : (
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-md text-sm text-gray-500 dark:text-gray-400 opacity-70">
                <Search className="h-4 w-4 mr-1.5" />
                No Search Access
              </div>
            )}
            
            {networkAccess ? (
              <div className="flex items-center bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-md text-sm text-green-700 dark:text-green-300">
                <Network className="h-4 w-4 mr-1.5" />
                Network Access
              </div>
            ) : (
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-md text-sm text-gray-500 dark:text-gray-400 opacity-70">
                <Network className="h-4 w-4 mr-1.5" />
                No Network Access
              </div>
            )}
          </div>
          
          <div className="ml-auto flex items-center space-x-4">
            {users && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50 px-3 py-1.5 rounded-md">
                <UsersIcon className="h-4 w-4 mr-1.5 text-blue-500 dark:text-blue-400" />
                <span className="font-medium">{users}</span> Users
              </div>
            )}
            {storage && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50 px-3 py-1.5 rounded-md">
                <Database className="h-4 w-4 mr-1.5 text-blue-500 dark:text-blue-400" />
                <span className="font-medium">{storage}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExtensionCard;
