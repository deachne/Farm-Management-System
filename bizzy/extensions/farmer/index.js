/**
 * BizzyFarmer Extension
 * Agricultural management extension for BizzyPerson
 */

const { register } = require('../../core/extension-api/hooks');

// Import data models
const fieldModel = require('./data-models/field');
const cropModel = require('./data-models/crop');
const equipmentModel = require('./data-models/equipment');
const soilTestModel = require('./data-models/soil-test');
const weatherDataModel = require('./data-models/weather-data');
const harvestRecordModel = require('./data-models/harvest-record');

// Import tools
const fieldAnalyzer = require('./tools/field-analyzer');
const cropPlanner = require('./tools/crop-planner');
const equipmentScheduler = require('./tools/equipment-scheduler');
const weatherForecaster = require('./tools/weather-forecaster');
const yieldCalculator = require('./tools/yield-calculator');

// Import UI components
const fieldMap = require('./ui-components/field-map');
const cropCalendar = require('./ui-components/crop-calendar');
const equipmentDashboard = require('./ui-components/equipment-dashboard');
const weatherWidget = require('./ui-components/weather-widget');
const yieldChart = require('./ui-components/yield-chart');

// Register the extension
register({
  name: 'bizzy-farmer',
  version: '0.1.0',
  
  // Register data models
  dataModels: [
    fieldModel,
    cropModel,
    equipmentModel,
    soilTestModel,
    weatherDataModel,
    harvestRecordModel
  ],
  
  // Register tools
  tools: [
    fieldAnalyzer,
    cropPlanner,
    equipmentScheduler,
    weatherForecaster,
    yieldCalculator
  ],
  
  // Register UI components
  uiComponents: [
    fieldMap,
    cropCalendar,
    equipmentDashboard,
    weatherWidget,
    yieldChart
  ],
  
  // Register hooks
  hooks: {
    // Document processor hook
    'document-processor': async (document, context) => {
      // Process agricultural documents
      if (document.metadata && document.metadata.type === 'agricultural') {
        console.log('Processing agricultural document:', document.name);
        
        // Implement agricultural-specific document processing
        // This could include extracting field data, crop information, etc.
        
        return {
          ...document,
          processed: true,
          agriculturalData: {
            // Extract agricultural-specific data
          }
        };
      }
      
      // Return the document unchanged if it's not agricultural
      return document;
    },
    
    // Chat tool hook
    'chat-tool': async (query, context) => {
      // Implement agricultural-specific chat functionality
      if (query.toLowerCase().includes('field') || 
          query.toLowerCase().includes('crop') || 
          query.toLowerCase().includes('farm')) {
        
        console.log('Processing agricultural chat query:', query);
        
        // Implement agricultural-specific chat processing
        // This could include field recommendations, crop advice, etc.
        
        return {
          type: 'agricultural',
          data: {
            // Agricultural-specific response data
          }
        };
      }
      
      // Return null to let other extensions or the core handle the query
      return null;
    },
    
    // UI component hook
    'ui-component': (props) => {
      // Implement agricultural-specific UI components
      if (props.type === 'dashboard') {
        console.log('Rendering agricultural dashboard');
        
        // Return agricultural dashboard components
        return {
          type: 'agricultural-dashboard',
          components: [
            fieldMap,
            cropCalendar,
            equipmentDashboard,
            weatherWidget,
            yieldChart
          ]
        };
      }
      
      // Return null to let other extensions or the core handle the UI
      return null;
    }
  }
});

console.log('BizzyFarmer extension loaded successfully');

module.exports = {
  name: 'bizzy-farmer',
  version: '0.1.0'
}; 