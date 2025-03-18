import React from 'react';

/**
 * Mock Field Map Component for Storybook
 * This is a simplified version of the actual FieldMap component
 */
const MockFieldMap = ({ 
  fields = [], 
  onFieldSelect = () => {}, 
  selectedFieldId = null, 
  weatherData = null, 
  soilData = null 
}) => {
  return (
    <div style={{ 
      border: '1px solid #ccc', 
      borderRadius: '8px', 
      padding: '16px',
      width: '600px',
      height: '400px',
      background: '#f8f9fa',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
        <h3 style={{ margin: 0 }}>Field Map</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['Satellite', 'Boundaries', 'Soil', 'Crops', 'Weather'].map(layer => (
            <button 
              key={layer}
              style={{
                padding: '4px 8px',
                background: layer === 'Satellite' || layer === 'Boundaries' ? '#3b82f6' : '#e2e8f0',
                color: layer === 'Satellite' || layer === 'Boundaries' ? 'white' : 'black',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              {layer}
            </button>
          ))}
        </div>
      </div>
      
      <div style={{ 
        backgroundColor: '#d1e7dd', 
        height: '300px', 
        borderRadius: '4px',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {fields.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666' }}>
            <p>No fields available</p>
          </div>
        ) : (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* Mock field representations */}
            {fields.map((field, index) => (
              <div 
                key={field.id}
                onClick={() => onFieldSelect(field.id)}
                style={{
                  position: 'absolute',
                  left: `${20 + (index * 30)}%`,
                  top: `${30 + (index * 15)}%`,
                  width: '120px',
                  height: '80px',
                  backgroundColor: field.id === selectedFieldId ? '#9ec5fe' : '#c5e1a5',
                  border: field.id === selectedFieldId ? '2px solid #3b82f6' : '1px solid #4caf50',
                  borderRadius: '4px',
                  padding: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  transform: field.id === selectedFieldId ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.2s ease',
                  zIndex: field.id === selectedFieldId ? 10 : 1
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{field.name}</div>
                <div style={{ fontSize: '12px' }}>{field.acres} acres</div>
                <div style={{ fontSize: '12px' }}>Crop: {field.crop}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Information panel */}
      {selectedFieldId && weatherData && (
        <div style={{ 
          marginTop: '16px', 
          display: 'flex', 
          gap: '16px', 
          fontSize: '14px'
        }}>
          <div style={{ flex: 1, padding: '8px', backgroundColor: '#e6f7ff', borderRadius: '4px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Weather</h4>
            <div>{weatherData.current.temp}°F, {weatherData.current.condition}</div>
            <div>Humidity: {weatherData.current.humidity}%</div>
            {weatherData.alerts && weatherData.alerts.map((alert, i) => (
              <div key={i} style={{ color: 'red', marginTop: '4px' }}>{alert.message}</div>
            ))}
          </div>
          
          {soilData && (
            <div style={{ flex: 1, padding: '8px', backgroundColor: '#f3e8d6', borderRadius: '4px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Soil</h4>
              <div>Moisture: {soilData.moisture}%</div>
              <div>pH: {soilData.ph}</div>
              <div>Nitrogen: {soilData.nitrogen}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MockFieldMap; 