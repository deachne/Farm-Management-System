import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/Avatar';
import { User } from 'lucide-react';

const meta: Meta<typeof Avatar> = {
  title: 'Core/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

// Basic Avatar with Image
export const WithImage: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://i.pravatar.cc/300" alt="User Avatar" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

// Avatar with Fallback
export const WithFallback: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="/invalid-image-url.jpg" alt="Invalid Image" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

// Avatar with Icon Fallback
export const WithIconFallback: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="/invalid-image-url.jpg" alt="Invalid Image" />
      <AvatarFallback>
        <User className="h-6 w-6" />
      </AvatarFallback>
    </Avatar>
  ),
};

// Avatar Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar className="h-8 w-8">
        <AvatarImage src="https://i.pravatar.cc/300?img=1" alt="Small Avatar" />
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/300?img=2" alt="Medium Avatar" />
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar className="h-14 w-14">
        <AvatarImage src="https://i.pravatar.cc/300?img=3" alt="Large Avatar" />
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
      <Avatar className="h-20 w-20">
        <AvatarImage src="https://i.pravatar.cc/300?img=4" alt="Extra Large Avatar" />
        <AvatarFallback>XL</AvatarFallback>
      </Avatar>
    </div>
  ),
};

// Styled Avatars
export const StyledAvatars: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar className="border-2 border-green-500">
        <AvatarImage src="https://i.pravatar.cc/300?img=5" alt="Green Border Avatar" />
        <AvatarFallback>GB</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-blue-500">
        <AvatarImage src="https://i.pravatar.cc/300?img=6" alt="Blue Border Avatar" />
        <AvatarFallback>BB</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-amber-500">
        <AvatarImage src="https://i.pravatar.cc/300?img=7" alt="Amber Border Avatar" />
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
      <Avatar className="ring-2 ring-red-500 ring-offset-2">
        <AvatarImage src="https://i.pravatar.cc/300?img=8" alt="Ring Avatar" />
        <AvatarFallback>RB</AvatarFallback>
      </Avatar>
    </div>
  ),
};

// Farm Team Members
export const FarmTeamMembers: Story = {
  render: () => (
    <div className="border rounded-md p-4 max-w-[400px]">
      <h3 className="text-lg font-medium mb-3">Farm Team</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="https://i.pravatar.cc/300?img=10" alt="Farm Owner" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">John Deere</p>
            <p className="text-sm text-theme-text-secondary">Farm Owner</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="https://i.pravatar.cc/300?img=20" alt="Field Manager" />
            <AvatarFallback>SM</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">Sarah Miller</p>
            <p className="text-sm text-theme-text-secondary">Field Manager</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="https://i.pravatar.cc/300?img=30" alt="Equipment Specialist" />
            <AvatarFallback>RJ</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">Robert Johnson</p>
            <p className="text-sm text-theme-text-secondary">Equipment Specialist</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="https://i.pravatar.cc/300?img=40" alt="Crop Advisor" />
            <AvatarFallback>LP</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">Lisa Parker</p>
            <p className="text-sm text-theme-text-secondary">Crop Advisor</p>
          </div>
        </div>
      </div>
    </div>
  ),
};

// Farm Activity Log
export const FarmActivityLog: Story = {
  render: () => (
    <div className="border rounded-md p-4 max-w-[450px]">
      <h3 className="text-lg font-medium mb-3">Recent Activity</h3>
      <div className="space-y-4">
        <div className="flex gap-3">
          <Avatar className="h-8 w-8 mt-1">
            <AvatarImage src="https://i.pravatar.cc/300?img=10" alt="John Deere" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">John Deere</p>
            <p className="text-sm">Applied fertilizer to North 40 field</p>
            <p className="text-xs text-theme-text-secondary">Today, 9:15 AM</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Avatar className="h-8 w-8 mt-1">
            <AvatarImage src="https://i.pravatar.cc/300?img=20" alt="Sarah Miller" />
            <AvatarFallback>SM</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">Sarah Miller</p>
            <p className="text-sm">Updated irrigation schedule for South Pasture</p>
            <p className="text-xs text-theme-text-secondary">Yesterday, 4:30 PM</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Avatar className="h-8 w-8 mt-1">
            <AvatarImage src="https://i.pravatar.cc/300?img=30" alt="Robert Johnson" />
            <AvatarFallback>RJ</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">Robert Johnson</p>
            <p className="text-sm">Completed maintenance on the John Deere tractor</p>
            <p className="text-xs text-theme-text-secondary">Yesterday, 2:15 PM</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Avatar className="h-8 w-8 mt-1">
            <AvatarImage src="https://i.pravatar.cc/300?img=40" alt="Lisa Parker" />
            <AvatarFallback>LP</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">Lisa Parker</p>
            <p className="text-sm">Added notes about pest sighting in West Orchard</p>
            <p className="text-xs text-theme-text-secondary">June 20, 10:45 AM</p>
          </div>
        </div>
      </div>
    </div>
  ),
}; 