import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../../components/Badge';

const meta: Meta<typeof Badge> = {
  title: 'Core/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'secondary',
        'destructive',
        'outline',
        'success',
        'warning',
        'danger',
        'info',
        'crop',
        'field',
        'equipment',
        'weather',
        'pest',
        'soil',
      ],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

// Basic Badge
export const Default: Story = {
  args: {
    children: 'Badge',
    variant: 'default',
  },
};

// Secondary Badge
export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
};

// Outline Badge
export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
};

// Destructive Badge
export const Destructive: Story = {
  args: {
    children: 'Destructive',
    variant: 'destructive',
  },
};

// Status Badges
export const StatusBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="success">Healthy</Badge>
      <Badge variant="warning">Needs Attention</Badge>
      <Badge variant="danger">Critical</Badge>
      <Badge variant="info">Informational</Badge>
    </div>
  ),
};

// Farm-Specific Badges
export const FarmBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="crop">Corn</Badge>
      <Badge variant="crop">Soybeans</Badge>
      <Badge variant="crop">Wheat</Badge>
      <Badge variant="field">North 40</Badge>
      <Badge variant="field">South Pasture</Badge>
      <Badge variant="equipment">Tractor</Badge>
      <Badge variant="equipment">Harvester</Badge>
      <Badge variant="weather">Rainfall</Badge>
      <Badge variant="pest">Aphids</Badge>
      <Badge variant="soil">Sandy Loam</Badge>
    </div>
  ),
};

// Size Variations
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge size="sm" variant="default">Small</Badge>
      <Badge size="default" variant="default">Default</Badge>
      <Badge size="lg" variant="default">Large</Badge>
    </div>
  ),
};

// Field Status Dashboard
export const FieldStatusDashboard: Story = {
  render: () => (
    <div className="border rounded-md p-4 max-w-[400px]">
      <h3 className="text-lg font-medium mb-3">Field Status Dashboard</h3>
      <div className="space-y-2">
        <div className="flex justify-between items-center py-2 border-b">
          <span>North 40</span>
          <div className="flex gap-1">
            <Badge variant="crop" size="sm">Corn</Badge>
            <Badge variant="success" size="sm">Healthy</Badge>
          </div>
        </div>
        <div className="flex justify-between items-center py-2 border-b">
          <span>South Pasture</span>
          <div className="flex gap-1">
            <Badge variant="crop" size="sm">Soybeans</Badge>
            <Badge variant="warning" size="sm">Irrigation Needed</Badge>
          </div>
        </div>
        <div className="flex justify-between items-center py-2 border-b">
          <span>West Orchard</span>
          <div className="flex gap-1">
            <Badge variant="crop" size="sm">Apples</Badge>
            <Badge variant="pest" size="sm">Pest Issue</Badge>
          </div>
        </div>
        <div className="flex justify-between items-center py-2 border-b">
          <span>East Field</span>
          <div className="flex gap-1">
            <Badge variant="crop" size="sm">Wheat</Badge>
            <Badge variant="success" size="sm">Ready to Harvest</Badge>
          </div>
        </div>
      </div>
    </div>
  ),
};

// Equipment Status
export const EquipmentStatus: Story = {
  render: () => (
    <div className="border rounded-md p-4 max-w-[400px]">
      <h3 className="text-lg font-medium mb-3">Equipment Status</h3>
      <div className="space-y-2">
        <div className="flex justify-between items-center py-2 border-b">
          <span>John Deere 8R Tractor</span>
          <div className="flex gap-1">
            <Badge variant="success" size="sm">Available</Badge>
          </div>
        </div>
        <div className="flex justify-between items-center py-2 border-b">
          <span>Case IH Combine</span>
          <div className="flex gap-1">
            <Badge variant="info" size="sm">In Use</Badge>
          </div>
        </div>
        <div className="flex justify-between items-center py-2 border-b">
          <span>Sprayer (60ft)</span>
          <div className="flex gap-1">
            <Badge variant="danger" size="sm">Maintenance</Badge>
          </div>
        </div>
        <div className="flex justify-between items-center py-2 border-b">
          <span>Planter (16 Row)</span>
          <div className="flex gap-1">
            <Badge variant="warning" size="sm">Needs Inspection</Badge>
          </div>
        </div>
      </div>
    </div>
  ),
};

// Weather Alerts
export const WeatherAlerts: Story = {
  render: () => (
    <div className="border rounded-md p-4 max-w-[400px]">
      <h3 className="text-lg font-medium mb-3">Weather Alerts</h3>
      <div className="space-y-2">
        <div className="flex justify-between items-center py-2 border-b">
          <span>Today</span>
          <div className="flex gap-1">
            <Badge variant="weather" size="sm">Sunny</Badge>
            <Badge variant="success" size="sm">Perfect for Spraying</Badge>
          </div>
        </div>
        <div className="flex justify-between items-center py-2 border-b">
          <span>Tomorrow</span>
          <div className="flex gap-1">
            <Badge variant="weather" size="sm">Light Rain</Badge>
            <Badge variant="info" size="sm">Good for Crops</Badge>
          </div>
        </div>
        <div className="flex justify-between items-center py-2 border-b">
          <span>Thursday</span>
          <div className="flex gap-1">
            <Badge variant="weather" size="sm">Heavy Rain</Badge>
            <Badge variant="warning" size="sm">Delay Harvesting</Badge>
          </div>
        </div>
        <div className="flex justify-between items-center py-2 border-b">
          <span>Friday</span>
          <div className="flex gap-1">
            <Badge variant="weather" size="sm">High Winds</Badge>
            <Badge variant="danger" size="sm">Secure Equipment</Badge>
          </div>
        </div>
      </div>
    </div>
  ),
}; 