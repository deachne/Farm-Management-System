import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../components/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/Dialog';

const meta: Meta<typeof Dialog> = {
  title: 'Core/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    children: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

// Basic Dialog
export const Basic: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <Button variant="primary">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Basic Dialog</DialogTitle>
          <DialogDescription>
            This is a basic dialog with minimal content. It can be used for simple confirmations.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>Dialog content goes here.</p>
        </div>
      </DialogContent>
    </Dialog>
  ),
};

// Farm Alert Dialog
export const FarmAlert: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <Button variant="destructive">Weather Alert</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Weather Warning</DialogTitle>
          <DialogDescription>
            Severe weather alert has been issued for your farm area.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-2">
          <p className="text-red-500 font-medium">Heavy rain expected in the next 24 hours</p>
          <p>Predicted rainfall: 3.5 inches</p>
          <p>Wind speeds up to 45 mph</p>
          <p>Potential for localized flooding in low-lying fields</p>
        </div>
        <DialogFooter>
          <Button variant="outline">Dismiss</Button>
          <Button variant="primary">View Detailed Forecast</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// Form in Dialog
export const FormDialog: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <Button>Add Field Record</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>New Field Observation</DialogTitle>
          <DialogDescription>
            Record a new observation for your field. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="field" className="text-right">
              Field
            </label>
            <select
              id="field"
              className="col-span-3 h-10 rounded-md border border-theme-sidebar-border px-3"
              defaultValue="north-40"
            >
              <option value="north-40">North 40</option>
              <option value="south-pasture">South Pasture</option>
              <option value="east-field">East Field</option>
              <option value="west-orchard">West Orchard</option>
            </select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="type" className="text-right">
              Type
            </label>
            <select
              id="type"
              className="col-span-3 h-10 rounded-md border border-theme-sidebar-border px-3"
              defaultValue="pest"
            >
              <option value="pest">Pest Sighting</option>
              <option value="disease">Disease</option>
              <option value="nutrient">Nutrient Deficiency</option>
              <option value="growth">Growth Stage</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="notes" className="text-right">
              Notes
            </label>
            <textarea
              id="notes"
              className="col-span-3 h-20 rounded-md border border-theme-sidebar-border p-3"
              placeholder="Describe what you observed..."
              defaultValue="Noticed aphids on corn leaves in the northwest corner of the field. Approximately 20% of plants affected."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button type="submit">Save Observation</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// Confirmation Dialog
export const ConfirmationDialog: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Record</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this crop record? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="rounded-md bg-amber-50 p-4 border border-amber-200">
            <h4 className="font-medium text-amber-800">Record Details:</h4>
            <p className="text-amber-700 mt-1">Corn - North 40 Field</p>
            <p className="text-amber-700">Planted: May 15, 2023</p>
            <p className="text-amber-700">Variety: Sweet Corn - Silver Queen</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive">Delete Record</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// No Close Button Dialog
export const NoCloseButton: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <Button variant="primary">Critical Alert</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Pesticide Application Required</DialogTitle>
          <DialogDescription>
            Immediate action needed for your wheat field.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-red-500 font-medium">Infestation Level: Severe</p>
          <p>Recommended treatment: Organic pesticide application within 48 hours</p>
          <p>Please review and acknowledge this alert.</p>
        </div>
        <DialogFooter>
          <Button>Acknowledge and Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}; 