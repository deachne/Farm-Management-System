import React from 'react';
import { User, Settings, LogOut } from 'lucide-react';

import { 
  DropdownMenu, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuLabel
} from './DropdownMenu';

export default {
  title: 'Core/DropdownMenu',
  component: DropdownMenu,
  parameters: {
    docs: {
      description: {
        component: 'Dropdown menu component with multiple options, positioning, and customization. Follows the BizzyPerson design system.',
      },
    },
  },
};

// Define some sample menu items to reuse
const DefaultMenuItems = () => (
  <>
    <DropdownMenuItem>
      <User className="mr-2 h-4 w-4" />
      <span>Profile</span>
    </DropdownMenuItem>
    <DropdownMenuItem>
      <Settings className="mr-2 h-4 w-4" />
      <span>Settings</span>
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem destructive>
      <LogOut className="mr-2 h-4 w-4" />
      <span>Logout</span>
    </DropdownMenuItem>
  </>
);

// Basic example
export const Default = {
  render: (args) => (
    <DropdownMenu {...args}>
      <DefaultMenuItems />
    </DropdownMenu>
  ),
  args: {
    title: 'Menu',
  },
};

// Variant examples
export const Primary = {
  render: (args) => (
    <DropdownMenu {...args}>
      <DefaultMenuItems />
    </DropdownMenu>
  ),
  args: {
    triggerVariant: 'primary',
    title: 'Primary Menu',
  },
};

export const Secondary = {
  render: (args) => (
    <DropdownMenu {...args}>
      <DefaultMenuItems />
    </DropdownMenu>
  ),
  args: {
    triggerVariant: 'secondary',
    title: 'Secondary Menu',
  },
};

export const Outline = {
  render: (args) => (
    <DropdownMenu {...args}>
      <DefaultMenuItems />
    </DropdownMenu>
  ),
  args: {
    triggerVariant: 'outline',
    title: 'Outline Menu',
  },
};

export const TopRight = {
  render: (args) => (
    <DropdownMenu {...args}>
      <DefaultMenuItems />
    </DropdownMenu>
  ),
  args: {
    position: 'topRight',
    title: 'Top Right',
  },
};

// With labels example
export const WithLabels = {
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuLabel>User</DropdownMenuLabel>
      <DropdownMenuItem>
        <User className="mr-2 h-4 w-4" />
        <span>Profile</span>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Settings className="mr-2 h-4 w-4" />
        <span>Settings</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem destructive>
        <LogOut className="mr-2 h-4 w-4" />
        <span>Logout</span>
      </DropdownMenuItem>
    </DropdownMenu>
  ),
  args: {
    title: 'Menu with Labels',
  },
}; 