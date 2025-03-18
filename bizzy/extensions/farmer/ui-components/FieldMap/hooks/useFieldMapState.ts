import { useState } from 'react';
import { MapState } from '../types';

export const useFieldMapState = () => {
  const [mapState, setMapState] = useState<MapState>({
    layers: {
      satellite: true,
      boundaries: true,
      soilTypes: false,
      cropTypes: true,
      weather: false,
      equipment: false
    },
    zoom: 14,
    center: null
  });

  const handleLayerToggle = (layer: keyof MapState['layers']) => {
    setMapState(prev => ({
      ...prev,
      layers: {
        ...prev.layers,
        [layer]: !prev.layers[layer]
      }
    }));
  };

  const handleZoomChange = (zoom: number) => {
    setMapState(prev => ({
      ...prev,
      zoom
    }));
  };

  return {
    mapState,
    setMapState,
    handleLayerToggle,
    handleZoomChange
  };
}; 