import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Tooltip, TooltipProvider } from '../../components/Tooltip';
import { Button } from '../../components/Button';
import { Info, AlertTriangle, HelpCircle, Leaf, Droplets, Sun } from 'lucide-react';

const meta: Meta<typeof Tooltip> = {
  title: 'Core/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

// Basic Tooltip
export const Basic: Story = {
  args: {
    content: 'This is a tooltip',
    children: <Button variant="outline">Hover me</Button>,
  },
};

// Icon Tooltip
export const WithIcon: Story = {
  args: {
    content: 'Important information about this field',
    children: <Info className="h-4 w-4 text-blue-500 cursor-help" />,
  },
};

// Farm Warning Tooltip
export const Warning: Story = {
  args: {
    content: (
      <div className="max-w-[200px]">
        <div className="font-bold text-amber-500 flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" /> Drought Warning
        </div>
        <p className="text-xs mt-1">
          Water levels are critically low. Conserve water for essential crops only.
        </p>
      </div>
    ),
    children: (
      <Button variant="outline" className="text-amber-500 border-amber-500">
        <AlertTriangle className="h-4 w-4 mr-2" /> Water Alert
      </Button>
    ),
  },
};

// Positioned Tooltips
export const Positioned: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Tooltip content="Tooltip on top" side="top">
        <Button variant="outline" size="sm">Top</Button>
      </Tooltip>
      <Tooltip content="Tooltip on right" side="right">
        <Button variant="outline" size="sm">Right</Button>
      </Tooltip>
      <Tooltip content="Tooltip on bottom" side="bottom">
        <Button variant="outline" size="sm">Bottom</Button>
      </Tooltip>
      <Tooltip content="Tooltip on left" side="left">
        <Button variant="outline" size="sm">Left</Button>
      </Tooltip>
    </div>
  ),
};

// Field Management Tooltips
export const FieldManagement: Story = {
  render: () => (
    <div className="p-4 border rounded-md">
      <h3 className="text-lg font-medium mb-4">North 40 Field Status</h3>
      <div className="flex gap-6">
        <Tooltip
          content={
            <div className="max-w-[180px]">
              <p className="font-semibold">Soil Moisture</p>
              <p className="text-xs">Current level: 32%</p>
              <p className="text-xs text-green-500">Optimal range: 30-40%</p>
            </div>
          }
        >
          <div className="flex flex-col items-center gap-1 cursor-help">
            <Droplets className="h-6 w-6 text-blue-500" />
            <span className="text-xs">32%</span>
          </div>
        </Tooltip>

        <Tooltip
          content={
            <div className="max-w-[180px]">
              <p className="font-semibold">Crop Health</p>
              <p className="text-xs">Status: Good</p>
              <p className="text-xs">Last inspection: 2 days ago</p>
              <p className="text-xs text-amber-500">Minor aphid presence detected</p>
            </div>
          }
        >
          <div className="flex flex-col items-center gap-1 cursor-help">
            <Leaf className="h-6 w-6 text-green-500" />
            <span className="text-xs">Good</span>
          </div>
        </Tooltip>

        <Tooltip
          content={
            <div className="max-w-[180px]">
              <p className="font-semibold">Sunlight Exposure</p>
              <p className="text-xs">Today: 8.5 hours</p>
              <p className="text-xs">Forecast: Full sun for next 3 days</p>
              <p className="text-xs text-green-500">Optimal for current growth stage</p>
            </div>
          }
        >
          <div className="flex flex-col items-center gap-1 cursor-help">
            <Sun className="h-6 w-6 text-amber-400" />
            <span className="text-xs">8.5 hrs</span>
          </div>
        </Tooltip>
      </div>
    </div>
  ),
};

// Help Icon Tooltips
export const HelpIcons: Story = {
  render: () => (
    <div className="space-y-4 max-w-[300px]">
      <div className="flex items-center justify-between">
        <span className="text-sm">Nitrogen Level (N)</span>
        <Tooltip content="Nitrogen is essential for leaf growth and green color in plants">
          <HelpCircle className="h-4 w-4 text-theme-text-secondary cursor-help" />
        </Tooltip>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Phosphorus Level (P)</span>
        <Tooltip content="Phosphorus promotes root development and flowering">
          <HelpCircle className="h-4 w-4 text-theme-text-secondary cursor-help" />
        </Tooltip>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Potassium Level (K)</span>
        <Tooltip content="Potassium improves overall plant health and disease resistance">
          <HelpCircle className="h-4 w-4 text-theme-text-secondary cursor-help" />
        </Tooltip>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm">Organic Matter</span>
        <Tooltip content="Organic matter improves soil structure and water retention">
          <HelpCircle className="h-4 w-4 text-theme-text-secondary cursor-help" />
        </Tooltip>
      </div>
    </div>
  ),
}; 