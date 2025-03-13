/**
 * Field Map Component
 * Interactive map for visualizing and managing farm fields
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../core/shared/ui-components/card';
import { Button } from '../../core/shared/ui-components/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../core/shared/ui-components/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../core/shared/ui-components/select';
import { Badge } from '../../core/shared/ui-components/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../core/shared/ui-components/tooltip';
import { useToast } from '../../core/shared/ui-components/use-toast';

// Icons
import { MapPin, Layers, Maximize, Minimize, Crop, Droplet, CloudRain, Sun, Wind } from 'lucide-react';

const FieldMap = ({ fields = [], onFieldSelect, selectedFieldId, weatherData, soilData }) => {
  const { toast } = useToast();
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const [mapLayers, setMapLayers] = useState({
    satellite: true,
    boundaries: true,
    soilTypes: false,
    cropTypes: true,
    weather: false,
    equipment: false
  });
  const [mapZoom, setMapZoom] = useState(14);
  const [mapCenter, setMapCenter] = useState(null);
  const [activeTab, setActiveTab] = useState('fields');
  
  // Initialize map when component mounts
  useEffect(() => {
    if (!mapRef.current) return;
    
    // This would use a mapping library like Leaflet or Google Maps in a real implementation
    const initMap = async () => {
      try {
        // Simulate map initialization
        console.log('Initializing field map...');
        
        // In a real implementation, this would create a map instance
        const mockMapInstance = {
          setCenter: (center) => {
            console.log('Setting map center to:', center);
            setMapCenter(center);
          },
          setZoom: (zoom) => {
            console.log('Setting map zoom to:', zoom);
            setMapZoom(zoom);
          },
          addLayer: (layer) => {
            console.log('Adding layer:', layer);
          },
          removeLayer: (layer) => {
            console.log('Removing layer:', layer);
          }
        };
        
        setMapInstance(mockMapInstance);
        setMapLoaded(true);
        
        // Set initial center if fields exist
        if (fields.length > 0) {
          const firstField = fields[0];
          mockMapInstance.setCenter(firstField.location);
        }
        
        toast({
          title: "Map Loaded",
          description: "Field map has been initialized successfully.",
        });
      } catch (error) {
        console.error('Error initializing map:', error);
        toast({
          title: "Map Error",
          description: "Failed to initialize field map.",
          variant: "destructive",
        });
      }
    };
    
    initMap();
    
    // Cleanup function
    return () => {
      // Cleanup map instance if needed
      if (mapInstance) {
        console.log('Cleaning up map instance');
      }
    };
  }, [mapRef]);
  
  // Update map when selected field changes
  useEffect(() => {
    if (!mapLoaded || !mapInstance) return;
    
    const selectedField = fields.find(field => field.id === selectedFieldId);
    if (selectedField) {
      mapInstance.setCenter(selectedField.location);
      mapInstance.setZoom(16); // Zoom in on selected field
    }
  }, [selectedFieldId, mapLoaded, mapInstance, fields]);
  
  // Update map layers when they change
  useEffect(() => {
    if (!mapLoaded || !mapInstance) return;
    
    // In a real implementation, this would add/remove actual map layers
    Object.entries(mapLayers).forEach(([layerName, isVisible]) => {
      if (isVisible) {
        mapInstance.addLayer(layerName);
      } else {
        mapInstance.removeLayer(layerName);
      }
    });
  }, [mapLayers, mapLoaded, mapInstance]);
  
  // Toggle a map layer
  const toggleLayer = (layerName) => {
    setMapLayers(prev => ({
      ...prev,
      [layerName]: !prev[layerName]
    }));
  };
  
  // Zoom in/out
  const zoomIn = () => {
    if (!mapInstance) return;
    const newZoom = Math.min(mapZoom + 1, 20);
    mapInstance.setZoom(newZoom);
    setMapZoom(newZoom);
  };
  
  const zoomOut = () => {
    if (!mapInstance) return;
    const newZoom = Math.max(mapZoom - 1, 1);
    mapInstance.setZoom(newZoom);
    setMapZoom(newZoom);
  };
  
  // Handle field selection
  const handleFieldSelect = (fieldId) => {
    if (onFieldSelect) {
      onFieldSelect(fieldId);
    }
  };
  
  // Render field list
  const renderFieldList = () => {
    if (fields.length === 0) {
      return (
        <div className="p-4 text-center text-gray-500">
          No fields available. Add a field to get started.
        </div>
      );
    }
    
    return (
      <div className="space-y-2 p-2">
        {fields.map(field => (
          <div 
            key={field.id}
            className={`p-3 rounded-md cursor-pointer transition-colors ${
              field.id === selectedFieldId 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-card hover:bg-accent'
            }`}
            onClick={() => handleFieldSelect(field.id)}
          >
            <div className="flex items-center justify-between">
              <div className="font-medium">{field.name}</div>
              <Badge variant="outline">{field.acres} acres</Badge>
            </div>
            <div className="text-sm mt-1 flex items-center gap-2">
              <Crop className="h-3 w-3" />
              <span>{field.currentCrop?.name || 'No crop'}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // Render weather information
  const renderWeather = () => {
    if (!weatherData) {
      return (
        <div className="p-4 text-center text-gray-500">
          No weather data available.
        </div>
      );
    }
    
    return (
      <div className="space-y-4 p-2">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">{weatherData.temperature}°F</div>
          <div className="flex items-center gap-2">
            {weatherData.condition === 'sunny' && <Sun className="h-6 w-6 text-yellow-500" />}
            {weatherData.condition === 'cloudy' && <Cloud className="h-6 w-6 text-gray-500" />}
            {weatherData.condition === 'rainy' && <CloudRain className="h-6 w-6 text-blue-500" />}
            <span className="capitalize">{weatherData.condition}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-background p-2 rounded-md">
            <div className="text-sm text-gray-500">Humidity</div>
            <div className="flex items-center gap-1">
              <Droplet className="h-4 w-4 text-blue-500" />
              <span>{weatherData.humidity}%</span>
            </div>
          </div>
          <div className="bg-background p-2 rounded-md">
            <div className="text-sm text-gray-500">Wind</div>
            <div className="flex items-center gap-1">
              <Wind className="h-4 w-4 text-blue-300" />
              <span>{weatherData.windSpeed} mph</span>
            </div>
          </div>
        </div>
        
        <div className="bg-background p-2 rounded-md">
          <div className="text-sm text-gray-500">Forecast</div>
          <div className="flex justify-between mt-1">
            {weatherData.forecast.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-xs">{day.day}</div>
                {day.condition === 'sunny' && <Sun className="h-4 w-4 mx-auto text-yellow-500" />}
                {day.condition === 'cloudy' && <Cloud className="h-4 w-4 mx-auto text-gray-500" />}
                {day.condition === 'rainy' && <CloudRain className="h-4 w-4 mx-auto text-blue-500" />}
                <div className="text-xs">{day.high}°</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // Render soil information
  const renderSoil = () => {
    if (!soilData || !selectedFieldId) {
      return (
        <div className="p-4 text-center text-gray-500">
          Select a field to view soil data.
        </div>
      );
    }
    
    return (
      <div className="space-y-4 p-2">
        <div className="bg-background p-3 rounded-md">
          <div className="text-sm text-gray-500">Soil Type</div>
          <div className="font-medium">{soilData.type}</div>
        </div>
        
        <div className="bg-background p-3 rounded-md">
          <div className="text-sm text-gray-500">pH Level</div>
          <div className="flex items-center justify-between">
            <div className="font-medium">{soilData.ph}</div>
            <Badge 
              variant={
                soilData.ph >= 6.0 && soilData.ph <= 7.0 
                  ? "success" 
                  : soilData.ph >= 5.5 && soilData.ph <= 7.5 
                    ? "warning" 
                    : "destructive"
              }
            >
              {soilData.ph >= 6.0 && soilData.ph <= 7.0 
                ? "Optimal" 
                : soilData.ph >= 5.5 && soilData.ph <= 7.5 
                  ? "Acceptable" 
                  : "Needs Adjustment"}
            </Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-background p-2 rounded-md">
            <div className="text-xs text-gray-500">Nitrogen</div>
            <div className="font-medium">{soilData.nutrients.nitrogen} ppm</div>
          </div>
          <div className="bg-background p-2 rounded-md">
            <div className="text-xs text-gray-500">Phosphorus</div>
            <div className="font-medium">{soilData.nutrients.phosphorus} ppm</div>
          </div>
          <div className="bg-background p-2 rounded-md">
            <div className="text-xs text-gray-500">Potassium</div>
            <div className="font-medium">{soilData.nutrients.potassium} ppm</div>
          </div>
        </div>
        
        <div className="bg-background p-3 rounded-md">
          <div className="text-sm text-gray-500">Organic Matter</div>
          <div className="font-medium">{soilData.organicMatter}%</div>
        </div>
      </div>
    );
  };
  
  return (
    <Card className="w-full h-[600px] overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Field Map</CardTitle>
          <Select 
            value={selectedFieldId || ''} 
            onValueChange={handleFieldSelect}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a field" />
            </SelectTrigger>
            <SelectContent>
              {fields.map(field => (
                <SelectItem key={field.id} value={field.id}>
                  {field.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <CardDescription>
          View and manage your fields
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 flex h-[calc(600px-64px)]">
        {/* Map Area */}
        <div className="relative flex-grow">
          <div 
            ref={mapRef} 
            className="w-full h-full bg-gray-200"
            style={{ 
              backgroundImage: 'url("https://via.placeholder.com/800x600?text=Field+Map")',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <div className="mt-2">Loading map...</div>
                </div>
              </div>
            )}
          </div>
          
          {/* Map Controls */}
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="secondary" size="icon" onClick={zoomIn}>
                    <Maximize className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Zoom In</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="secondary" size="icon" onClick={zoomOut}>
                    <Minimize className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Zoom Out</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={mapLayers.satellite ? "default" : "secondary"} 
                    size="icon" 
                    onClick={() => toggleLayer('satellite')}
                  >
                    <Layers className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle Satellite View</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="w-80 border-l">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="fields" className="flex-1">Fields</TabsTrigger>
              <TabsTrigger value="weather" className="flex-1">Weather</TabsTrigger>
              <TabsTrigger value="soil" className="flex-1">Soil</TabsTrigger>
            </TabsList>
            <TabsContent value="fields" className="h-[calc(600px-110px)] overflow-y-auto">
              {renderFieldList()}
            </TabsContent>
            <TabsContent value="weather" className="h-[calc(600px-110px)] overflow-y-auto">
              {renderWeather()}
            </TabsContent>
            <TabsContent value="soil" className="h-[calc(600px-110px)] overflow-y-auto">
              {renderSoil()}
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default FieldMap; 