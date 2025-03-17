import React from 'react';

const AdvancedFeaturesPanel: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-theme-text-primary">Advanced Features</h2>
        <p className="text-theme-text-secondary">
          Configure beta features, experimental settings, and specialized tools
        </p>
      </div>
      
      <div className="bg-theme-bg-secondary rounded-lg p-4 mb-4">
        <h3 className="text-lg font-medium text-theme-text-primary mb-3">Beta Features</h3>
        <p className="text-theme-text-secondary mb-4">
          This panel will allow enabling/disabling of beta features from both systems.
        </p>
      </div>
      
      <div className="bg-theme-bg-secondary rounded-lg p-4 mb-4">
        <h3 className="text-lg font-medium text-theme-text-primary mb-3">Speech Settings</h3>
        <p className="text-theme-text-secondary mb-4">
          This panel will allow configuration of speech-to-text and text-to-speech features.
        </p>
      </div>
      
      <div className="bg-theme-bg-secondary rounded-lg p-4 mb-4">
        <h3 className="text-lg font-medium text-theme-text-primary mb-3">Command Configuration</h3>
        <p className="text-theme-text-secondary mb-4">
          This panel will allow configuration of chat commands and shortcuts.
        </p>
      </div>
      
      <div className="bg-theme-bg-secondary rounded-lg p-4 mb-4">
        <h3 className="text-lg font-medium text-theme-text-primary mb-3">Data Management</h3>
        <p className="text-theme-text-secondary mb-4">
          This panel will allow management of user data, export, and import options.
        </p>
      </div>
    </div>
  );
};

export default AdvancedFeaturesPanel; 