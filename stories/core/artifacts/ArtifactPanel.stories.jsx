import React from 'react';
import ArtifactPanel from '../../../bizzy/core/shared/ui/components/ArtifactPanel';
import TextArtifact from '../../../bizzy/core/shared/ui/components/artifacts/TextArtifact';

export default {
  title: 'Core/Artifacts/ArtifactPanel',
  component: ArtifactPanel,
  parameters: {
    docs: {
      description: {
        component: 'Sliding panel component for displaying artifacts. Can be opened and closed, and contains various artifact components.',
      },
    },
  },
  argTypes: {
    isOpen: { control: 'boolean' },
    onClose: { action: 'onClose' },
    title: { control: 'text' },
  },
};

// Default example with simple content
export const Default = {
  args: {
    isOpen: true,
    title: 'Artifact Panel',
    children: <div className="p-4">This is the content of the artifact panel.</div>,
  },
};

// Example with text artifact
export const WithTextArtifact = {
  args: {
    isOpen: true,
    title: 'Text Artifact View',
    children: (
      <TextArtifact 
        textContent="This is a text artifact displayed within the artifact panel. The panel provides a consistent container for different types of artifacts."
        isExpanded={true}
      />
    ),
  },
};

// Example with closed panel
export const Closed = {
  args: {
    isOpen: false,
    title: 'Closed Panel',
    children: <div className="p-4">This content is not visible when panel is closed.</div>,
  },
};

// Example with custom title
export const CustomTitle = {
  args: {
    isOpen: true,
    title: '🌾 Farm Observation Data',
    children: (
      <TextArtifact 
        textContent="Field A: Corn yield estimate is 180 bushels per acre based on current growth stage and conditions."
        isExpanded={true}
      />
    ),
  },
};

// Example with multiple children
export const MultipleChildren = {
  args: {
    isOpen: true,
    title: 'Multiple Artifacts',
    children: (
      <>
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-md">
          These are multiple artifacts displayed together in one panel.
        </div>
        <TextArtifact 
          textContent="First artifact: Field moisture readings"
          isExpanded={true}
        />
        <div className="my-4 border-t border-gray-200 dark:border-gray-700"></div>
        <TextArtifact 
          textContent="Second artifact: Crop health assessment"
          isExpanded={true}
        />
      </>
    ),
  },
}; 