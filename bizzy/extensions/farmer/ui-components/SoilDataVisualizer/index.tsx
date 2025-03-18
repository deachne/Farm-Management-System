import React, { useState } from 'react';
import { Card } from '../shared/Card';
import { SoilDataVisualizerProps, SoilSample } from './types';

const colorScales = {
  ph: [
    { value: 5.0, color: '#FF0000' }, // Very Acidic - Red
    { value: 6.0, color: '#FFA500' }, // Acidic - Orange
    { value: 7.0, color: '#00FF00' }, // Neutral - Green
    { value: 8.0, color: '#00FFFF' }, // Alkaline - Cyan
    { value: 9.0, color: '#0000FF' }  // Very Alkaline - Blue
  ],
  'organic-matter': [
    { value: 1.0, color: '#FFEEEE' }, // Very Low - Light Red
    { value: 2.0, color: '#FFCCCC' }, // Low - Medium Red
    { value: 3.0, color: '#FF9999' }, // Medium - Dark Red
    { value: 4.0, color: '#FF5555' }, // High - Very Dark Red
    { value: 5.0, color: '#FF0000' }  // Very High - Pure Red
  ],
  nitrogen: [
    { value: 10, color: '#FFFFFF' },  // Very Low - White
    { value: 20, color: '#CCFFCC' },  // Low - Light Green
    { value: 40, color: '#99FF99' },  // Medium - Medium Green
    { value: 60, color: '#66FF66' },  // High - Dark Green
    { value: 80, color: '#33FF33' }   // Very High - Very Dark Green
  ],
  phosphorus: [
    { value: 10, color: '#FFFFFF' },  // Very Low - White
    { value: 20, color: '#FFCCFF' },  // Low - Light Purple
    { value: 40, color: '#FF99FF' },  // Medium - Medium Purple
    { value: 60, color: '#FF66FF' },  // High - Dark Purple
    { value: 80, color: '#FF33FF' }   // Very High - Very Dark Purple
  ],
  potassium: [
    { value: 100, color: '#FFFFFF' }, // Very Low - White
    { value: 150, color: '#FFFFCC' }, // Low - Light Yellow
    { value: 200, color: '#FFFF99' }, // Medium - Medium Yellow
    { value: 250, color: '#FFFF66' }, // High - Dark Yellow
    { value: 300, color: '#FFFF33' }  // Very High - Very Dark Yellow
  ],
  moisture: [
    { value: 10, color: '#FFFFFF' },  // Very Low - White
    { value: 20, color: '#CCCCFF' },  // Low - Light Blue
    { value: 30, color: '#9999FF' },  // Medium - Medium Blue
    { value: 40, color: '#6666FF' },  // High - Dark Blue
    { value: 50, color: '#3333FF' }   // Very High - Very Dark Blue
  ]
};

const SoilDataVisualizer: React.FC<SoilDataVisualizerProps> = ({
  samples,
  selectedField = null,
  onFieldSelect,
  onSampleSelect,
  visualizationType = 'map',
  dataType = 'ph'
}) => {
  const [activeVisualization, setActiveVisualization] = useState<'map' | 'chart' | 'table'>(visualizationType);
  const [activeDataType, setActiveDataType] = useState<'ph' | 'organic-matter' | 'nitrogen' | 'phosphorus' | 'potassium' | 'moisture'>(dataType);
  
  // Filter samples by selected field if needed
  const filteredSamples = selectedField 
    ? samples.filter(sample => sample.fieldId === selectedField)
    : samples;
  
  // Get data value based on current activeDataType
  const getDataValue = (sample: SoilSample) => {
    switch (activeDataType) {
      case 'ph':
        return sample.ph;
      case 'organic-matter':
        return sample.organicMatter;
      case 'nitrogen':
        return sample.nutrients.nitrogen;
      case 'phosphorus':
        return sample.nutrients.phosphorus;
      case 'potassium':
        return sample.nutrients.potassium;
      case 'moisture':
        return sample.moisture;
      default:
        return 0;
    }
  };
  
  // Calculate the color for a value based on the scale
  const getColorForValue = (value: number, scale = colorScales[activeDataType]) => {
    if (value <= scale[0].value) return scale[0].color;
    if (value >= scale[scale.length - 1].value) return scale[scale.length - 1].color;
    
    for (let i = 0; i < scale.length - 1; i++) {
      if (value < scale[i + 1].value) {
        const ratio = (value - scale[i].value) / (scale[i + 1].value - scale[i].value);
        
        // Simple linear interpolation between colors
        const r1 = parseInt(scale[i].color.slice(1, 3), 16);
        const g1 = parseInt(scale[i].color.slice(3, 5), 16);
        const b1 = parseInt(scale[i].color.slice(5, 7), 16);
        
        const r2 = parseInt(scale[i + 1].color.slice(1, 3), 16);
        const g2 = parseInt(scale[i + 1].color.slice(3, 5), 16);
        const b2 = parseInt(scale[i + 1].color.slice(5, 7), 16);
        
        const r = Math.round(r1 + ratio * (r2 - r1));
        const g = Math.round(g1 + ratio * (g2 - g1));
        const b = Math.round(b1 + ratio * (b2 - b1));
        
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      }
    }
    return scale[scale.length - 1].color;
  };
  
  // Helper to get the unit for the current data type
  const getUnit = () => {
    switch (activeDataType) {
      case 'ph':
        return '';
      case 'organic-matter':
      case 'moisture':
        return '%';
      case 'nitrogen':
      case 'phosphorus':
      case 'potassium':
        return 'ppm';
      default:
        return '';
    }
  };
  
  // Helper to get formatted display name for data type
  const getDataTypeName = () => {
    switch (activeDataType) {
      case 'ph':
        return 'pH';
      case 'organic-matter':
        return 'Organic Matter';
      case 'nitrogen':
        return 'Nitrogen (N)';
      case 'phosphorus':
        return 'Phosphorus (P)';
      case 'potassium':
        return 'Potassium (K)';
      case 'moisture':
        return 'Moisture';
      default:
        return activeDataType;
    }
  };
  
  // Render Map View (placeholder)
  const renderMapView = () => {
    return (
      <div className="relative h-[400px] bg-gray-100 rounded-lg">
        {/* Placeholder for actual map */}
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-500">Map Visualization (Placeholder)</p>
        </div>
        
        {/* Sample Points Simulation */}
        <div className="absolute inset-0">
          {filteredSamples.map(sample => (
            <div 
              key={sample.id}
              style={{
                position: 'absolute',
                left: `${(sample.location.lng % 100) / 100 * 90 + 5}%`,
                top: `${(sample.location.lat % 100) / 100 * 90 + 5}%`,
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: getColorForValue(getDataValue(sample)),
                border: '1px solid black',
                cursor: 'pointer'
              }}
              onClick={() => onSampleSelect && onSampleSelect(sample.id)}
              title={`${sample.fieldName}: ${getDataValue(sample)}${getUnit()}`}
            />
          ))}
        </div>
        
        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white p-2 rounded-lg shadow-md">
          <div className="text-sm font-medium mb-1">{getDataTypeName()}</div>
          <div className="flex">
            {colorScales[activeDataType].map((item, index) => (
              <div key={index} className="flex flex-col items-center mx-1">
                <div 
                  style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: item.color,
                    border: '1px solid #ccc'
                  }}
                />
                <span className="text-xs mt-1">{item.value}{getUnit()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // Render Chart View (placeholder)
  const renderChartView = () => {
    // Group samples by field
    const fieldGroups: Record<string, SoilSample[]> = {};
    filteredSamples.forEach(sample => {
      if (!fieldGroups[sample.fieldId]) {
        fieldGroups[sample.fieldId] = [];
      }
      fieldGroups[sample.fieldId].push(sample);
    });
    
    // Calculate averages for each field
    const fieldAverages = Object.entries(fieldGroups).map(([fieldId, samples]) => {
      const fieldName = samples[0].fieldName;
      const sum = samples.reduce((acc, sample) => acc + getDataValue(sample), 0);
      const avg = sum / samples.length;
      return { fieldId, fieldName, value: avg };
    });
    
    // Sort by value
    fieldAverages.sort((a, b) => b.value - a.value);
    
    // Max value for scaling
    const maxValue = Math.max(...fieldAverages.map(item => item.value));
    
    return (
      <div className="h-[400px] p-4">
        <h3 className="text-lg font-medium mb-4">
          Average {getDataTypeName()} by Field
        </h3>
        
        <div className="space-y-4">
          {fieldAverages.map(item => (
            <div 
              key={item.fieldId} 
              className="flex flex-col"
              onClick={() => onFieldSelect && onFieldSelect(item.fieldId)}
            >
              <div className="flex justify-between text-sm mb-1">
                <span>{item.fieldName}</span>
                <span>{item.value.toFixed(2)}{getUnit()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-6">
                <div 
                  className="h-6 rounded-full" 
                  style={{
                    width: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: getColorForValue(item.value)
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Render Table View
  const renderTableView = () => {
    return (
      <div className="h-[400px] overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Field
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sample Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {getDataTypeName()}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Depth
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSamples.map(sample => (
              <tr 
                key={sample.id}
                onClick={() => onSampleSelect && onSampleSelect(sample.id)}
                className="cursor-pointer hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{sample.fieldName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(sample.sampleDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span 
                    className="px-2 py-1 inline-flex text-sm rounded-full"
                    style={{
                      backgroundColor: getColorForValue(getDataValue(sample)),
                      color: activeDataType === 'organic-matter' || activeDataType === 'nitrogen' ? '#000' : '#fff'
                    }}
                  >
                    {getDataValue(sample).toFixed(2)}{getUnit()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {sample.depth}" depth
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  return (
    <Card className="w-full">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Soil Data Visualizer</h2>
          <div className="flex space-x-2">
            <button
              className={`px-3 py-1 text-sm rounded ${activeVisualization === 'map' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              onClick={() => setActiveVisualization('map')}
            >
              Map
            </button>
            <button
              className={`px-3 py-1 text-sm rounded ${activeVisualization === 'chart' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              onClick={() => setActiveVisualization('chart')}
            >
              Chart
            </button>
            <button
              className={`px-3 py-1 text-sm rounded ${activeVisualization === 'table' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              onClick={() => setActiveVisualization('table')}
            >
              Table
            </button>
          </div>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            className={`px-3 py-1 text-sm rounded ${activeDataType === 'ph' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            onClick={() => setActiveDataType('ph')}
          >
            pH
          </button>
          <button
            className={`px-3 py-1 text-sm rounded ${activeDataType === 'organic-matter' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            onClick={() => setActiveDataType('organic-matter')}
          >
            Organic Matter
          </button>
          <button
            className={`px-3 py-1 text-sm rounded ${activeDataType === 'nitrogen' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            onClick={() => setActiveDataType('nitrogen')}
          >
            Nitrogen (N)
          </button>
          <button
            className={`px-3 py-1 text-sm rounded ${activeDataType === 'phosphorus' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            onClick={() => setActiveDataType('phosphorus')}
          >
            Phosphorus (P)
          </button>
          <button
            className={`px-3 py-1 text-sm rounded ${activeDataType === 'potassium' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            onClick={() => setActiveDataType('potassium')}
          >
            Potassium (K)
          </button>
          <button
            className={`px-3 py-1 text-sm rounded ${activeDataType === 'moisture' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
            onClick={() => setActiveDataType('moisture')}
          >
            Moisture
          </button>
        </div>
      </div>
      
      <div className="p-4">
        {activeVisualization === 'map' && renderMapView()}
        {activeVisualization === 'chart' && renderChartView()}
        {activeVisualization === 'table' && renderTableView()}
      </div>
    </Card>
  );
};

export default SoilDataVisualizer; 