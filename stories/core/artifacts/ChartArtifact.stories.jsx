import React from 'react';
import ChartArtifact from '../../../bizzy/core/shared/ui/components/artifacts/ChartArtifact';

export default {
  title: 'Core/Artifacts/ChartArtifact',
  component: ChartArtifact,
  parameters: {
    docs: {
      description: {
        component: 'Chart artifact component for displaying various chart types from LibreChat. Supports different chart types, legends, and interactive features.',
      },
    },
  },
  argTypes: {
    chartData: { control: 'object' },
    chartType: { control: 'select', options: ['bar', 'line', 'pie', 'scatter', 'area'] },
    title: { control: 'text' },
    isExpanded: { control: 'boolean' },
    onSave: { action: 'onSave' },
  },
};

// Basic Bar Chart Example
export const BarChart = {
  args: {
    chartData: {
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
    chartType: 'bar',
    title: 'Crop Yield Comparison',
    isExpanded: true,
  },
};

// Multi-Series Bar Chart
export const MultiSeriesBarChart = {
  args: {
    chartData: {
      labels: ['Field A', 'Field B', 'Field C', 'Field D'],
      datasets: [
        {
          label: '2021 Yield',
          data: [165, 50, 62, 70],
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
        {
          label: '2022 Yield',
          data: [175, 52, 60, 75],
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: '2023 Yield (Projected)',
          data: [180, 55, 65, 80],
          backgroundColor: 'rgba(153, 102, 255, 0.5)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
        },
      ],
    },
    chartType: 'bar',
    title: 'Yearly Yield Comparison by Field',
    isExpanded: true,
  },
};

// Line Chart Example
export const LineChart = {
  args: {
    chartData: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Average Temperature (°F)',
          data: [32, 35, 45, 55, 65, 75, 80, 78, 70, 60, 48, 35],
          fill: false,
          borderColor: 'rgba(255, 99, 132, 1)',
          tension: 0.1,
        },
        {
          label: 'Soil Temperature (°F)',
          data: [28, 30, 38, 48, 58, 68, 75, 74, 65, 55, 42, 30],
          fill: false,
          borderColor: 'rgba(54, 162, 235, 1)',
          tension: 0.1,
        },
      ],
    },
    chartType: 'line',
    title: 'Annual Temperature Trends',
    isExpanded: true,
  },
};

// Pie Chart Example
export const PieChart = {
  args: {
    chartData: {
      labels: ['Corn', 'Soybeans', 'Wheat', 'Alfalfa', 'Other'],
      datasets: [
        {
          data: [45, 30, 15, 8, 2],
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
    chartType: 'pie',
    title: 'Farm Acreage Distribution by Crop',
    isExpanded: true,
  },
};

// Area Chart Example
export const AreaChart = {
  args: {
    chartData: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
      datasets: [
        {
          label: 'Corn Growth (inches)',
          data: [3, 7, 12, 18, 24, 32, 40, 48],
          fill: true,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.4,
        },
      ],
    },
    chartType: 'line', // Using line type with fill for area chart
    title: 'Corn Growth Progress',
    isExpanded: true,
  },
};

// Scatter Chart Example
export const ScatterChart = {
  args: {
    chartData: {
      datasets: [
        {
          label: 'Yield vs. Rainfall',
          data: [
            { x: 15, y: 150 },
            { x: 18, y: 165 },
            { x: 22, y: 175 },
            { x: 25, y: 180 },
            { x: 30, y: 185 },
            { x: 35, y: 175 },
            { x: 40, y: 165 },
          ],
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          pointRadius: 6,
        },
      ],
    },
    chartType: 'scatter',
    title: 'Corn Yield vs. Rainfall Correlation',
    isExpanded: true,
  },
};

// Collapsed Chart Example
export const Collapsed = {
  args: {
    chartData: {
      labels: ['Field A', 'Field B', 'Field C', 'Field D', 'Field E'],
      datasets: [
        {
          label: 'Soil Moisture (%)',
          data: [35, 42, 28, 45, 30],
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    },
    chartType: 'bar',
    title: 'Current Soil Moisture by Field',
    isExpanded: false,
  },
};

// With Save Handler
export const WithSaveHandler = {
  args: {
    chartData: {
      labels: ['Field A', 'Field B', 'Field C', 'Field D'],
      datasets: [
        {
          label: 'Irrigation Needs (gallons)',
          data: [12500, 8200, 14000, 7000],
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    },
    chartType: 'bar',
    title: 'Irrigation Requirements by Field',
    isExpanded: true,
    onSave: (artifactData) => {
      console.log('Saved chart artifact data:', artifactData);
      alert('Chart artifact saved! Check console for details.');
    },
  },
}; 