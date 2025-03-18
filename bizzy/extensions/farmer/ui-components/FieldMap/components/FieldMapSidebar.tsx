import React from 'react';
import { Field, WeatherData, SoilData } from '../types';

interface FieldMapSidebarProps {
  fields: Field[];
  selectedFieldId: string | null;
  weatherData?: WeatherData;
  soilData?: SoilData;
}

export const FieldMapSidebar: React.FC<FieldMapSidebarProps> = ({
  fields,
  selectedFieldId,
  weatherData,
  soilData,
}) => {
  const selectedField = fields.find(field => field.id === selectedFieldId);

  return (
    <div className="w-64 border-l border-gray-200 p-4 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">Field Details</h3>
      
      {selectedField ? (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">{selectedField.name}</h4>
            <p className="text-sm text-gray-600">{selectedField.acres} acres</p>
            {selectedField.soilType && (
              <p className="text-sm text-gray-600">Soil: {selectedField.soilType}</p>
            )}
          </div>

          {selectedField.currentCrop && (
            <div>
              <h4 className="font-medium">Current Crop</h4>
              <p className="text-sm">{selectedField.currentCrop.name}</p>
              <p className="text-sm text-gray-600">
                Planted: {selectedField.currentCrop.plantingDate}
              </p>
              <p className="text-sm text-gray-600">
                Expected Harvest: {selectedField.currentCrop.expectedHarvestDate}
              </p>
            </div>
          )}

          {weatherData && (
            <div>
              <h4 className="font-medium">Weather</h4>
              <p className="text-sm">
                {weatherData.current.temperature}°F, {weatherData.current.condition}
              </p>
              <p className="text-sm text-gray-600">
                Humidity: {weatherData.current.humidity}%
              </p>
            </div>
          )}

          {soilData && (
            <div>
              <h4 className="font-medium">Soil Analysis</h4>
              <div className="text-sm space-y-1">
                <p>pH: {soilData.ph}</p>
                <p>Moisture: {soilData.moisture}%</p>
                <p>Organic Matter: {soilData.organicMatter}%</p>
                <div>
                  <p className="font-medium text-xs mt-2">Nutrients</p>
                  <p>N: {soilData.nutrients.nitrogen} ppm</p>
                  <p>P: {soilData.nutrients.phosphorus} ppm</p>
                  <p>K: {soilData.nutrients.potassium} ppm</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500">Select a field to view details</p>
      )}
    </div>
  );
}; 