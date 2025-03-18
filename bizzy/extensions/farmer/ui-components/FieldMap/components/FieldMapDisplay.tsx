import React from 'react';
import { Field, MapState } from '../types';

interface FieldMapDisplayProps {
  fields: Field[];
  selectedFieldId: string | null;
  onFieldSelect: (fieldId: string) => void;
  mapState: MapState;
}

export const FieldMapDisplay: React.FC<FieldMapDisplayProps> = ({
  fields,
  selectedFieldId,
  onFieldSelect,
  mapState,
}) => {
  // This is a placeholder component - in a real implementation, 
  // you would integrate with a mapping library like Mapbox or Leaflet
  return (
    <div className="w-full h-full bg-gray-100">
      <div className="p-4">
        <h3 className="text-lg font-semibold">Map Display</h3>
        <p className="text-sm text-gray-600">
          Zoom Level: {mapState.zoom}
        </p>
        <div className="mt-4">
          <h4 className="font-medium">Active Layers:</h4>
          <ul className="mt-2 space-y-1">
            {Object.entries(mapState.layers)
              .filter(([_, isActive]) => isActive)
              .map(([layer]) => (
                <li key={layer} className="text-sm capitalize">
                  {layer}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}; 