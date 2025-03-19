import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import SystemStatus from '../index';

const meta: Meta<typeof SystemStatus> = {
  title: 'Admin/SystemStatus',
  component: SystemStatus,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SystemStatus>;

export const AllHealthy: Story = {
  args: {
    isOperational: true,
    lastUpdated: '2 minutes ago',
    services: [
      { name: 'API Server', status: 'healthy' },
      { name: 'Database', status: 'healthy' },
      { name: 'Vector Store', status: 'healthy' },
      { name: 'Chat Server', status: 'healthy' },
      { name: 'File Storage', status: 'healthy' },
    ],
    incidents: [],
  },
};

export const WithWarnings: Story = {
  args: {
    isOperational: true,
    lastUpdated: '5 minutes ago',
    services: [
      { name: 'API Server', status: 'healthy' },
      { name: 'Database', status: 'healthy' },
      { name: 'Vector Store', status: 'healthy' },
      { name: 'Chat Server', status: 'healthy' },
      { name: 'File Storage', status: 'warning' },
    ],
    incidents: [],
  },
};

export const WithIncidents: Story = {
  args: {
    isOperational: false,
    lastUpdated: '10 minutes ago',
    services: [
      { name: 'API Server', status: 'healthy' },
      { name: 'Database', status: 'error' },
      { name: 'Vector Store', status: 'healthy' },
      { name: 'Chat Server', status: 'warning' },
      { name: 'File Storage', status: 'healthy' },
    ],
    incidents: [
      {
        id: '1',
        title: 'Database Connection Issues',
        timestamp: '2023-04-15 14:32',
        status: 'ongoing',
        severity: 'high',
        description: 'We are experiencing issues with database connections. Our team is investigating.',
      },
      {
        id: '2',
        title: 'High CPU Usage on Chat Servers',
        timestamp: '2023-04-15 13:45',
        status: 'ongoing',
        severity: 'medium',
      },
    ],
  },
};
