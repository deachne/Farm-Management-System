import React from 'react';
import TextArtifact from '../../../bizzy/core/shared/ui/components/artifacts/TextArtifact';

export default {
  title: 'Core/Artifacts/TextArtifact',
  component: TextArtifact,
  parameters: {
    docs: {
      description: {
        component: 'Text artifact component for displaying formatted text content from LibreChat. Provides options for expanding/collapsing, copying, and saving text content.',
      },
    },
  },
  argTypes: {
    textContent: { control: 'text' },
    isExpanded: { control: 'boolean' },
    onSave: { action: 'onSave' }
  },
};

// Default example with simple text
export const Default = {
  args: {
    textContent: 'This is a simple text artifact.',
    isExpanded: true,
  },
};

// Example with farm-related content
export const FarmContent = {
  args: {
    textContent: 'The soil moisture levels in Field A are currently at 35%, which is below the optimal range for corn crops. Consider increasing irrigation to achieve the target moisture level of 45-55% before the upcoming heatwave this weekend.',
    isExpanded: true,
  },
};

// Example with collapsed state
export const Collapsed = {
  args: {
    textContent: 'This text artifact is in collapsed state initially. Click the Expand button to view content.',
    isExpanded: false,
  },
};

// Example with long text content
export const LongText = {
  args: {
    textContent: `# Farm Report: Weekly Status
    
## Field Summary
- **Field A**: Corn, 45 acres, growth stage V6
- **Field B**: Soybeans, 30 acres, growth stage V3
- **Field C**: Wheat, 25 acres, pre-harvest

## Soil Moisture Analysis
Current readings indicate that Field A is maintaining optimal moisture levels between 45-50%, while Field B has dropped to 30-35% after the recent dry spell. Immediate irrigation is recommended for Field B to prevent yield impact.

## Pest Monitoring
Scout reports indicate low presence of corn rootworm in Field A, below economic threshold. Continue monitoring but no immediate action required. Field B shows early signs of soybean aphids, recommend spot treatment in affected areas only.

## Equipment Status
All tractors and irrigation systems are operational. The John Deere 8R needs scheduled maintenance next week before heavy planting operations begin.

## Recommendations
1. Irrigate Field B within next 48 hours
2. Apply spot treatment for aphids in southeast section of Field B
3. Schedule soil testing for Field C post-harvest
4. Prepare fertilizer plan for next rotation

## Weather Forecast
Expecting 0.5" rainfall on Thursday, followed by rising temperatures (85-90°F) over the weekend. Plan fieldwork accordingly.`,
    isExpanded: true,
  },
};

// Example with very long text to test scrolling
export const ScrollableContent = {
  args: {
    textContent: Array(20).fill('This is a paragraph of text that will be repeated to create a long scrollable content area. It contains information about crops, fields, harvest data, and soil measurements. ').join('\n\n'),
    isExpanded: true,
  },
};

// Example with no content
export const EmptyContent = {
  args: {
    textContent: '',
    isExpanded: true,
  },
};

// Example with save handler
export const WithSaveHandler = {
  args: {
    textContent: 'This artifact has a save handler attached. Click the Save button to trigger it.',
    isExpanded: true,
    onSave: (artifactData) => {
      console.log('Saved artifact data:', artifactData);
      alert('Artifact saved! Check console for details.');
    },
  },
}; 