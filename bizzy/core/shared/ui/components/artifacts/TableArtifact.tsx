import React, { useState } from 'react';

interface TableArtifactProps {
  tableData: any; // Can be array of arrays or object with headers and rows
  isExpanded?: boolean;
  onSave?: (artifactData: any) => void;
  farmContext?: any;
}

/**
 * Component for rendering table artifacts with farm-specific enhancements
 * Provides agricultural context-aware display of tabular data
 */
const TableArtifact: React.FC<TableArtifactProps> = ({
  tableData,
  isExpanded = true,
  onSave,
  farmContext
}) => {
  const [expanded, setExpanded] = useState(isExpanded);
  const [sortConfig, setSortConfig] = useState<{ key: string | number, direction: 'ascending' | 'descending' } | null>(null);

  // Parse and normalize table data to a consistent format
  const processTableData = () => {
    let headers: string[] = [];
    let rows: any[][] = [];

    if (Array.isArray(tableData)) {
      // Handle array of arrays format
      if (tableData.length > 0) {
        if (Array.isArray(tableData[0])) {
          // First row is headers
          headers = tableData[0].map((header, index) => header?.toString() || `Column ${index + 1}`);
          rows = tableData.slice(1);
        } else {
          // It's an array of objects
          const sampleObj = tableData[0];
          headers = Object.keys(sampleObj);
          rows = tableData.map(item => headers.map(key => item[key]));
        }
      }
    } else if (typeof tableData === 'object' && tableData !== null) {
      // Handle object format with headers and rows properties
      if (tableData.headers && Array.isArray(tableData.headers)) {
        headers = tableData.headers.map((header: any, index: number) => header?.toString() || `Column ${index + 1}`);
      }
      
      if (tableData.rows && Array.isArray(tableData.rows)) {
        rows = tableData.rows;
      } else if (tableData.data && Array.isArray(tableData.data)) {
        rows = tableData.data;
      }
    }

    return { headers, rows };
  };

  const { headers, rows } = processTableData();

  // Sorting functionality
  const sortedRows = React.useMemo(() => {
    let sortableRows = [...rows];
    if (sortConfig !== null) {
      sortableRows.sort((a, b) => {
        const colIndex = typeof sortConfig.key === 'string' 
          ? headers.indexOf(sortConfig.key)
          : sortConfig.key;
          
        if (colIndex === -1) return 0;
        
        const aValue = a[colIndex];
        const bValue = b[colIndex];
        
        // Handle different data types for sorting
        if (aValue === bValue) return 0;
        if (aValue === undefined || aValue === null) return 1;
        if (bValue === undefined || bValue === null) return -1;
        
        // Try numeric comparison first
        const aNum = Number(aValue);
        const bNum = Number(bValue);
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return sortConfig.direction === 'ascending' ? aNum - bNum : bNum - aNum;
        }
        
        // Fallback to string comparison
        const aStr = String(aValue);
        const bStr = String(bValue);
        
        return sortConfig.direction === 'ascending'
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr);
      });
    }
    return sortableRows;
  }, [rows, sortConfig, headers]);

  // Request sort based on column
  const requestSort = (key: string | number) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (
      sortConfig && 
      sortConfig.key === key && 
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Handle saving the table data
  const handleSave = () => {
    if (onSave) {
      onSave({
        type: 'table',
        headers,
        rows,
        sortState: sortConfig,
        timestamp: new Date().toISOString(),
        farmContext: farmContext ? {
          fieldId: farmContext.currentField?.id,
          cropType: farmContext.currentField?.cropType
        } : undefined
      });
    }
  };

  // Check if the table has farm-specific data to enhance
  const hasFarmData = () => {
    if (!farmContext) return false;
    
    // Check for likely farm-related headers
    const farmHeaders = ['field', 'crop', 'yield', 'harvest', 'plant', 'soil', 'moisture', 'fertilizer'];
    return headers.some(header => 
      farmHeaders.some(farmTerm => 
        header.toLowerCase().includes(farmTerm.toLowerCase())
      )
    );
  };
  
  // Apply farm-specific styling or highlighting based on values
  const getCellStyle = (header: string, value: any) => {
    if (!farmContext) return '';
    
    // Add contextual styling based on header and value
    const headerLower = header.toLowerCase();
    
    if (headerLower.includes('yield')) {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        if (numValue > (farmContext.benchmarks?.highYield || 0)) 
          return 'bg-green-100 dark:bg-green-900 dark:bg-opacity-30';
        if (numValue < (farmContext.benchmarks?.lowYield || 0)) 
          return 'bg-red-100 dark:bg-red-900 dark:bg-opacity-30';
      }
    }
    
    if (headerLower.includes('moisture')) {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        const cropType = farmContext.currentField?.cropType || '';
        const optimalMoisture = farmContext.moistureTargets?.[cropType] || 0;
        
        if (Math.abs(numValue - optimalMoisture) < 5) 
          return 'bg-green-100 dark:bg-green-900 dark:bg-opacity-30';
        if (Math.abs(numValue - optimalMoisture) > 15) 
          return 'bg-red-100 dark:bg-red-900 dark:bg-opacity-30';
      }
    }
    
    return '';
  };

  // If we have no valid data, show a placeholder
  if (headers.length === 0 || rows.length === 0) {
    return (
      <div className="p-4 text-theme-text-secondary italic border border-theme-sidebar-border rounded-md bg-theme-bg-primary">
        No table data available
      </div>
    );
  }

  return (
    <div className="mb-4 border border-theme-sidebar-border rounded-md overflow-hidden bg-theme-bg-secondary">
      {/* Header with controls */}
      <div className="flex items-center justify-between px-4 py-2 bg-theme-bg-primary border-b border-theme-sidebar-border">
        <div className="flex items-center">
          <span className="font-medium text-theme-text-primary mr-2">
            Table {hasFarmData() ? '(Farm Data)' : ''}
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

      {/* Table display */}
      {expanded && (
        <div className="overflow-auto max-h-[500px]">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-theme-bg-primary border-b border-theme-sidebar-border">
              <tr>
                {headers.map((header, index) => (
                  <th 
                    key={index}
                    onClick={() => requestSort(header)} 
                    className="px-4 py-2 text-left font-medium text-theme-text-primary cursor-pointer hover:bg-theme-overlay-hover"
                  >
                    <div className="flex items-center space-x-1">
                      <span>{header}</span>
                      {sortConfig?.key === header && (
                        <span>
                          {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((row, rowIndex) => (
                <tr 
                  key={rowIndex}
                  className={rowIndex % 2 === 0 ? 'bg-theme-bg-secondary' : 'bg-theme-bg-primary'}
                >
                  {row.map((cell, cellIndex) => (
                    <td 
                      key={cellIndex}
                      className={`px-4 py-2 border-t border-theme-sidebar-border text-theme-text-primary ${getCellStyle(headers[cellIndex], cell)}`}
                    >
                      {cell?.toString() || ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TableArtifact; 