import React, { useState } from 'react';
import { ConfigCategory, ConfigSetting } from './types';
import { Card, CardContent } from '../../../shared/ui/components/Card';
import { Button } from '../../../shared/ui/components/Button';
import { Input } from '../../../shared/ui/components/Input';
import { Badge } from '../../../shared/ui/components/Badge';
import {
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  ExternalLink
} from 'lucide-react';
import SettingField from './SettingField';

interface ConfigCategoryPanelProps {
  category: ConfigCategory;
  editMode: boolean;
  editValues: Record<string, string | number | boolean>;
  onValueChange: (settingId: string, value: string | number | boolean) => void;
  onResetToDefault: (settingId: string) => void;
  onTestConnection?: (categoryId: string) => Promise<boolean>;
}

const ConfigCategoryPanel: React.FC<ConfigCategoryPanelProps> = ({
  category,
  editMode,
  editValues,
  onValueChange,
  onResetToDefault,
  onTestConnection
}) => {
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<boolean | null>(null);
  
  const handleTestConnection = async () => {
    if (!onTestConnection) return;
    
    setIsTestingConnection(true);
    setTestResult(null);
    
    try {
      const result = await onTestConnection(category.id);
      setTestResult(result);
    } catch (error) {
      setTestResult(false);
    } finally {
      setIsTestingConnection(false);
      
      // Clear test result after 5 seconds
      setTimeout(() => {
        setTestResult(null);
      }, 5000);
    }
  };
  
  return (
    <Card className="overflow-hidden shadow-md border-2 border-blue-200 dark:border-blue-900 rounded-lg">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
              {category.icon}
              <span className="ml-2">{category.name}</span>
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {category.description}
            </p>
          </div>
          
          {category.id === 'integration' && onTestConnection && (
            <div className="flex items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestConnection}
                disabled={isTestingConnection}
                className="flex items-center mr-2"
              >
                <ExternalLink className="h-4 w-4 mr-1.5" />
                Test Connection
              </Button>
              
              {testResult !== null && (
                <Badge variant={testResult ? 'success' : 'destructive'}>
                  {testResult ? (
                    <span className="flex items-center">
                      <CheckCircle className="h-3.5 w-3.5 mr-1" />
                      Success
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <AlertCircle className="h-3.5 w-3.5 mr-1" />
                      Failed
                    </span>
                  )}
                </Badge>
              )}
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          {category.settings.map(setting => (
            <div 
              key={setting.id} 
              className="p-4 border-b border-gray-100 dark:border-gray-800 last:border-0"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                <div>
                  <div className="flex items-center">
                    <h4 className="font-medium text-gray-800 dark:text-white">
                      {setting.name}
                    </h4>
                    {setting.validation?.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                    {setting.description}
                  </p>
                </div>
                
                {editMode && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onResetToDefault(setting.id)}
                    className="h-8 px-2 text-xs flex items-center whitespace-nowrap"
                  >
                    <RotateCcw className="h-3.5 w-3.5 mr-1" />
                    Reset to Default
                  </Button>
                )}
              </div>
              
              <SettingField
                setting={setting}
                value={editValues[setting.id]}
                onChange={(value) => onValueChange(setting.id, value)}
                editMode={editMode}
              />
            </div>
          ))}
          
          {category.settings.length === 0 && (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              No settings found in this category.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfigCategoryPanel; 