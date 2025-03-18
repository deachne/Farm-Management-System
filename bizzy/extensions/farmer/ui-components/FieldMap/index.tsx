import React from 'react';
import { Card } from '../shared/Card';
import { FieldMapProps } from './types';
import { useFieldMapState } from './hooks/useFieldMapState';
import { FieldMapControls } from './components/FieldMapControls';
import { FieldMapDisplay } from './components/FieldMapDisplay';
import { FieldMapSidebar } from './components/FieldMapSidebar';

const FieldMap: React.FC<FieldMapProps> = ({
  fields,
  onFieldSelect,
  selectedFieldId,
  weatherData,
  soilData,
}) => {
  const {
    mapState,
    setMapState,
    handleLayerToggle,
    handleZoomChange,
  } = useFieldMapState();

  return (
    <Card className="w-full h-[600px] flex">
      <div className="flex-1 relative">
        <FieldMapControls 
          mapState={mapState}
          onLayerToggle={handleLayerToggle}
          onZoomChange={handleZoomChange}
        />
        <FieldMapDisplay
          fields={fields}
          selectedFieldId={selectedFieldId}
          onFieldSelect={onFieldSelect}
          mapState={mapState}
        />
      </div>
      <FieldMapSidebar
        fields={fields}
        selectedFieldId={selectedFieldId}
        weatherData={weatherData}
        soilData={soilData}
      />
    </Card>
  );
};

export default FieldMap; 