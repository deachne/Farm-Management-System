import React from 'react';
import ArtifactManager from '../../../bizzy/core/shared/ui/components/ArtifactManager';
import { ContentTypes } from '../../../bizzy/core/shared/types/librechat-types';

export default {
  title: 'Core/Artifacts/ArtifactManager',
  component: ArtifactManager,
  parameters: {
    docs: {
      description: {
        component: 'Manager component for handling LibreChat artifacts in AnythingLLM. Provides an interface for storing, displaying, and interacting with artifacts.',
      },
    },
    layout: 'fullscreen',
  },
  argTypes: {
    isDevelopment: { control: 'boolean' },
    chatId: { control: 'text' },
  },
};

// Default example
export const Default = {
  args: {
    isDevelopment: true,
    chatId: 'chat-12345',
  },
};

// With farm context
export const WithFarmContext = {
  args: {
    isDevelopment: true,
    chatId: 'chat-12345',
    farmContext: {
      currentField: {
        id: 'field-a',
        name: 'North Corn Field',
        cropType: 'Corn',
        size: 45,
      },
      benchmarks: {
        highYield: 180,
        lowYield: 120,
      },
      moistureTargets: {
        optimal: 45,
        minimum: 30,
        maximum: 60,
      },
      season: 'Summer 2023',
    },
  },
};

// With panel open
export const WithPanelOpen = {
  render: (args) => {
    // In a real scenario, this would come from a message
    const demoArtifact = {
      type: ContentTypes.TEXT,
      text: 'This is a demonstration artifact showing the ArtifactManager with an open panel. It contains farm-related content about crop yields and soil moisture levels in Field A.'
    };
    
    // We're using a render function to handle this case
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Chat Interface Demo</h1>
          <div className="bg-white p-4 rounded shadow mb-4">
            <p>This is the main chat area. The artifact panel is displayed to the side.</p>
          </div>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => {
              // This would normally happen through the ArtifactManager's internal state
              const manager = document.querySelector('[data-testid="artifact-manager"]');
              const panel = manager?.querySelector('[data-testid="artifact-panel"]');
              if (panel) {
                panel.classList.add('open');
              }
            }}
          >
            Open Artifact Panel
          </button>
        </div>
        <ArtifactManager
          {...args}
          data-testid="artifact-manager"
        />
      </div>
    );
  },
  args: {
    isDevelopment: true, 
    chatId: 'chat-12345',
  },
};

// Development mode with testing buttons
export const DevelopmentMode = {
  args: {
    isDevelopment: true,
    chatId: 'chat-dev',
    farmContext: {
      currentField: {
        id: 'field-b',
        name: 'East Soybean Field',
        cropType: 'Soybeans',
        size: 30,
      },
      season: 'Summer 2023',
    },
  },
};

// Production mode (without testing controls)
export const ProductionMode = {
  args: {
    isDevelopment: false,
    chatId: 'chat-prod',
  },
}; 