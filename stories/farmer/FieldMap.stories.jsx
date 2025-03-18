import MockFieldMap from './MockFieldMap.jsx';

export default {
  title: 'BizzyFarmer/FieldMap',
  component: MockFieldMap,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    fields: { control: 'object' },
    onFieldSelect: { action: 'fieldSelected' },
    selectedFieldId: { control: 'text' },
    weatherData: { control: 'object' },
    soilData: { control: 'object' },
  },
};

// Define mock data for the component
const mockFields = [
  { id: 'field1', name: 'North Field', acres: 42, crop: 'Corn', status: 'active' },
  { id: 'field2', name: 'South Field', acres: 38, crop: 'Soybeans', status: 'active' },
  { id: 'field3', name: 'West Pasture', acres: 15, crop: 'Hay', status: 'fallow' }
];

const mockWeatherData = {
  current: {
    temp: 72,
    humidity: 65,
    windSpeed: 8,
    condition: 'Partly Cloudy'
  },
  forecast: [
    { day: 'Today', high: 75, low: 62, condition: 'Partly Cloudy' },
    { day: 'Tomorrow', high: 80, low: 65, condition: 'Sunny' }
  ]
};

const mockSoilData = {
  moisture: 42,
  ph: 6.7,
  nitrogen: 'Medium',
  phosphorus: 'High',
  potassium: 'Medium'
};

// Create the default story
export const Default = {
  args: {
    fields: mockFields,
    selectedFieldId: 'field1',
    weatherData: mockWeatherData,
    soilData: mockSoilData
  },
};

// Create variations
export const EmptyMap = {
  args: {
    fields: [],
    weatherData: null,
    soilData: null
  },
};

export const WithSelectedField = {
  args: {
    ...Default.args,
    selectedFieldId: 'field2'
  },
};

export const WithDetailedWeatherData = {
  args: {
    ...Default.args,
    weatherData: {
      ...mockWeatherData,
      alerts: [
        { type: 'warning', message: 'Thunderstorm watch in effect until 8 PM' }
      ],
      forecast: [
        ...mockWeatherData.forecast,
        { day: 'Wednesday', high: 82, low: 67, condition: 'Thunderstorms' },
        { day: 'Thursday', high: 79, low: 65, condition: 'Rain' }
      ]
    }
  },
}; 