import React from 'react';
import ArtifactRenderer from '../../../bizzy/core/shared/ui/components/ArtifactRenderer';
import { ContentTypes } from '../../../bizzy/core/shared/types/librechat-types';

export default {
  title: 'Core/Artifacts/ArtifactRenderer',
  component: ArtifactRenderer,
  parameters: {
    docs: {
      description: {
        component: 'Universal renderer for LibreChat artifacts. Detects and renders the appropriate component based on the artifact type.',
      },
    },
  },
  argTypes: {
    onSaveArtifact: { action: 'onSaveArtifact' },
  },
};

// Text Artifact Example
export const TextArtifact = {
  args: {
    artifact: {
      type: ContentTypes.TEXT,
      text: 'This is a text artifact with farm-related content about crop growth patterns and soil moisture levels. The soil moisture in Field A is currently at 35%, which is below the optimal range for corn crops.',
    },
    attachments: [],
  },
};

// Code Artifact Example
export const CodeArtifact = {
  args: {
    artifact: {
      type: ContentTypes.CODE,
      language: 'javascript',
      code: `function calculateYield(fieldData) {
  const { areaInAcres, expectedYieldPerAcre, moistureLevel } = fieldData;
  
  // Adjust yield based on moisture levels
  let moistureAdjustment = 1.0;
  if (moistureLevel < 30) {
    moistureAdjustment = 0.8; // 20% reduction for dry conditions
  } else if (moistureLevel > 60) {
    moistureAdjustment = 0.9; // 10% reduction for overly wet conditions
  }
  
  const totalExpectedYield = areaInAcres * expectedYieldPerAcre * moistureAdjustment;
  return {
    totalYield: totalExpectedYield,
    adjustmentFactor: moistureAdjustment,
    adjustmentReason: getAdjustmentReason(moistureLevel)
  };
}`,
    },
    attachments: [],
  },
};

// Image Artifact Example
export const ImageArtifact = {
  args: {
    artifact: {
      type: ContentTypes.IMAGE,
      image_url: 'https://source.unsplash.com/800x600/?farm,field',
      alt: 'Farm field image',
      caption: 'Aerial view of Field A showing irrigation patterns',
    },
    attachments: [
      {
        type: 'image',
        url: 'https://source.unsplash.com/800x600/?farm,field',
        title: 'Field A - Aerial View',
        metadata: {
          fieldId: 'field-a',
          captureDate: '2023-06-15',
        },
      },
    ],
  },
};

// Table Artifact Example
export const TableArtifact = {
  args: {
    artifact: {
      type: ContentTypes.TABLE,
      table: {
        headers: ['Field ID', 'Crop Type', 'Area (acres)', 'Yield (bu/acre)', 'Moisture (%)'],
        rows: [
          ['F-101', 'Corn', 45.2, 180, 18.5],
          ['F-102', 'Soybeans', 30.0, 55, 13.0],
          ['F-103', 'Wheat', 25.7, 65, 12.5],
          ['F-104', 'Corn', 50.1, 175, 19.0],
          ['F-105', 'Alfalfa', 15.3, 4.5, 60.0],
        ]
      },
      caption: 'Farm Field Production Summary',
    },
    attachments: [],
  },
};

// Chart Artifact Example
export const ChartArtifact = {
  args: {
    artifact: {
      type: ContentTypes.CHART,
      chart: {
        type: 'bar',
        data: {
          labels: ['Corn', 'Soybeans', 'Wheat', 'Alfalfa', 'Oats'],
          datasets: [
            {
              label: 'Yield (bu/acre)',
              data: [180, 55, 65, 4.5, 85],
              backgroundColor: [
                'rgba(54, 162, 235, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(153, 102, 255, 0.5)',
                'rgba(255, 159, 64, 0.5)',
              ],
              borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
              ],
              borderWidth: 1,
            },
          ],
        },
        title: 'Crop Yield Comparison',
      },
    },
    attachments: [],
  },
};

// Multi-part Artifact Example (with different types)
export const ComplexArtifact = {
  args: {
    artifact: {
      type: ContentTypes.MULTI,
      parts: [
        {
          type: ContentTypes.TEXT,
          text: '# Farm Analysis Report\n\nBelow are the key findings from our analysis of Field A:',
        },
        {
          type: ContentTypes.TABLE,
          table: {
            headers: ['Metric', 'Current Value', 'Target Range', 'Status'],
            rows: [
              ['Soil Moisture', '35%', '45-55%', 'Below Target'],
              ['Nitrogen', '45 ppm', '40-60 ppm', 'On Target'],
              ['Phosphorus', '32 ppm', '30-50 ppm', 'On Target'],
              ['Potassium', '120 ppm', '100-150 ppm', 'On Target'],
              ['pH', '6.8', '6.5-7.2', 'On Target'],
            ]
          },
          caption: 'Field A Soil Analysis',
        },
        {
          type: ContentTypes.TEXT,
          text: '## Recommendations\n\n1. Increase irrigation to achieve optimal soil moisture levels\n2. Continue monitoring nitrogen levels\n3. Plan for standard fertilizer application next season',
        },
      ],
    },
    attachments: [
      {
        type: 'image',
        url: 'https://source.unsplash.com/800x600/?soil,agriculture',
        title: 'Soil Sample Analysis',
        metadata: {
          fieldId: 'field-a',
          sampleDepth: '6 inches',
          sampleDate: '2023-06-10',
        },
      },
    ],
    farmContext: {
      currentField: {
        id: 'field-a',
        name: 'North Field',
        cropType: 'Corn',
        size: 45,
      },
      season: 'Summer 2023',
    },
  },
};

// With Save Handler
export const WithSaveHandler = {
  args: {
    artifact: {
      type: ContentTypes.TEXT,
      text: 'This artifact has a save handler attached. Click the Save button to see it in action.',
    },
    attachments: [],
    onSaveArtifact: (artifactData) => {
      console.log('Saved artifact data:', artifactData);
      alert('Artifact saved! Check console for details.');
    },
  },
};

// With Farm Context
export const WithFarmContext = {
  args: {
    artifact: {
      type: ContentTypes.TEXT,
      text: 'This artifact includes farm context information to provide more context about the displayed data.',
    },
    attachments: [],
    farmContext: {
      currentField: {
        id: 'field-b',
        name: 'West Soybean Field',
        cropType: 'Soybeans',
        size: 30,
      },
      benchmarks: {
        highYield: 60,
        lowYield: 40,
      },
      moistureTargets: {
        optimal: 40,
        minimum: 25,
        maximum: 50,
      },
      season: 'Summer 2023',
    },
  },
}; 