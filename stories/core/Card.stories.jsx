import { expect } from '@storybook/jest';
import { within, userEvent } from '@storybook/testing-library';
import Card from './Card.jsx';
import Button from './Button.jsx';

export default {
  title: 'Core/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'elevated', 'bordered'],
    },
    onClick: { action: 'clicked' },
    interactive: { control: 'boolean' },
  },
};

// Basic card
export const Default = {
  args: {
    title: 'Card Title',
    children: (
      <p style={{ margin: 0 }}>
        This is a simple card component that can be used to display content with a consistent style.
      </p>
    ),
  },
};

// Card with title and subtitle
export const WithSubtitle = {
  args: {
    title: 'Card With Subtitle',
    subtitle: 'Supporting information for this card',
    children: (
      <p style={{ margin: 0 }}>
        Cards can have subtitles to provide additional context about the content.
      </p>
    ),
  },
};

// Card with footer
export const WithFooter = {
  args: {
    title: 'Card With Footer',
    children: (
      <p style={{ margin: 0 }}>
        This card includes a footer section that can contain actions or additional information.
      </p>
    ),
    footer: (
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <Button size="small" label="Cancel" variant="ghost" />
        <Button size="small" label="Save" primary />
      </div>
    ),
  },
};

// Elevated variant
export const Elevated = {
  args: {
    title: 'Elevated Card',
    variant: 'elevated',
    children: (
      <p style={{ margin: 0 }}>
        Elevated cards have a more pronounced shadow to make them stand out.
      </p>
    ),
  },
};

// Bordered variant
export const Bordered = {
  args: {
    title: 'Bordered Card',
    variant: 'bordered',
    children: (
      <p style={{ margin: 0 }}>
        Bordered cards have a border instead of a shadow.
      </p>
    ),
  },
};

// Interactive card
export const Interactive = {
  args: {
    title: 'Interactive Card',
    subtitle: 'Click me!',
    interactive: true,
    children: (
      <p style={{ margin: 0 }}>
        Interactive cards can be clicked and have hover effects.
      </p>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Find the card
    const card = canvas.getByText('Interactive Card').closest('div');
    
    // Verify card is rendered
    await expect(card).toBeInTheDocument();
    
    // Click the card
    await userEvent.click(card);
    
    // Card should remain in the document after clicking
    await expect(card).toBeInTheDocument();
  },
};

// Complex content example
export const ComplexContent = {
  args: {
    title: 'Document Summary',
    subtitle: 'Field analysis report from June 15, 2023',
    children: (
      <div>
        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          marginBottom: '16px',
          fontSize: '14px'
        }}>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Field Information</h4>
            <div>Name: North Field</div>
            <div>Size: 42 acres</div>
            <div>Crop: Corn</div>
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Weather Conditions</h4>
            <div>Temperature: 72°F</div>
            <div>Humidity: 65%</div>
            <div>Wind: 8 mph NW</div>
          </div>
        </div>
        <div style={{ 
          backgroundColor: '#f3f4f6', 
          padding: '12px', 
          borderRadius: '4px',
          fontSize: '14px' 
        }}>
          <strong>Notes:</strong> The corn is showing signs of good growth with no visible pest damage. Soil moisture is adequate, and no irrigation is needed at this time.
        </div>
      </div>
    ),
    footer: (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        fontSize: '12px' 
      }}>
        <span>Created by: John Farmer</span>
        <Button size="small" label="View Details" variant="outline" />
      </div>
    ),
  },
}; 