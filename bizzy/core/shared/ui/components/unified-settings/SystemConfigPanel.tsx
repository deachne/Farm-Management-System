import React from 'react';

const SystemConfigPanel: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-theme-text-primary">System Configuration</h2>
        <p className="text-theme-text-secondary">
          Configure system settings, API keys, and environment variables
        </p>
      </div>
      
      <div className="bg-theme-bg-secondary rounded-lg p-4 mb-4">
        <h3 className="text-lg font-medium text-theme-text-primary mb-3">API Keys Configuration</h3>
        <p className="text-theme-text-secondary mb-4">
          This panel will allow configuration of API keys for various services.
        </p>
      </div>
      
      <div className="bg-theme-bg-secondary rounded-lg p-4 mb-4">
        <h3 className="text-lg font-medium text-theme-text-primary mb-3">Vector Database Settings</h3>
        <p className="text-theme-text-secondary mb-4">
          This panel will allow configuration of vector database connection settings.
        </p>
      </div>
      
      <div className="bg-theme-bg-secondary rounded-lg p-4 mb-4">
        <h3 className="text-lg font-medium text-theme-text-primary mb-3">Environment Configuration</h3>
        <p className="text-theme-text-secondary mb-4">
          This panel will allow modification of environment variables and system settings.
        </p>
      </div>
    </div>
  );
};

export default SystemConfigPanel; 