import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Core/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    defaultValue: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

// Basic Tabs
export const Basic: Story = {
  render: (args) => (
    <Tabs defaultValue="account" className="w-[400px]" {...args}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="p-4 border rounded-md mt-2">
        <h3 className="text-lg font-medium">Account Settings</h3>
        <p className="text-sm text-theme-text-secondary mt-1">
          Manage your account settings and preferences.
        </p>
      </TabsContent>
      <TabsContent value="password" className="p-4 border rounded-md mt-2">
        <h3 className="text-lg font-medium">Change Password</h3>
        <p className="text-sm text-theme-text-secondary mt-1">
          Update your password to maintain security.
        </p>
      </TabsContent>
    </Tabs>
  ),
};

// Farm Management Tabs
export const FarmManagement: Story = {
  render: (args) => (
    <Tabs defaultValue="fields" className="w-[600px]" {...args}>
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="fields">Fields</TabsTrigger>
        <TabsTrigger value="crops">Crops</TabsTrigger>
        <TabsTrigger value="equipment">Equipment</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>
      <TabsContent value="fields" className="p-4 border rounded-md mt-2">
        <h3 className="text-lg font-medium">Field Management</h3>
        <div className="mt-4">
          <div className="space-y-2">
            <div className="flex justify-between p-2 bg-theme-bg-secondary rounded">
              <span>North 40</span>
              <span className="text-green-600">Active</span>
            </div>
            <div className="flex justify-between p-2 bg-theme-bg-secondary rounded">
              <span>South Pasture</span>
              <span className="text-green-600">Active</span>
            </div>
            <div className="flex justify-between p-2 bg-theme-bg-secondary rounded">
              <span>West Orchard</span>
              <span className="text-amber-600">Fallow</span>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="crops" className="p-4 border rounded-md mt-2">
        <h3 className="text-lg font-medium">Crop Management</h3>
        <div className="mt-4">
          <div className="space-y-2">
            <div className="flex justify-between p-2 bg-theme-bg-secondary rounded">
              <span>Corn (Silver Queen)</span>
              <span className="text-green-600">Growing</span>
            </div>
            <div className="flex justify-between p-2 bg-theme-bg-secondary rounded">
              <span>Soybeans (Pioneer 94B73)</span>
              <span className="text-blue-600">Planned</span>
            </div>
            <div className="flex justify-between p-2 bg-theme-bg-secondary rounded">
              <span>Winter Wheat</span>
              <span className="text-amber-600">Harvested</span>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="equipment" className="p-4 border rounded-md mt-2">
        <h3 className="text-lg font-medium">Equipment Management</h3>
        <div className="mt-4">
          <div className="space-y-2">
            <div className="flex justify-between p-2 bg-theme-bg-secondary rounded">
              <span>John Deere 8R Tractor</span>
              <span className="text-green-600">Available</span>
            </div>
            <div className="flex justify-between p-2 bg-theme-bg-secondary rounded">
              <span>Sprayer (Boom 60ft)</span>
              <span className="text-red-600">Maintenance</span>
            </div>
            <div className="flex justify-between p-2 bg-theme-bg-secondary rounded">
              <span>Combine Harvester</span>
              <span className="text-amber-600">In Use</span>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="analytics" className="p-4 border rounded-md mt-2">
        <h3 className="text-lg font-medium">Farm Analytics</h3>
        <div className="mt-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-theme-bg-secondary rounded">
              <p className="text-sm font-medium">Total Acres</p>
              <p className="text-2xl font-bold">450</p>
            </div>
            <div className="p-3 bg-theme-bg-secondary rounded">
              <p className="text-sm font-medium">Active Crops</p>
              <p className="text-2xl font-bold">3</p>
            </div>
            <div className="p-3 bg-theme-bg-secondary rounded">
              <p className="text-sm font-medium">Expected Yield</p>
              <p className="text-2xl font-bold">1,240 tons</p>
            </div>
            <div className="p-3 bg-theme-bg-secondary rounded">
              <p className="text-sm font-medium">Expenses YTD</p>
              <p className="text-2xl font-bold">$124,850</p>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

// Vertical Tabs
export const VerticalTabs: Story = {
  render: (args) => (
    <Tabs defaultValue="soil" orientation="vertical" className="w-[600px]" {...args}>
      <div className="flex">
        <TabsList className="flex-col h-auto mr-4 space-y-1 bg-transparent">
          <TabsTrigger value="soil" className="justify-start">Soil Analysis</TabsTrigger>
          <TabsTrigger value="water" className="justify-start">Water Management</TabsTrigger>
          <TabsTrigger value="fertilizer" className="justify-start">Fertilizer Plan</TabsTrigger>
        </TabsList>
        <div className="flex-1">
          <TabsContent value="soil" className="p-4 border rounded-md">
            <h3 className="text-lg font-medium">Soil Analysis Results</h3>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between">
                <span>pH Level:</span>
                <span className="font-medium">6.8</span>
              </div>
              <div className="flex justify-between">
                <span>Nitrogen (N):</span>
                <span className="font-medium text-amber-600">Low (12 ppm)</span>
              </div>
              <div className="flex justify-between">
                <span>Phosphorus (P):</span>
                <span className="font-medium text-green-600">Adequate (34 ppm)</span>
              </div>
              <div className="flex justify-between">
                <span>Potassium (K):</span>
                <span className="font-medium text-green-600">Adequate (125 ppm)</span>
              </div>
              <div className="flex justify-between">
                <span>Organic Matter:</span>
                <span className="font-medium">3.2%</span>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="water" className="p-4 border rounded-md">
            <h3 className="text-lg font-medium">Water Management Plan</h3>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between">
                <span>Current Soil Moisture:</span>
                <span className="font-medium">32%</span>
              </div>
              <div className="flex justify-between">
                <span>Irrigation Schedule:</span>
                <span className="font-medium">Every 3 days</span>
              </div>
              <div className="flex justify-between">
                <span>Water Source:</span>
                <span className="font-medium">Well #2</span>
              </div>
              <div className="flex justify-between">
                <span>Last Irrigation:</span>
                <span className="font-medium">June 12, 2023</span>
              </div>
              <div className="flex justify-between">
                <span>Water Quality:</span>
                <span className="font-medium text-green-600">Good</span>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="fertilizer" className="p-4 border rounded-md">
            <h3 className="text-lg font-medium">Fertilizer Application Plan</h3>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between">
                <span>Recommended N-P-K:</span>
                <span className="font-medium">120-60-40</span>
              </div>
              <div className="flex justify-between">
                <span>Application Method:</span>
                <span className="font-medium">Side-dressing</span>
              </div>
              <div className="flex justify-between">
                <span>Next Application:</span>
                <span className="font-medium">July 5, 2023</span>
              </div>
              <div className="flex justify-between">
                <span>Coverage:</span>
                <span className="font-medium">North 40 Field</span>
              </div>
              <div className="flex justify-between">
                <span>Special Instructions:</span>
                <span className="font-medium text-amber-600">Apply after rainfall</span>
              </div>
            </div>
          </TabsContent>
        </div>
      </div>
    </Tabs>
  ),
};

// Disabled Tabs
export const DisabledTabs: Story = {
  render: (args) => (
    <Tabs defaultValue="active" className="w-[400px]" {...args}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="archived">Archived</TabsTrigger>
        <TabsTrigger value="advanced" disabled>Advanced</TabsTrigger>
      </TabsList>
      <TabsContent value="active" className="p-4 border rounded-md mt-2">
        <h3 className="text-lg font-medium">Active Field Operations</h3>
        <p className="text-sm text-theme-text-secondary mt-1">
          View and manage your current field operations.
        </p>
        <ul className="mt-2 space-y-1">
          <li>Fertilizer application - North 40</li>
          <li>Irrigation - South Pasture</li>
          <li>Pest monitoring - All fields</li>
        </ul>
      </TabsContent>
      <TabsContent value="archived" className="p-4 border rounded-md mt-2">
        <h3 className="text-lg font-medium">Archived Operations</h3>
        <p className="text-sm text-theme-text-secondary mt-1">
          Historical records of completed field operations.
        </p>
        <ul className="mt-2 space-y-1">
          <li>Spring planting - May 2023</li>
          <li>Fall harvest - October 2022</li>
          <li>Field tilling - April 2023</li>
        </ul>
      </TabsContent>
      <TabsContent value="advanced" className="p-4 border rounded-md mt-2">
        <h3 className="text-lg font-medium">Advanced Settings</h3>
        <p className="text-sm text-theme-text-secondary mt-1">
          Configure advanced settings for your farm operations.
        </p>
        <p className="mt-2 text-amber-600">
          This feature requires a premium subscription.
        </p>
      </TabsContent>
    </Tabs>
  ),
}; 