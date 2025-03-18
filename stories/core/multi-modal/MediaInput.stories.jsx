import React from 'react';
import { MediaInput } from '../../../bizzy/core/shared/ui/components/multi-modal/MediaInput';
import { MediaType } from '../../../bizzy/core/shared/ui/components/multi-modal/utils/mediaTypeDetection';

export default {
  title: 'Core/MultiModal/MediaInput',
  component: MediaInput,
  parameters: {
    docs: {
      description: {
        component: 'Multi-modal input component for accepting various media types including images, videos, audio, and documents. Supports upload, preview, and validation.',
      },
    },
  },
  argTypes: {
    allowedTypes: { 
      control: 'object',
      description: 'Array of allowed media types',
    },
    maxFileSize: { 
      control: 'number',
      description: 'Maximum file size in MB',
    },
    maxFiles: { 
      control: 'number',
      description: 'Maximum number of files allowed',
    },
    isFarmContext: { 
      control: 'boolean',
      description: 'Whether the component is used in a farm context',
    },
    onMediaSelected: { action: 'onMediaSelected' },
    onError: { action: 'onError' },
  },
};

// Default state
export const Default = {
  args: {
    allowedTypes: [MediaType.IMAGE, MediaType.VIDEO, MediaType.AUDIO, MediaType.DOCUMENT],
    maxFileSize: 10,
    maxFiles: 5,
    isFarmContext: false,
  },
};

// Images only
export const ImagesOnly = {
  args: {
    allowedTypes: [MediaType.IMAGE],
    maxFileSize: 10,
    maxFiles: 5,
    isFarmContext: false,
    helpText: 'Upload farm-related images only (JPG, PNG, GIF)',
  },
};

// Farm context with field metadata
export const FarmContext = {
  args: {
    allowedTypes: [MediaType.IMAGE, MediaType.DOCUMENT],
    maxFileSize: 10,
    maxFiles: 5,
    isFarmContext: true,
    farmContext: {
      fields: [
        { id: 'field-a', name: 'North Field', cropType: 'Corn' },
        { id: 'field-b', name: 'South Field', cropType: 'Soybeans' },
        { id: 'field-c', name: 'West Field', cropType: 'Wheat' },
      ],
      season: 'Summer 2023',
    },
    helpText: 'Upload field images or documents. Field metadata will be automatically attached.',
  },
};

// With custom validation
export const WithCustomValidation = {
  args: {
    allowedTypes: [MediaType.IMAGE, MediaType.DOCUMENT],
    maxFileSize: 5,
    maxFiles: 2,
    isFarmContext: true,
    customValidator: (file) => {
      // Example validation that checks image dimensions for field imagery
      if (file.type.startsWith('image/')) {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            if (img.width < 800 || img.height < 600) {
              reject('Field images must be at least 800x600 pixels for analysis');
            } else {
              resolve(true);
            }
          };
          img.onerror = () => reject('Failed to load image for validation');
          img.src = URL.createObjectURL(file);
        });
      }
      
      // For non-images, just pass through
      return Promise.resolve(true);
    },
    helpText: 'Images must be at least 800x600 pixels for proper field analysis',
  },
};

// With compact layout
export const CompactLayout = {
  args: {
    allowedTypes: [MediaType.IMAGE, MediaType.DOCUMENT],
    maxFileSize: 10,
    maxFiles: 3,
    isFarmContext: false,
    compact: true,
    helpText: 'Upload in compact mode',
  },
};

// With pre-selected files
export const WithPreselectedFiles = {
  render: (args) => {
    // This would normally be state from a parent component
    const preselectedFiles = [
      {
        name: 'field-a-aerial.jpg',
        mediaType: MediaType.IMAGE,
        previewUrl: 'https://source.unsplash.com/800x600/?farm,field',
        metadata: {
          fieldId: 'field-a',
          captureDate: '2023-06-15',
        }
      },
      {
        name: 'soil-analysis.pdf',
        mediaType: MediaType.DOCUMENT,
        previewUrl: null,
        metadata: {
          fieldId: 'field-a',
          analysisDate: '2023-06-01',
        }
      }
    ];
    
    return <MediaInput {...args} initialFiles={preselectedFiles} />;
  },
  args: {
    allowedTypes: [MediaType.IMAGE, MediaType.DOCUMENT],
    maxFileSize: 10,
    maxFiles: 5,
    isFarmContext: true,
    helpText: 'You can add more files or remove the existing ones',
  },
};

// With error state
export const WithErrorState = {
  render: (args) => {
    return (
      <MediaInput 
        {...args}
        onError={(message) => {
          console.error('Media input error:', message);
          // This would normally update state in the parent component
          document.getElementById('error-message').textContent = message;
        }}
      />
    );
  },
  args: {
    allowedTypes: [MediaType.IMAGE],
    maxFileSize: 2, // Very small to easily demonstrate errors
    maxFiles: 1,
    isFarmContext: false,
    helpText: 'Try uploading a file larger than 2MB to see the error',
  },
  decorators: [
    (Story) => (
      <div>
        <Story />
        <div className="mt-4 p-3 bg-red-100 text-red-800 rounded" id="error-message">
          No error yet. Try uploading a large file.
        </div>
      </div>
    ),
  ],
};

// With custom label and appearance
export const CustomAppearance = {
  args: {
    allowedTypes: [MediaType.IMAGE, MediaType.VIDEO],
    maxFileSize: 10,
    maxFiles: 5,
    isFarmContext: true,
    label: '📷 Upload Field Imagery',
    helpText: 'Drag and drop field photos or videos for analysis',
    className: 'border-2 border-dashed border-green-500 bg-green-50 p-6 rounded-lg',
    buttonLabel: 'Select Field Media',
    buttonClassName: 'bg-green-600 hover:bg-green-700 text-white',
  },
}; 