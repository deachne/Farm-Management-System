import React, { useState } from 'react';

interface ChartArtifactProps {
  chartData: any;
  result?: string;
  isExpanded?: boolean;
  onSave?: (artifactData: any) => void;
}

/**
 * Component for rendering chart artifacts
 * Displays charts with farm-specific optimizations and save capabilities
 * Note: This is a placeholder implementation as the actual chart rendering
 * would depend on the chart library being used (e.g., Chart.js, D3, etc.)
 */
const ChartArtifact: React.FC<ChartArtifactProps> = ({
  chartData,
  result = '',
  isExpanded = true,
  onSave
}) => {
  const [expanded, setExpanded] = useState(isExpanded);
  const [chartType, setChartType] = useState<string>(() => {
    // Try to determine chart type from data
    if (typeof chartData === 'object' && chartData !== null) {
      if (chartData.type) return chartData.type;
      if (chartData.kind) return chartData.kind;
      if (chartData.chartType) return chartData.chartType;
    }
    return 'bar'; // Default to bar chart
  });

  // Parse the chart data with proper error handling
  const parseChartData = () => {
    try {
      if (typeof chartData === 'string') {
        return JSON.parse(chartData);
      }
      return chartData;
    } catch (error) {
      console.error('Failed to parse chart data:', error);
      return null;
    }
  };

  const parsedData = parseChartData();

  // Handle saving the chart data
  const handleSave = () => {
    if (onSave) {
      onSave({
        type: 'chart',
        chartType,
        data: parsedData,
        result,
        timestamp: new Date().toISOString()
      });
    }
  };

  // Generate a placeholder chart representation
  // In a real implementation, this would render an actual chart using a library
  const renderChartPlaceholder = () => {
    if (!parsedData) {
      return (
        <div className="flex items-center justify-center h-48 bg-theme-bg-tertiary rounded">
          <span className="text-theme-text-secondary">Invalid chart data</span>
        </div>
      );
    }

    // Extract labels and datasets for visualization
    const labels = parsedData.labels || [];
    const datasets = parsedData.datasets || [];
    
    return (
      <div className="p-4 bg-theme-bg-primary rounded border border-theme-sidebar-border">
        <div className="mb-2 font-medium text-theme-text-primary">
          {parsedData.title || 'Chart Visualization'}
        </div>
        
        {/* Chart type selector */}
        <div className="mb-4 flex">
          <label className="text-sm text-theme-text-secondary mr-2">Chart Type:</label>
          <select 
            value={chartType} 
            onChange={(e) => setChartType(e.target.value)}
            className="text-sm bg-theme-bg-secondary text-theme-text-primary border border-theme-sidebar-border rounded px-2"
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="pie">Pie Chart</option>
            <option value="scatter">Scatter Plot</option>
          </select>
        </div>
        
        {/* Chart visualization placeholder */}
        <div className="h-48 bg-theme-bg-secondary rounded border border-theme-sidebar-border p-2 flex items-center justify-center">
          <div className="text-sm text-theme-text-secondary text-center">
            Chart would be rendered here with {labels.length} data points across {datasets.length} datasets
            <br/>
            <span className="text-xs italic mt-1 block">
              (Actual chart implementation depends on the chart library being used)
            </span>
          </div>
        </div>
        
        {/* Legend placeholder */}
        {datasets.length > 0 && (
          <div className="mt-2 p-2 border-t border-theme-sidebar-border">
            <div className="text-xs text-theme-text-secondary mb-1">Legend:</div>
            <div className="flex flex-wrap gap-2">
              {datasets.map((dataset: any, index: number) => (
                <div key={index} className="flex items-center text-xs">
                  <div 
                    className="w-3 h-3 mr-1 rounded" 
                    style={{ 
                      backgroundColor: dataset.backgroundColor || 
                        `hsl(${(index * 137) % 360}, 70%, 50%)`
                    }}
                  />
                  <span className="text-theme-text-primary">{dataset.label || `Dataset ${index + 1}`}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render the chart component
  return (
    <div className="mb-4 border border-theme-sidebar-border rounded-md overflow-hidden bg-theme-bg-secondary">
      {/* Header with controls */}
      <div className="flex items-center justify-between px-4 py-2 bg-theme-bg-primary border-b border-theme-sidebar-border">
        <div className="flex items-center">
          <span className="font-medium text-theme-text-primary mr-2">
            Chart
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs px-2 py-1 rounded bg-theme-overlay-hover text-theme-text-secondary hover:bg-theme-overlay-active"
          >
            {expanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
        
        {onSave && (
          <button
            onClick={handleSave}
            className="text-xs px-2 py-1 rounded bg-theme-overlay-hover text-theme-text-secondary hover:bg-theme-overlay-active"
          >
            Save
          </button>
        )}
      </div>

      {/* Chart display */}
      {expanded && (
        <div className="p-4">
          {renderChartPlaceholder()}
          
          {/* Result or analysis text */}
          {result && (
            <div className="mt-4 p-3 bg-theme-bg-primary rounded border border-theme-sidebar-border text-sm text-theme-text-primary">
              <div className="font-medium mb-1">Analysis:</div>
              <div className="whitespace-pre-wrap">{result}</div>
            </div>
          )}
          
          {/* Farm-specific chart optimization notice */}
          <div className="mt-4 p-2 bg-theme-bg-tertiary rounded text-xs text-theme-text-secondary italic">
            Note: In a production environment, this component would use a chart library like Chart.js 
            or D3.js to render the actual chart visualization, with farm-specific color schemes and
            optimizations based on agricultural data patterns.
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartArtifact; 