import { expect } from '@storybook/jest';
import { within, userEvent } from '@storybook/testing-library';
import Button from './Button.jsx';

export default {
  title: 'Core/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'color' },
    onClick: { action: 'clicked' },
    primary: { control: 'boolean' },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'outline', 'ghost'],
    },
  },
};

// Primary button story
export const Primary = {
  args: {
    primary: true,
    label: 'Primary Button',
    size: 'medium',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Find the button
    const button = canvas.getByRole('button', { name: /Primary Button/i });
    
    // Verify button is rendered
    await expect(button).toBeInTheDocument();
    
    // Click the button
    await userEvent.click(button);
    
    // Button should remain in the document after clicking
    await expect(button).toBeInTheDocument();
  },
};

// Secondary button story
export const Secondary = {
  args: {
    label: 'Secondary Button',
    primary: false,
  },
};

// Different sizes
export const Large = {
  args: {
    size: 'large',
    label: 'Large Button',
  },
};

export const Small = {
  args: {
    size: 'small',
    label: 'Small Button',
  },
};

// Variant examples
export const Outline = {
  args: {
    variant: 'outline',
    label: 'Outline Button',
  },
};

export const Ghost = {
  args: {
    variant: 'ghost',
    label: 'Ghost Button',
  },
};

// Disabled state
export const Disabled = {
  args: {
    disabled: true,
    label: 'Disabled Button',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Find the button
    const button = canvas.getByRole('button', { name: /Disabled Button/i });
    
    // Verify button is disabled
    await expect(button).toBeDisabled();
  },
}; 