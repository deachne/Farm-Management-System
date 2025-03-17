import React from 'react';

const ExtensionsPanel: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-theme-text-primary">Extensions</h2>
        <p className="text-theme-text-secondary">
          Manage extensions, plugins, and their configurations
        </p>
      </div>
      
      <div className="bg-theme-bg-secondary rounded-lg p-4 mb-4">
        <h3 className="text-lg font-medium text-theme-text-primary mb-3">Installed Extensions</h3>
        <p className="text-theme-text-secondary mb-4">
          This panel will display and allow management of installed extensions.
        </p>
      </div>
      
      <div className="bg-theme-bg-secondary rounded-lg p-4 mb-4">
        <h3 className="text-lg font-medium text-theme-text-primary mb-3">Extension Settings</h3>
        <p className="text-theme-text-secondary mb-4">
          This panel will allow configuration of extension-specific settings.
        </p>
      </div>
      
      <div className="bg-theme-bg-secondary rounded-lg p-4 mb-4">
        <h3 className="text-lg font-medium text-theme-text-primary mb-3">Plugin Management</h3>
        <p className="text-theme-text-secondary mb-4">
          This panel will allow management of plugins and their permissions.
        </p>
      </div>
    </div>
  );
};

export default ExtensionsPanel; 