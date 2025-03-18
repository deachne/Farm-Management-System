import { GeoJSON } from 'geojson';

export interface Field {
  id: string;
  name: string;
  acres: number;
  boundaries: GeoJSON.Polygon;
  currentCrop?: {
    name: string;
    plantingDate: string;
    expectedHarvestDate: string;
  };
  soilType?: string;
  location: {
    lat: number;
    lng: number;
  };
}

export interface WeatherData {
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

export interface SoilData {
  type: string;
  ph: number;
  moisture: number;
  nutrients: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
  organicMatter: number;
}

export interface MapState {
  layers: {
    satellite: boolean;
    boundaries: boolean;
    soilTypes: boolean;
    cropTypes: boolean;
    weather: boolean;
    equipment: boolean;
  };
  zoom: number;
  center: { lat: number; lng: number } | null;
}

export interface FieldMapProps {
  fields: Field[];
  onFieldSelect: (fieldId: string) => void;
  selectedFieldId: string | null;
  weatherData?: WeatherData;
  soilData?: SoilData;
} 