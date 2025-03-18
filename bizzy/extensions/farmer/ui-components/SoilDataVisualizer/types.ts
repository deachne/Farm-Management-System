export interface SoilSample {
  id: string;
  fieldId: string;
  fieldName: string;
  sampleDate: string; // ISO date string
  location: {
    lat: number;
    lng: number;
  };
  depth: number; // in inches
  ph: number;
  organicMatter: number; // percentage
  moisture: number; // percentage
  temperature: number; // in Fahrenheit
  nutrients: {
    nitrogen: number; // ppm
    phosphorus: number; // ppm
    potassium: number; // ppm
    calcium?: number; // ppm
    magnesium?: number; // ppm
    sulfur?: number; // ppm
  };
  cec?: number; // Cation Exchange Capacity
  texture?: {
    sand: number; // percentage
    silt: number; // percentage
    clay: number; // percentage
  };
  notes?: string;
}

export interface SoilDataVisualizerProps {
  samples: SoilSample[];
  selectedField?: string | null; // fieldId to filter by
  onFieldSelect?: (fieldId: string) => void;
  onSampleSelect?: (sampleId: string) => void;
  visualizationType?: 'map' | 'chart' | 'table';
  dataType?: 'ph' | 'organic-matter' | 'nitrogen' | 'phosphorus' | 'potassium' | 'moisture';
} 