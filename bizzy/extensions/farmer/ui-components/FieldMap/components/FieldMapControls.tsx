import React from 'react';
import { MapState } from '../types';

interface FieldMapControlsProps {
  mapState: MapState;
  onLayerToggle: (layer: keyof MapState['layers']) => void;
  onZoomChange: (zoom: number) => void;
}

export const FieldMapControls: React.FC<FieldMapControlsProps> = ({
  mapState,
  onLayerToggle,
  onZoomChange,
}) => {
  return (
    <div className="absolute top-4 right-4 z-10 bg-white p-4 rounded-lg shadow-md">
      <div className="space-y-2">
        {Object.entries(mapState.layers).map(([layer, isActive]) => (
          <label key={layer} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={() => onLayerToggle(layer as keyof MapState['layers'])}
            />
            <span className="capitalize">{layer}</span>
          </label>
        ))}
      </div>
      <div className="mt-4">
        <label className="block text-sm">Zoom Level</label>
        <input
          type="range"
          min="1"
          max="20"
          value={mapState.zoom}
          onChange={(e) => onZoomChange(Number(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
}; 