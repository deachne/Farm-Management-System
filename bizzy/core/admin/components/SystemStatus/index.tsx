import React from 'react';
import { SystemStatusProps, StatusType } from './types';
import { X, CheckCircle, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';

const SystemStatus: React.FC<SystemStatusProps> = ({
  isOperational,
  lastUpdated,
  services,
  incidents = [],
  onClose,
}) => {
  // Helper function to render the appropriate status badge
  const getStatusBadge = (status: StatusType) => {
    switch (status) {
      case 'healthy':
        return (
          <span className="px-2 py-1 text-xs rounded-md bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">
            Healthy
          </span>
        );
      case 'warning':
        return (
          <span className="px-2 py-1 text-xs rounded-md bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400">
            High Usage
          </span>
        );
      case 'error':
        return (
          <span className="px-2 py-1 text-xs rounded-md bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400">
            Error
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs rounded-md bg-gray-50 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400">
            Unknown
          </span>
        );
    }
  };

  return (
    <div className="h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-lg border-l border-gray-200 dark:border-gray-700">
      <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">System Status</h2>
        {onClose && (
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-md font-medium mb-2">Current Status</h3>
        
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
          <div className="text-center text-green-600 dark:text-green-400 font-semibold text-lg">
            {isOperational ? "All Systems Operational" : "System Issues Detected"}
          </div>
          
          {lastUpdated && (
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
              Last updated: {typeof lastUpdated === 'string' ? lastUpdated : lastUpdated.toLocaleString()}
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
            >
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {service.name}
              </div>
              <div>
                {getStatusBadge(service.status)}
              </div>
            </div>
          ))}
        </div>
        
        {incidents.length > 0 && (
          <div className="mt-8">
            <h3 className="text-md font-medium mb-3">Recent Incidents</h3>
            <div className="space-y-3">
              {incidents.map((incident) => (
                <div 
                  key={incident.id} 
                  className="p-3 border border-gray-200 dark:border-gray-700 rounded-md"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-medium">{incident.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      incident.status === 'ongoing' 
                        ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' 
                        : 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                    }`}>
                      {incident.status === 'ongoing' ? 'Ongoing' : 'Resolved'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {typeof incident.timestamp === 'string' 
                      ? incident.timestamp 
                      : incident.timestamp.toLocaleString()}
                  </div>
                  {incident.description && (
                    <div className="text-xs mt-2 text-gray-700 dark:text-gray-300">
                      {incident.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemStatus;
