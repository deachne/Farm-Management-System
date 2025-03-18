import React from 'react';
import { Card } from '../shared/Card';
import { WeatherDisplayProps } from './types';

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({
  current,
  forecast,
  alerts,
}) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Weather Information</h3>
      
      {/* Current Weather */}
      <div className="mb-4">
        <h4 className="font-medium">Current Conditions</h4>
        <p className="text-2xl">{current.temperature}°F</p>
        <p className="text-gray-600">{current.condition}</p>
        <div className="mt-2 text-sm text-gray-600">
          <p>Humidity: {current.humidity}%</p>
          <p>Wind Speed: {current.windSpeed} mph</p>
        </div>
      </div>

      {/* Forecast */}
      <div className="mb-4">
        <h4 className="font-medium mb-2">Forecast</h4>
        <div className="grid grid-cols-3 gap-2">
          {forecast.map((day) => (
            <div key={day.day} className="text-center p-2 bg-gray-50 rounded">
              <p className="font-medium">{day.day}</p>
              <p className="text-sm">{day.high}°F</p>
              <p className="text-sm text-gray-600">{day.low}°F</p>
              <p className="text-xs">{day.condition}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Weather Alerts */}
      {alerts && alerts.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Weather Alerts</h4>
          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <div key={index} className="p-2 bg-red-50 text-red-700 rounded">
                <p className="font-medium">{alert.type}</p>
                <p className="text-sm">{alert.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default WeatherDisplay; 