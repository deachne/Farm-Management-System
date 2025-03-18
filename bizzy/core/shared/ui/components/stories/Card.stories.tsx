import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { MoreHorizontal, User, Calendar, Settings } from 'lucide-react';

import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from '../Card';
import { Button } from '../Button';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'filled'],
      description: 'The visual style of the card',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    clickable: {
      control: 'boolean',
      description: 'Whether the card is clickable, adding hover effects',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: 'Card component for containing related content with various layouts. Follows the BizzyPerson design system.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

// Base story
export const Default: Story = {
  args: {
    children: <div className="p-6">Basic Card Content</div>,
    variant: 'default',
  },
};

// Variant examples
export const DefaultVariant: Story = {
  args: {
    variant: 'default',
    children: <div className="p-6">Default Card</div>,
  },
};

export const OutlineVariant: Story = {
  args: {
    variant: 'outline',
    children: <div className="p-6">Outline Card</div>,
  },
};

export const FilledVariant: Story = {
  args: {
    variant: 'filled',
    children: <div className="p-6">Filled Card</div>,
  },
};

export const ClickableCard: Story = {
  args: {
    clickable: true,
    children: <div className="p-6">Click me! I have hover effects.</div>,
  },
};

// Component combination examples
export const WithHeader: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content area</p>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card>
      <CardContent>
        <p>Card content area</p>
      </CardContent>
      <CardFooter>
        <p>Card footer</p>
      </CardFooter>
    </Card>
  ),
};

export const Complete: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the main content of the card. It can contain any elements, including text, images, or other components.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">Cancel</Button>
        <Button size="sm">Save</Button>
      </CardFooter>
    </Card>
  ),
};

// Real-world examples
export const ProfileCard: Story = {
  render: () => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <CardTitle>John Doe</CardTitle>
          <CardDescription>Farm Manager</CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Menu</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2 opacity-70" />
            <span>john.doe@example.com</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 opacity-70" />
            <span>Member since January 2023</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" fullWidth>
          <Settings className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const TaskCard: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Field Inspection</CardTitle>
          <div className="rounded-full bg-theme-status-warning px-2 py-1 text-xs">Due Today</div>
        </div>
        <CardDescription>North Field - Corn Section</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">Check for signs of pest damage and assess irrigation needs for the north corn field.</p>
        <div className="mt-4">
          <div className="bg-theme-bg-secondary h-2 rounded-full">
            <div className="bg-theme-accent-primary h-2 rounded-full" style={{ width: '60%' }}></div>
          </div>
          <div className="mt-2 text-xs text-theme-text-secondary">2 of 4 tasks completed</div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" size="sm">Postpone</Button>
        <Button variant="primary" size="sm">Start Task</Button>
      </CardFooter>
    </Card>
  ),
};

// Multiple cards showcase
export const CardVariantShowcase: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card variant="default">
        <CardHeader>
          <CardTitle>Default Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This card uses the default variant.</p>
        </CardContent>
      </Card>
      
      <Card variant="outline">
        <CardHeader>
          <CardTitle>Outline Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This card uses the outline variant.</p>
        </CardContent>
      </Card>
      
      <Card variant="filled">
        <CardHeader>
          <CardTitle>Filled Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This card uses the filled variant.</p>
        </CardContent>
      </Card>
      
      <Card clickable>
        <CardHeader>
          <CardTitle>Clickable Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This card has clickable styling.</p>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A showcase of all card variants together.',
      },
    },
  },
}; 