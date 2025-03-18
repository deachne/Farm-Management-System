import React from 'react';
import TableArtifact from '../../../bizzy/core/shared/ui/components/artifacts/TableArtifact';

export default {
  title: 'Core/Artifacts/TableArtifact',
  component: TableArtifact,
  parameters: {
    docs: {
      description: {
        component: 'Table artifact component for displaying tabular data from LibreChat. Supports sorting, filtering, and saving data.',
      },
    },
  },
  argTypes: {
    tableData: { control: 'object' },
    caption: { control: 'text' },
    isExpanded: { control: 'boolean' },
    onSave: { action: 'onSave' },
  },
};

// Default example with crop data
export const Default = {
  args: {
    tableData: {
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
    isExpanded: true,
  },
};

// Example with soil test data
export const SoilTestData = {
  args: {
    tableData: {
      headers: ['Field', 'pH', 'Nitrogen (ppm)', 'Phosphorus (ppm)', 'Potassium (ppm)', 'Organic Matter (%)'],
      rows: [
        ['North Field', 6.8, 45, 32, 120, 3.5],
        ['South Field', 7.1, 35, 28, 150, 2.8],
        ['West Field', 6.5, 30, 40, 110, 4.0],
        ['East Field', 7.3, 25, 30, 90, 2.2],
        ['Hill Plot', 6.2, 20, 25, 80, 5.1],
      ]
    },
    caption: 'Soil Test Results - Spring 2023',
    isExpanded: true,
  },
};

// Example with equipment maintenance data
export const EquipmentData = {
  args: {
    tableData: {
      headers: ['Equipment ID', 'Type', 'Last Service Date', 'Hours', 'Status', 'Next Service'],
      rows: [
        ['TR-1001', 'Tractor', '2023-04-15', 2450, 'Operational', '2023-07-15'],
        ['PL-2001', 'Planter', '2023-02-20', 560, 'Needs Repair', '2023-08-01'],
        ['SP-3001', 'Sprayer', '2023-05-10', 890, 'Operational', '2023-09-10'],
        ['HV-4001', 'Harvester', '2023-01-05', 1200, 'Operational', '2023-08-20'],
        ['IR-5001', 'Irrigation System', '2023-04-30', 3500, 'Operational', '2023-06-30'],
      ]
    },
    caption: 'Farm Equipment Maintenance Schedule',
    isExpanded: true,
  },
};

// Example with irrigation data
export const IrrigationData = {
  args: {
    tableData: {
      headers: ['Date', 'Field', 'Duration (hrs)', 'Water Used (gal)', 'Soil Moisture Before (%)', 'Soil Moisture After (%)'],
      rows: [
        ['2023-06-01', 'North Field', 4.5, 12500, 30, 45],
        ['2023-06-03', 'South Field', 3.0, 8200, 25, 40],
        ['2023-06-05', 'West Field', 5.0, 14000, 20, 42],
        ['2023-06-07', 'East Field', 2.5, 7000, 28, 44],
        ['2023-06-10', 'North Field', 3.5, 9800, 32, 48],
      ]
    },
    caption: 'Irrigation Schedule and Results - June 2023',
    isExpanded: true,
  },
};

// Example with a large table
export const LargeTable = {
  args: {
    tableData: {
      headers: ['ID', 'Date', 'Field', 'Measurement Type', 'Value', 'Unit', 'Observer'],
      rows: Array(30).fill(0).map((_, i) => [
        `M-${1000 + i}`,
        `2023-06-${(i % 30) + 1}`,
        ['North Field', 'South Field', 'East Field', 'West Field', 'Hill Plot'][i % 5],
        ['Moisture', 'Temperature', 'pH', 'Nitrogen', 'Growth Stage'][i % 5],
        Math.round(Math.random() * 100),
        ['%', '°F', 'pH', 'ppm', 'V'][i % 5],
        ['John', 'Sarah', 'Mike', 'Emily', 'Robert'][i % 5],
      ])
    },
    caption: 'Comprehensive Field Measurements - June 2023',
    isExpanded: true,
  },
};

// Example with collapsed state
export const Collapsed = {
  args: {
    tableData: {
      headers: ['Field', 'Crop', 'Planting Date', 'Expected Harvest'],
      rows: [
        ['North Field', 'Corn', '2023-04-15', '2023-09-30'],
        ['South Field', 'Soybeans', '2023-05-01', '2023-10-15'],
        ['West Field', 'Wheat', '2022-10-10', '2023-07-10'],
      ]
    },
    caption: 'Planting and Harvest Schedule',
    isExpanded: false,
  },
};

// Example with save handler
export const WithSaveHandler = {
  args: {
    tableData: {
      headers: ['Weather Date', 'High Temp (°F)', 'Low Temp (°F)', 'Precipitation (in)', 'Wind (mph)'],
      rows: [
        ['2023-06-10', 82, 65, 0.0, 5],
        ['2023-06-11', 85, 68, 0.25, 8],
        ['2023-06-12', 88, 70, 0.75, 12],
        ['2023-06-13', 91, 72, 0.0, 6],
        ['2023-06-14', 86, 69, 0.1, 7],
      ]
    },
    caption: 'Weather Data - June 2023',
    isExpanded: true,
    onSave: (artifactData) => {
      console.log('Saved table artifact data:', artifactData);
      alert('Table artifact saved! Check console for details.');
    },
  },
}; 