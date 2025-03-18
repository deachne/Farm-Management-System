import type { Meta, StoryObj } from '@storybook/react';
import SoilDataVisualizer from '../index';
import { SoilSample } from '../types';

const meta: Meta<typeof SoilDataVisualizer> = {
  title: 'Agriculture/SoilDataVisualizer',
  component: SoilDataVisualizer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SoilDataVisualizer>;

// Generate a random sample data set for demonstration
const generateMockSamples = (count: number): SoilSample[] => {
  const fields = [
    { id: 'field1', name: 'North Field' },
    { id: 'field2', name: 'South Field' },
    { id: 'field3', name: 'East Field' },
    { id: 'field4', name: 'West Field' },
  ];

  const samples: SoilSample[] = [];
  
  for (let i = 0; i < count; i++) {
    const fieldIndex = i % fields.length;
    const field = fields[fieldIndex];
    
    // Generate a random date within the last 30 days
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    // Generate random soil data
    samples.push({
      id: `sample-${i + 1}`,
      fieldId: field.id,
      fieldName: field.name,
      sampleDate: date.toISOString(),
      location: {
        lat: 40 + Math.random() * 10,
        lng: -90 + Math.random() * 10,
      },
      depth: Math.floor(Math.random() * 12) + 4, // 4-16 inches
      ph: 5 + Math.random() * 4, // 5-9 pH
      organicMatter: Math.random() * 5, // 0-5%
      moisture: 10 + Math.random() * 40, // 10-50%
      temperature: 50 + Math.random() * 30, // 50-80°F
      nutrients: {
        nitrogen: Math.floor(Math.random() * 80) + 10, // 10-90 ppm
        phosphorus: Math.floor(Math.random() * 80) + 10, // 10-90 ppm
        potassium: Math.floor(Math.random() * 200) + 100, // 100-300 ppm
        calcium: Math.floor(Math.random() * 1000) + 500, // 500-1500 ppm
        magnesium: Math.floor(Math.random() * 200) + 50, // 50-250 ppm
        sulfur: Math.floor(Math.random() * 30) + 5, // 5-35 ppm
      },
      cec: Math.random() * 20 + 5, // 5-25 CEC
      texture: {
        sand: Math.random() * 100,
        silt: Math.random() * 100,
        clay: Math.random() * 100,
      }
    });
  }
  
  // Normalize texture percentages to sum to 100
  samples.forEach(sample => {
    if (sample.texture) {
      const total = sample.texture.sand + sample.texture.silt + sample.texture.clay;
      sample.texture.sand = Math.round(sample.texture.sand / total * 100);
      sample.texture.silt = Math.round(sample.texture.silt / total * 100);
      sample.texture.clay = Math.round(100 - sample.texture.sand - sample.texture.silt);
    }
  });
  
  return samples;
};

const mockSamples = generateMockSamples(20);

export const Default: Story = {
  args: {
    samples: mockSamples,
    onFieldSelect: (fieldId) => {
      console.log(`Field selected: ${fieldId}`);
    },
    onSampleSelect: (sampleId) => {
      console.log(`Sample selected: ${sampleId}`);
    }
  }
};

export const MapView: Story = {
  args: {
    samples: mockSamples,
    visualizationType: 'map',
    dataType: 'ph'
  }
};

export const ChartView: Story = {
  args: {
    samples: mockSamples,
    visualizationType: 'chart',
    dataType: 'organic-matter'
  }
};

export const TableView: Story = {
  args: {
    samples: mockSamples,
    visualizationType: 'table',
    dataType: 'nitrogen'
  }
};

export const FilteredByField: Story = {
  args: {
    samples: mockSamples,
    selectedField: 'field1',
    dataType: 'potassium'
  }
}; 