import React from 'react';

const ChatExperiencePanel: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-theme-text-primary">Chat Experience</h2>
        <p className="text-theme-text-secondary">
          Configure chat behavior, model settings, and message formatting
        </p>
      </div>
      
      <div className="bg-theme-bg-secondary rounded-lg p-4 mb-4">
        <h3 className="text-lg font-medium text-theme-text-primary mb-3">LLM Selection</h3>
        <p className="text-theme-text-secondary mb-4">
          This panel will allow selection and configuration of LLM models.
        </p>
      </div>
      
      <div className="bg-theme-bg-secondary rounded-lg p-4 mb-4">
        <h3 className="text-lg font-medium text-theme-text-primary mb-3">Chat Behavior</h3>
        <p className="text-theme-text-secondary mb-4">
          This panel will allow configuration of chat behavior and appearance.
        </p>
      </div>
      
      <div className="bg-theme-bg-secondary rounded-lg p-4 mb-4">
        <h3 className="text-lg font-medium text-theme-text-primary mb-3">Message Formatting</h3>
        <p className="text-theme-text-secondary mb-4">
          This panel will allow configuration of message formatting options.
        </p>
      </div>
    </div>
  );
};

export default ChatExperiencePanel; 