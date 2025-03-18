import React from 'react';
import { MediaRenderer } from '../../../bizzy/core/shared/ui/components/multi-modal/MediaRenderer';
import { MediaType } from '../../../bizzy/core/shared/ui/components/multi-modal/utils/mediaTypeDetection';

export default {
  title: 'Core/MultiModal/MediaRenderer',
  component: MediaRenderer,
  parameters: {
    docs: {
      description: {
        component: 'Unified media renderer component for displaying various types of media including images, videos, audio, and documents.',
      },
    },
  },
  argTypes: {
    src: { control: 'text' },
    mediaType: { 
      control: { type: 'select' },
      options: Object.values(MediaType),
    },
    alt: { control: 'text' },
    title: { control: 'text' },
    enableSave: { control: 'boolean' },
    enableZoom: { control: 'boolean' },
    onSave: { action: 'onSave' },
    onError: { action: 'onError' },
  },
};

// Default image example
export const ImageExample = {
  args: {
    src: 'https://source.unsplash.com/800x600/?farm',
    mediaType: MediaType.IMAGE,
    alt: 'Farm image',
    title: 'Farm Overview',
    enableSave: true,
    enableZoom: true,
  },
};

// Image with farm context
export const ImageWithFarmContext = {
  args: {
    src: 'https://source.unsplash.com/800x600/?crops,corn',
    mediaType: MediaType.IMAGE,
    alt: 'Corn field image',
    title: 'Field A - Corn Growth Stage',
    farmContext: {
      fieldId: 'field-a',
      fieldName: 'North Field',
      cropType: 'Corn',
      season: 'Summer 2023',
    },
    enableSave: true,
    enableZoom: true,
  },
};

// Video example (placeholder)
export const VideoExample = {
  args: {
    src: 'https://example.com/sample-video.mp4',
    mediaType: MediaType.VIDEO,
    alt: 'Tractor operation video',
    title: 'Equipment Operation Demo',
    enableSave: true,
  },
};

// Audio example (placeholder)
export const AudioExample = {
  args: {
    src: 'https://example.com/sample-audio.mp3',
    mediaType: MediaType.AUDIO,
    alt: 'Field recording',
    title: 'Field Conditions Audio Notes',
    enableSave: true,
  },
};

// Document example (placeholder)
export const DocumentExample = {
  args: {
    src: 'https://example.com/sample-document.pdf',
    mediaType: MediaType.DOCUMENT,
    alt: 'Soil analysis report',
    title: 'Soil Testing Results',
    enableSave: true,
  },
};

// Example with saving disabled
export const SavingDisabled = {
  args: {
    src: 'https://source.unsplash.com/800x600/?tractor',
    mediaType: MediaType.IMAGE,
    alt: 'Tractor in field',
    title: 'Equipment',
    enableSave: false,
    enableZoom: true,
  },
};

// Example with zoom disabled
export const ZoomDisabled = {
  args: {
    src: 'https://source.unsplash.com/800x600/?irrigation',
    mediaType: MediaType.IMAGE,
    alt: 'Irrigation system',
    title: 'Irrigation Setup',
    enableSave: true,
    enableZoom: false,
  },
};

// Example with error handling
export const WithErrorHandling = {
  args: {
    src: 'https://invalid-url-that-will-fail.com/image.jpg',
    mediaType: MediaType.IMAGE,
    alt: 'This image will fail to load',
    title: 'Error Example',
    enableSave: true,
    enableZoom: true,
    onError: () => console.log('Media failed to load'),
  },
}; 