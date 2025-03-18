import React from 'react';
import ImageArtifact from '../../../bizzy/core/shared/ui/components/artifacts/ImageArtifact';

export default {
  title: 'Core/Artifacts/ImageArtifact',
  component: ImageArtifact,
  parameters: {
    docs: {
      description: {
        component: 'Image artifact component for displaying images from LibreChat. Supports zooming, downloading, and saving as artifacts.',
      },
    },
  },
  argTypes: {
    src: { control: 'text' },
    alt: { control: 'text' },
    caption: { control: 'text' },
    isExpanded: { control: 'boolean' },
    onSave: { action: 'onSave' },
  },
};

// Default example with a sample farm image
export const Default = {
  args: {
    src: 'https://source.unsplash.com/800x600/?farm,field',
    alt: 'Sample farm field image',
    caption: 'Farm field overview',
    isExpanded: true,
  },
};

// Example with collapsed state
export const Collapsed = {
  args: {
    src: 'https://source.unsplash.com/800x600/?farm,crops',
    alt: 'Crop growth image',
    caption: 'Corn growth at V5 stage',
    isExpanded: false,
  },
};

// Example with a drone image
export const DroneImage = {
  args: {
    src: 'https://source.unsplash.com/800x600/?drone,agriculture',
    alt: 'Drone view of agricultural field',
    caption: 'Drone survey of Field B showing irrigation patterns',
    isExpanded: true,
    farmContext: {
      fieldId: 'field-b',
      fieldName: 'West Field',
      cropType: 'Soybeans',
    },
  },
};

// Example with soil sample image
export const SoilSample = {
  args: {
    src: 'https://source.unsplash.com/800x600/?soil,agriculture',
    alt: 'Soil sample analysis',
    caption: 'Soil core sample from Field C showing moisture gradient',
    isExpanded: true,
  },
};

// Example with tall/portrait image
export const PortraitImage = {
  args: {
    src: 'https://source.unsplash.com/600x1200/?crop,corn',
    alt: 'Tall corn stalk image',
    caption: 'Corn stalk height measurement at 96 days post-planting',
    isExpanded: true,
  },
};

// Example with wide/landscape image
export const LandscapeImage = {
  args: {
    src: 'https://source.unsplash.com/1600x900/?farm,landscape',
    alt: 'Wide landscape view of farm',
    caption: 'Panoramic view of farm operations area',
    isExpanded: true,
  },
};

// Example with save handler
export const WithSaveHandler = {
  args: {
    src: 'https://source.unsplash.com/800x600/?farm,agriculture',
    alt: 'Farm irrigation system',
    caption: 'New irrigation system installed in Field A',
    isExpanded: true,
    onSave: (artifactData) => {
      console.log('Saved image artifact data:', artifactData);
      alert('Image artifact saved! Check console for details.');
    },
  },
}; 