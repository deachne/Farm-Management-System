import type { Meta, StoryObj } from '@storybook/react';
import WeatherDisplay from '../index';
import { WeatherDisplayProps } from '../types';

const meta: Meta<typeof WeatherDisplay> = {
  title: 'Agriculture/WeatherDisplay',
  component: WeatherDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof WeatherDisplay>;

const mockWeatherData: WeatherDisplayProps = {
  current: {
    temperature: 72,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 8
  },
  forecast: [
    {
      day: 'Today',
      high: 75,
      low: 60,
      condition: 'Sunny'
    },
    {
      day: 'Tomorrow',
      high: 78,
      low: 62,
      condition: 'Partly Cloudy'
    },
    {
      day: 'Wednesday',
      high: 72,
      low: 58,
      condition: 'Rain'
    }
  ]
};

export const Default: Story = {
  args: mockWeatherData
};

export const WithAlerts: Story = {
  args: {
    ...mockWeatherData,
    alerts: [
      {
        type: 'Severe Thunderstorm Watch',
        message: 'Possible severe thunderstorms developing in your area between 2 PM and 8 PM.'
      },
      {
        type: 'Flash Flood Warning',
        message: 'Heavy rainfall may cause flash flooding in low-lying areas.'
      }
    ]
  }
}; 