# Farm Management System - UI Components

This document outlines the user interface components for our agricultural knowledge management system, focusing on both web and mobile experiences.

## Design Philosophy

The UI design follows these core principles:

1. **Simplicity First** - Clean, uncluttered interfaces that focus on the task at hand
2. **Field-Friendly** - Optimized for use in agricultural settings (outdoors, gloves, etc.)
3. **Contextual Intelligence** - UI adapts based on the current task and user context
4. **Progressive Disclosure** - Complex features revealed progressively as needed
5. **Consistent Patterns** - Familiar interaction patterns across the system

## Core UI Components

### 1. Notes Interface

The notes interface serves as a primary entry point for capturing and organizing farm information:

![Notes Interface](anythingllm-notes-mockup.html)

#### Key Features:
- Two-column layout with notes list and editor
- Simple formatting controls
- Automatic saving
- Tagging and categorization
- Field association
- Weather integration

#### Implementation:
```jsx
// Notes component structure
const Notes = () => {
  return (
    <div className="flex h-screen">
      {/* Notes List Sidebar */}
      <NotesList />
      
      {/* Note Editor */}
      <NoteEditor />
    </div>
  );
};

// Note Editor component
const NoteEditor = ({ note }) => {
  return (
    <div className="flex-1 flex flex-col">
      {/* Editor Toolbar */}
      <div className="bg-theme-bg-secondary border-b border-theme-border p-2 flex items-center justify-between">
        <input
          type="text"
          value={note.title}
          className="bg-transparent border-none text-lg font-medium text-theme-text-primary focus:outline-none focus:ring-0"
          placeholder="Note title"
        />
        
        {/* Formatting controls */}
        <div className="flex items-center space-x-2">
          {/* Format buttons */}
        </div>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <textarea
          className="w-full h-full resize-none bg-transparent text-theme-text-primary focus:outline-none focus:ring-0"
          value={note.content}
          placeholder="Start writing..."
        />
      </div>
      
      {/* Footer */}
      <div className="bg-theme-bg-secondary border-t border-theme-border p-2 flex justify-between items-center">
        <div className="text-xs text-theme-text-secondary">
          {note.lastUpdated ? `Updated ${formatDate(note.lastUpdated)}` : ''}
        </div>
        
        <div className="flex space-x-2">
          <button className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm">
            Save & Embed
          </button>
          <button className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md text-sm">
            Add to Workspace
          </button>
        </div>
      </div>
    </div>
  );
};
```

### 2. Field Mapping Component

The field mapping component provides spatial context for farm data:

#### Key Features:
- Interactive map with field boundaries
- Color-coded overlays for different data types
- Observation markers with popup details
- Drawing tools for marking areas of interest
- Layer controls for different data views

#### Implementation:
```jsx
// Field Map component
const FieldMap = ({ fields, observations }) => {
  return (
    <div className="h-full w-full relative">
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 bg-white rounded-md shadow-md p-2">
        <LayerControls />
      </div>
      
      {/* Leaflet Map */}
      <MapContainer 
        center={[51.505, -0.09]} 
        zoom={13} 
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Field Boundaries */}
        {fields.map(field => (
          <GeoJSON
            key={field.id}
            data={JSON.parse(field.boundaries)}
            style={{
              color: field.color || '#3388ff',
              weight: 2,
              opacity: 0.7,
              fillOpacity: 0.2
            }}
          >
            <Popup>
              <h3 className="font-medium">{field.name}</h3>
              <p>{field.acres} acres</p>
              <p>{field.soil_type}</p>
            </Popup>
          </GeoJSON>
        ))}
        
        {/* Observation Markers */}
        {observations.map(obs => (
          <Marker
            key={obs.id}
            position={JSON.parse(obs.location)}
            icon={getObservationIcon(obs.type)}
          >
            <Popup>
              <h3 className="font-medium">{obs.title}</h3>
              <p className="text-sm text-gray-600">
                {formatDate(obs.created_at)}
              </p>
              <p>{obs.content.substring(0, 100)}...</p>
              <button className="text-blue-500 text-sm">View Details</button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
```

### 3. Mobile Observation Interface

The mobile interface is optimized for field use:

#### Key Features:
- Large touch targets for gloved operation
- Voice recording for hands-free note taking
- Quick photo capture with annotation
- Location awareness and field detection
- Offline capability with sync

#### Implementation:
```jsx
// Mobile Observation component
const MobileObservation = () => {
  const [recording, setRecording] = useState(false);
  const [location, setLocation] = useState(null);
  
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm">
        <h1 className="text-xl font-medium">Field Observation</h1>
        <p className="text-sm text-gray-600">
          {location ? `${location.fieldName || 'Unknown Field'}` : 'Locating...'}
        </p>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <textarea
          className="w-full p-3 rounded-lg border border-gray-300 text-lg"
          placeholder="Describe what you see..."
          rows={6}
        />
        
        {/* Photo Preview */}
        <div className="mt-4 flex flex-wrap gap-2">
          {photos.map(photo => (
            <div key={photo.id} className="relative w-24 h-24">
              <img 
                src={photo.uri} 
                className="w-full h-full object-cover rounded-md" 
              />
              <button className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Action Bar */}
      <div className="bg-white p-4 shadow-t-sm flex justify-between items-center">
        <div className="flex space-x-4">
          <button className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <CameraIcon className="w-6 h-6 text-blue-500" />
          </button>
          
          <button 
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              recording ? 'bg-red-500' : 'bg-blue-100'
            }`}
            onClick={() => setRecording(!recording)}
          >
            <MicrophoneIcon className={`w-6 h-6 ${recording ? 'text-white' : 'text-blue-500'}`} />
          </button>
        </div>
        
        <button className="px-6 py-3 bg-blue-500 text-white rounded-lg text-lg font-medium">
          Save
        </button>
      </div>
    </div>
  );
};
```

### 4. Soil Test Visualization

The soil test visualization component presents complex soil data in an actionable format:

#### Key Features:
- Nutrient level visualization with optimal ranges
- Historical trend charts
- Recommendation summary
- Field comparison view
- Application rate calculator

#### Implementation:
```jsx
// Soil Test Visualization component
const SoilTestVisualization = ({ soilTest }) => {
  const results = JSON.parse(soilTest.results);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-medium">{soilTest.field.name} Soil Test</h2>
          <p className="text-sm text-gray-600">
            Test Date: {formatDate(soilTest.test_date)}
          </p>
          <p className="text-sm text-gray-600">
            Lab: {soilTest.lab}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md text-sm">
            Export PDF
          </button>
          <button className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm">
            Generate Recommendations
          </button>
        </div>
      </div>
      
      {/* Nutrient Levels */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {Object.entries(results.nutrients).map(([nutrient, value]) => (
          <div key={nutrient} className="bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">{getNutrientName(nutrient)}</h3>
              <span className={getNutrientLevelClass(nutrient, value)}>
                {value} {getNutrientUnit(nutrient)}
              </span>
            </div>
            
            <NutrientLevelBar 
              value={value} 
              optimal={getNutrientOptimalRange(nutrient)} 
            />
            
            <p className="text-xs text-gray-600 mt-2">
              {getNutrientDescription(nutrient, value)}
            </p>
          </div>
        ))}
      </div>
      
      {/* Recommendations */}
      {soilTest.recommendations && (
        <div className="border-t border-gray-200 pt-4 mt-4">
          <h3 className="font-medium mb-2">Recommendations</h3>
          <div className="bg-blue-50 p-4 rounded-md">
            {JSON.parse(soilTest.recommendations).map((rec, index) => (
              <div key={index} className="mb-2 last:mb-0">
                <p className="font-medium">{rec.nutrient}:</p>
                <p>{rec.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
```

### 5. Price Comparison Dashboard

The price comparison dashboard helps farmers make informed purchasing decisions:

#### Key Features:
- Side-by-side supplier comparison
- Historical price trends
- Unit conversion and normalization
- Quote validity tracking
- Best price highlighting

#### Implementation:
```jsx
// Price Comparison Dashboard component
const PriceComparisonDashboard = ({ quotes }) => {
  // Group quotes by product
  const productGroups = groupQuotesByProduct(quotes);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-medium mb-6">Input Price Comparison</h2>
      
      {/* Product Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {Object.keys(productGroups).map(product => (
            <button 
              key={product}
              className={`py-2 px-1 border-b-2 ${
                selectedProduct === product 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {product}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Price Comparison Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Supplier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Normalized Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valid Until
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {productGroups[selectedProduct].map(quote => (
              <tr 
                key={quote.id}
                className={quote.isBestPrice ? 'bg-green-50' : ''}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">
                    {quote.supplier}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${quote.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {quote.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${quote.normalizedPrice.toFixed(2)}/{quote.normalizedUnit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {quote.valid_until ? formatDate(quote.valid_until) : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="text-blue-500 hover:text-blue-700">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Price Trend Chart */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Price Trends</h3>
        <div className="h-64">
          <PriceTrendChart 
            product={selectedProduct} 
            timeRange={timeRange} 
          />
        </div>
      </div>
    </div>
  );
};
```

## Mobile Experience Design

The mobile experience is optimized for field use with these considerations:

### 1. Responsive Design
- Fluid layouts that adapt to different screen sizes
- Touch-friendly interface elements
- Simplified navigation for smaller screens

### 2. Offline Capability
- Local storage for offline data capture
- Synchronization when connectivity is available
- Clear indicators of sync status

### 3. Field-Friendly Features
- Large touch targets (minimum 48px)
- High contrast mode for outdoor visibility
- Voice input for hands-free operation
- Simplified data entry forms

### 4. Performance Optimization
- Minimal network requests
- Efficient rendering for lower-powered devices
- Battery-conscious background operations

## Accessibility Considerations

The UI implements these accessibility features:

1. **Color Contrast** - All text meets WCAG AA standards for contrast
2. **Keyboard Navigation** - Full keyboard support for all interactions
3. **Screen Reader Support** - Proper ARIA labels and semantic HTML
4. **Touch Target Size** - Minimum 44px touch targets for all interactive elements
5. **Text Sizing** - Responsive text that scales appropriately

## UI Component Library

The system uses a consistent component library across all interfaces:

### 1. Core Components
- Buttons, inputs, and form controls
- Cards and containers
- Navigation elements
- Modal dialogs and popovers

### 2. Agricultural Components
- Field map visualization
- Soil test result displays
- Weather condition indicators
- Crop stage visualizations

### 3. Data Visualization Components
- Bar and line charts for trends
- Gauge charts for levels and ranges
- Heat maps for spatial data
- Comparison tables for pricing

## Implementation Approach

The UI is implemented using these technologies:

1. **React** for component-based architecture
2. **TailwindCSS** for styling
3. **React Router** for navigation
4. **Chart.js** for data visualization
5. **Leaflet** for mapping

The components follow a consistent pattern:

```jsx
// Component structure pattern
const ComponentName = ({ props }) => {
  // State management
  const [state, setState] = useState(initialState);
  
  // Effects and data fetching
  useEffect(() => {
    // Data fetching or side effects
  }, [dependencies]);
  
  // Event handlers
  const handleEvent = () => {
    // Event handling logic
  };
  
  // Render
  return (
    <div className="component-container">
      {/* Component content */}
    </div>
  );
};
```

## Responsive Breakpoints

The system uses these responsive breakpoints:

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

Media queries are implemented using Tailwind's responsive prefixes:

```jsx
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Content that adapts to screen size */}
</div>
```

## Theme System

The UI implements a theme system with light and dark modes:

```css
:root {
  /* Light theme variables */
  --theme-bg-container: #ffffff;
  --theme-bg-sidebar: #f9fafb;
  --theme-text-primary: #111827;
  --theme-text-secondary: #6b7280;
  --theme-border: #e5e7eb;
  --theme-hover: #f3f4f6;
}

[data-theme="dark"] {
  /* Dark theme variables */
  --theme-bg-container: #1f2937;
  --theme-bg-sidebar: #111827;
  --theme-text-primary: #f9fafb;
  --theme-text-secondary: #d1d5db;
  --theme-border: #374151;
  --theme-hover: #374151;
}

/* Theme classes */
.bg-theme-bg-container {
  background-color: var(--theme-bg-container);
}

.text-theme-text-primary {
  color: var(--theme-text-primary);
}

/* Additional theme classes */
```

This approach ensures consistent styling across the application while supporting both light and dark modes. 