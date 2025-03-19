import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import StatCard from '../index';
import { Users, FileText, HardDrive, Sprout } from 'lucide-react';

const meta: Meta<typeof StatCard> = {
  title: 'Admin/StatCard',
  component: StatCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof StatCard>;

export const ActiveUsers: Story = {
  args: {
    icon: <Users />,
    value: 24,
    label: 'Active Users',
    change: {
      value: 4,
      type: 'increase',
      period: 'this month',
    },
  },
};

export const Documents: Story = {
  args: {
    icon: <FileText />,
    value: 142,
    label: 'Documents',
    change: {
      value: 23,
      type: 'increase',
      period: 'this week',
    },
  },
};

export const StorageUsed: Story = {
  args: {
    icon: <HardDrive />,
    value: '68%',
    label: 'Storage Used',
    change: {
      value: 5,
      type: 'increase',
      period: 'this month',
    },
  },
};

export const ActiveExtensions: Story = {
  args: {
    icon: <Sprout />,
    value: 3,
    label: 'Active Extensions',
    change: {
      value: 0,
      type: 'no-change',
    },
  },
};
