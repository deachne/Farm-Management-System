import React from 'react';
import CodeArtifact from '../../../bizzy/core/shared/ui/components/artifacts/CodeArtifact';

export default {
  title: 'Core/Artifacts/CodeArtifact',
  component: CodeArtifact,
  parameters: {
    docs: {
      description: {
        component: 'Code artifact component for displaying formatted code snippets from LibreChat. Supports syntax highlighting, copying, and saving code.',
      },
    },
  },
  argTypes: {
    code: { control: 'text' },
    language: { control: 'text' },
    isExpanded: { control: 'boolean' },
    onSave: { action: 'onSave' },
  },
};

// Default example with JavaScript code
export const JavaScript = {
  args: {
    code: `function calculateYield(fieldData) {
  const { areaInAcres, expectedYieldPerAcre, moistureLevel } = fieldData;
  
  // Adjust yield based on moisture levels
  let moistureAdjustment = 1.0;
  if (moistureLevel < 30) {
    moistureAdjustment = 0.8; // 20% reduction for dry conditions
  } else if (moistureLevel > 60) {
    moistureAdjustment = 0.9; // 10% reduction for overly wet conditions
  }
  
  const totalExpectedYield = areaInAcres * expectedYieldPerAcre * moistureAdjustment;
  return {
    totalYield: totalExpectedYield,
    adjustmentFactor: moistureAdjustment,
    adjustmentReason: getAdjustmentReason(moistureLevel)
  };
}

function getAdjustmentReason(moistureLevel) {
  if (moistureLevel < 30) return "Low soil moisture";
  if (moistureLevel > 60) return "Excessive soil moisture";
  return "Optimal growing conditions";
}`,
    language: 'javascript',
    isExpanded: true,
  },
};

// Example with Python code
export const Python = {
  args: {
    code: `import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression

# Load historical farm data
def analyze_crop_data(field_id, season, crop_type):
    """
    Analyze historical crop data and predict yield based on current conditions
    
    Parameters:
    field_id (str): Identifier for the field
    season (str): Current growing season
    crop_type (str): Type of crop planted
    
    Returns:
    dict: Prediction results and recommendations
    """
    # Load historical data
    data = pd.read_csv(f"farm_data/{field_id}_history.csv")
    
    # Filter for relevant crop and calculate features
    crop_data = data[data['crop_type'] == crop_type]
    X = crop_data[['rainfall', 'temperature', 'soil_nitrogen', 'planting_density']]
    y = crop_data['yield_per_acre']
    
    # Train simple model
    model = LinearRegression()
    model.fit(X, y)
    
    # Get current conditions
    current = get_current_conditions(field_id)
    
    # Predict yield
    predicted_yield = model.predict([current])[0]
    
    return {
        'field_id': field_id,
        'predicted_yield': predicted_yield,
        'confidence': calculate_confidence(model, X, y),
        'recommendations': generate_recommendations(model, current, crop_type)
    }`,
    language: 'python',
    isExpanded: true,
  },
};

// Example with SQL code
export const SQL = {
  args: {
    code: `-- Query to analyze farm field performance over time
SELECT 
    f.field_id,
    f.field_name,
    f.acres,
    c.crop_name,
    h.season,
    h.planting_date,
    h.harvest_date,
    h.yield_per_acre,
    h.total_yield,
    h.moisture_at_harvest,
    w.total_rainfall,
    w.avg_temperature
FROM 
    fields f
JOIN 
    harvest_records h ON f.field_id = h.field_id
JOIN 
    crops c ON h.crop_id = c.crop_id
JOIN 
    weather_data w ON h.season = w.season
WHERE 
    f.farm_id = 'FARM001'
    AND h.season >= '2020'
ORDER BY 
    f.field_name, 
    h.season DESC;`,
    language: 'sql',
    isExpanded: true,
  },
};

// Example with collapsed state
export const Collapsed = {
  args: {
    code: `// This code snippet is collapsed initially
function calculateNitrogenNeeds(soilTestResults, cropType) {
  // Calculate nitrogen requirements based on soil test and crop type
  const baseNeed = CROP_NITROGEN_BASE[cropType] || 100; // lbs per acre
  const currentLevel = soilTestResults.nitrogenPPM || 0;
  const targetLevel = CROP_NITROGEN_TARGET[cropType] || 150;
  
  return Math.max(0, targetLevel - currentLevel) * NITROGEN_CONVERSION_FACTOR;
}`,
    language: 'javascript',
    isExpanded: false,
  },
};

// Example with a long code snippet
export const LongCode = {
  args: {
    code: Array(20).fill(`// Farm Management System - Weather Analysis Module
function analyzeWeatherImpact(weatherData, cropType) {
  // Calculate impact of weather patterns on expected yield
  const temperatureImpact = calculateTemperatureImpact(weatherData.temperatures, cropType);
  const rainfallImpact = calculateRainfallImpact(weatherData.rainfall, cropType);
  const windImpact = calculateWindImpact(weatherData.windSpeeds, cropType);
  
  return {
    overallImpact: temperatureImpact * rainfallImpact * windImpact,
    factors: {
      temperature: temperatureImpact,
      rainfall: rainfallImpact,
      wind: windImpact
    }
  };
}`).join('\n\n'),
    language: 'javascript',
    isExpanded: true,
  },
};

// Example with HTML code
export const HTML = {
  args: {
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Farm Yield Calculator</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <h1>Farm Yield Calculator</h1>
    <form id="yieldCalculator">
      <div class="form-group">
        <label for="fieldSize">Field Size (acres):</label>
        <input type="number" id="fieldSize" required min="0" step="0.1">
      </div>
      <div class="form-group">
        <label for="cropType">Crop Type:</label>
        <select id="cropType">
          <option value="corn">Corn</option>
          <option value="soybeans">Soybeans</option>
          <option value="wheat">Wheat</option>
          <option value="alfalfa">Alfalfa</option>
        </select>
      </div>
      <div class="form-group">
        <label for="moistureLevel">Soil Moisture (%):</label>
        <input type="range" id="moistureLevel" min="0" max="100" value="40">
        <span id="moistureValue">40%</span>
      </div>
      <button type="submit">Calculate Expected Yield</button>
    </form>
    <div id="results" class="hidden">
      <h2>Expected Yield Results</h2>
      <p>Total Expected Yield: <span id="totalYield"></span></p>
      <p>Adjustment Factor: <span id="adjustmentFactor"></span></p>
      <p>Reason: <span id="adjustmentReason"></span></p>
    </div>
  </div>
  <script src="calculator.js"></script>
</body>
</html>`,
    language: 'html',
    isExpanded: true,
  },
};

// Example with save handler
export const WithSaveHandler = {
  args: {
    code: `// Farm irrigation calculation function
function calculateIrrigationNeeds(field, currentMoisture, targetMoisture, forecast) {
  const area = field.acres;
  const soilType = field.soilType;
  const waterCapacity = SOIL_WATER_CAPACITY[soilType] || 1.5; // inches per foot
  
  // Calculate water needed to reach target
  const currentWaterInches = currentMoisture * waterCapacity;
  const targetWaterInches = targetMoisture * waterCapacity;
  const waterDeficitInches = Math.max(0, targetWaterInches - currentWaterInches);
  
  // Adjust for upcoming rainfall
  const expectedRainfall = forecast.expectedRainfall || 0;
  const adjustedDeficit = Math.max(0, waterDeficitInches - expectedRainfall);
  
  // Calculate gallons needed
  const gallonsPerAcreInch = 27154;
  const totalGallonsNeeded = area * adjustedDeficit * gallonsPerAcreInch;
  
  return {
    deficitInches: waterDeficitInches,
    adjustedDeficitInches: adjustedDeficit,
    totalGallonsNeeded: totalGallonsNeeded,
    recommendation: generateIrrigationRecommendation(adjustedDeficit, field.crop)
  };
}`,
    language: 'javascript',
    isExpanded: true,
    onSave: (artifactData) => {
      console.log('Saved code artifact data:', artifactData);
      alert('Code artifact saved! Check console for details.');
    },
  },
}; 