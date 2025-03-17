import React from 'react';

const AIConfigPanel: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-theme-text-primary">AI Configuration</h2>
        <p className="text-theme-text-secondary">
          Configure embedding models, knowledge base, and retrieval settings
        </p>
      </div>
      
      <div className="bg-theme-bg-secondary rounded-lg p-4 mb-4">
        <h3 className="text-lg font-medium text-theme-text-primary mb-3">Embedding Model</h3>
        <p className="text-theme-text-secondary mb-4">
          This panel will allow selection and configuration of embedding models.
        </p>
      </div>
      
      <div className="bg-theme-bg-secondary rounded-lg p-4 mb-4">
        <h3 className="text-lg font-medium text-theme-text-primary mb-3">Knowledge Base Configuration</h3>
        <p className="text-theme-text-secondary mb-4">
          This panel will allow configuration of knowledge base settings.
        </p>
      </div>
      
      <div className="bg-theme-bg-secondary rounded-lg p-4 mb-4">
        <h3 className="text-lg font-medium text-theme-text-primary mb-3">Retrieval Settings</h3>
        <p className="text-theme-text-secondary mb-4">
          This panel will allow configuration of retrieval parameters.
        </p>
      </div>
    </div>
  );
};

export default AIConfigPanel; 