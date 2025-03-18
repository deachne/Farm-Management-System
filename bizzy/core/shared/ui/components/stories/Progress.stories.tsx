import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Progress } from '../../components/Progress';

const meta: Meta<typeof Progress> = {
  title: 'Core/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
    variant: {
      control: 'select',
      options: ['default', 'success', 'info', 'warning', 'danger'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Progress>;

// Basic Progress
export const Default: Story = {
  args: {
    value: 40,
    className: 'w-[300px]',
  },
};

// Progress Variants
export const Variants: Story = {
  render: () => (
    <div className="w-[300px] space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium">Default</label>
        <Progress value={60} />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Success</label>
        <Progress value={80} variant="success" />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Info</label>
        <Progress value={40} variant="info" />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Warning</label>
        <Progress value={60} variant="warning" />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Danger</label>
        <Progress value={90} variant="danger" />
      </div>
    </div>
  ),
};

// Crop Growth Progress
export const CropGrowth: Story = {
  render: () => (
    <div className="w-[350px] border p-4 rounded-md">
      <h3 className="text-lg font-medium mb-4">Crop Growth Progress</h3>
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Corn (North 40)</label>
            <span className="text-sm text-theme-text-secondary">75%</span>
          </div>
          <Progress value={75} variant="success" />
          <p className="text-xs text-theme-text-secondary">
            Growth Stage: R3 (Milk)
          </p>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Soybeans (South Pasture)</label>
            <span className="text-sm text-theme-text-secondary">45%</span>
          </div>
          <Progress value={45} variant="info" />
          <p className="text-xs text-theme-text-secondary">
            Growth Stage: V6 (Sixth Node)
          </p>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Wheat (East Field)</label>
            <span className="text-sm text-theme-text-secondary">95%</span>
          </div>
          <Progress value={95} variant="warning" />
          <p className="text-xs text-theme-text-secondary">
            Ready for harvest within 5 days
          </p>
        </div>
      </div>
    </div>
  ),
};

// Field Task Progress
export const FieldTasks: Story = {
  render: () => (
    <div className="w-[350px] border p-4 rounded-md">
      <h3 className="text-lg font-medium mb-4">Field Task Progress</h3>
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Fertilizer Application</label>
            <span className="text-sm text-theme-text-secondary">100%</span>
          </div>
          <Progress value={100} variant="success" />
          <p className="text-xs text-theme-text-secondary">
            Completed on June 15, 2023
          </p>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Pest Control</label>
            <span className="text-sm text-theme-text-secondary">60%</span>
          </div>
          <Progress value={60} variant="info" />
          <p className="text-xs text-theme-text-secondary">
            3 of 5 fields treated
          </p>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Irrigation</label>
            <span className="text-sm text-theme-text-secondary">30%</span>
          </div>
          <Progress value={30} variant="warning" />
          <p className="text-xs text-theme-text-secondary">
            System maintenance needed
          </p>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Equipment Maintenance</label>
            <span className="text-sm text-theme-text-secondary">10%</span>
          </div>
          <Progress value={10} variant="danger" />
          <p className="text-xs text-theme-text-secondary">
            Scheduled for next week
          </p>
        </div>
      </div>
    </div>
  ),
};

// Resource Management
export const ResourceManagement: Story = {
  render: () => (
    <div className="w-[350px] border p-4 rounded-md">
      <h3 className="text-lg font-medium mb-4">Resource Management</h3>
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Water Reservoir</label>
            <span className="text-sm text-theme-text-secondary">85%</span>
          </div>
          <Progress value={85} variant="info" />
          <p className="text-xs text-theme-text-secondary">
            42,500 gallons available
          </p>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Soil Moisture</label>
            <span className="text-sm text-theme-text-secondary">55%</span>
          </div>
          <Progress value={55} variant="success" />
          <p className="text-xs text-theme-text-secondary">
            Optimal range 50-60%
          </p>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Fertilizer Storage</label>
            <span className="text-sm text-theme-text-secondary">25%</span>
          </div>
          <Progress value={25} variant="warning" />
          <p className="text-xs text-theme-text-secondary">
            Order more within 2 weeks
          </p>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Fuel Supply</label>
            <span className="text-sm text-theme-text-secondary">15%</span>
          </div>
          <Progress value={15} variant="danger" />
          <p className="text-xs text-theme-text-secondary">
            Delivery scheduled for tomorrow
          </p>
        </div>
      </div>
    </div>
  ),
}; 