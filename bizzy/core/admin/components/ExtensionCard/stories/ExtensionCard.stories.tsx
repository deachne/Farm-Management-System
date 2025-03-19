import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import ExtensionCard from '../index';
import { Tractor, BanknoteIcon, Factory } from 'lucide-react';

const meta: Meta<typeof ExtensionCard> = {
  title: 'Admin/ExtensionCard',
  component: ExtensionCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ExtensionCard>;

export const FarmManagement: Story = {
  args: {
    name: 'Farm Management',
    icon: <Tractor className="text-green-500" />,
    version: '1.2.3',
    status: 'active',
    permissions: {
      documentAccess: true,
      searchAccess: true,
      networkAccess: true,
    },
    resources: {
      users: 12,
      storage: '2.3 GB',
    },
  },
};

export const BizzyBank: Story = {
  args: {
    name: 'BizzyBank',
    icon: <BanknoteIcon className="text-yellow-500" />,
    version: '0.9.1',
    status: 'active',
    permissions: {
      documentAccess: true,
      searchAccess: false,
      networkAccess: false,
    },
    resources: {
      users: 5,
      storage: '1.2 GB',
    },
  },
};

export const Manufacturing: Story = {
  args: {
    name: 'Manufacturing',
    icon: <Factory className="text-gray-500" />,
    version: '1.0.0',
    status: 'inactive',
    permissions: {
      documentAccess: true,
      searchAccess: true,
      networkAccess: true,
    },
  },
};
