import type { Meta, StoryObj } from '@storybook/react';
import FieldMap from '../index';
import { Field } from '../types';

const meta: Meta<typeof FieldMap> = {
  title: 'Agriculture/FieldMap',
  component: FieldMap,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FieldMap>;

const mockFields: Field[] = [
  {
    id: '1',
    name: 'North Field',
    acres: 150,
    boundaries: {
      type: 'Polygon',
      coordinates: [[[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]]
    },
    currentCrop: {
      name: 'Corn',
      plantingDate: '2024-04-15',
      expectedHarvestDate: '2024-09-15'
    },
    soilType: 'Clay Loam',
    location: {
      lat: 41.8781,
      lng: -87.6298
    }
  },
  {
    id: '2',
    name: 'South Field',
    acres: 200,
    boundaries: {
      type: 'Polygon',
      coordinates: [[[0, 0], [2, 0], [2, 2], [0, 2], [0, 0]]]
    },
    currentCrop: {
      name: 'Soybeans',
      plantingDate: '2024-05-01',
      expectedHarvestDate: '2024-10-01'
    },
    soilType: 'Silt Loam',
    location: {
      lat: 41.8782,
      lng: -87.6299
    }
  }
];

export const Default: Story = {
  args: {
    fields: mockFields,
    selectedFieldId: null,
    onFieldSelect: (fieldId: string) => {
      console.log('Selected field:', fieldId);
    }
  }
};

export const WithSelectedField: Story = {
  args: {
    fields: mockFields,
    selectedFieldId: '1',
    onFieldSelect: (fieldId: string) => {
      console.log('Selected field:', fieldId);
    }
  }
}; 