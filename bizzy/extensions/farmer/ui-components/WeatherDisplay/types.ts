export interface WeatherDisplayProps {
  current: {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
  };
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
  }>;
  alerts?: Array<{
    type: string;
    message: string;
  }>;
} 