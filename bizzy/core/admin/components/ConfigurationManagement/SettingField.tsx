import React, { useState } from 'react';
import { ConfigSetting } from './types';
import { Input } from '../../../shared/ui/components/Input';
import { Button } from '../../../shared/ui/components/Button';
import { Eye, EyeOff } from 'lucide-react';

interface SettingFieldProps {
  setting: ConfigSetting;
  value: string | number | boolean;
  onChange: (value: string | number | boolean) => void;
  editMode: boolean;
}

const SettingField: React.FC<SettingFieldProps> = ({
  setting,
  value,
  onChange,
  editMode
}) => {
  const [showPassword, setShowPassword] = useState(false);
  
  // Handle rendering based on setting type
  const renderField = () => {
    // If not in edit mode, render as read-only
    if (!editMode) {
      // For password, show masked value
      if (setting.type === 'password') {
        return (
          <div className="bg-gray-50 dark:bg-gray-800 py-2 px-3 rounded-md text-gray-500 dark:text-gray-400">
            ••••••••••••
          </div>
        );
      }
      
      // For boolean, show Yes/No
      if (setting.type === 'boolean') {
        return (
          <div className="bg-gray-50 dark:bg-gray-800 py-2 px-3 rounded-md text-gray-500 dark:text-gray-400">
            {value ? 'Yes' : 'No'}
          </div>
        );
      }
      
      // For select, show selected option
      if (setting.type === 'select' && setting.options) {
        return (
          <div className="bg-gray-50 dark:bg-gray-800 py-2 px-3 rounded-md text-gray-500 dark:text-gray-400">
            {String(value)}
          </div>
        );
      }
      
      // For text and number, show the value
      return (
        <div className="bg-gray-50 dark:bg-gray-800 py-2 px-3 rounded-md text-gray-500 dark:text-gray-400">
          {String(value)}
        </div>
      );
    }
    
    // In edit mode, render editable fields
    switch (setting.type) {
      case 'boolean':
        return (
          <select
            value={value ? 'true' : 'false'}
            onChange={(e) => onChange(e.target.value === 'true')}
            className="w-full rounded-md py-2 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        );
        
      case 'number':
        return (
          <Input
            type="number"
            value={value as number}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full"
            min={setting.validation?.min}
            max={setting.validation?.max}
            required={setting.validation?.required}
          />
        );
        
      case 'select':
        if (setting.options) {
          return (
            <select
              value={value as string}
              onChange={(e) => onChange(e.target.value)}
              className="w-full rounded-md py-2 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              required={setting.validation?.required}
            >
              {setting.options.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          );
        }
        return null;
        
      case 'password':
        return (
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              value={value as string}
              onChange={(e) => onChange(e.target.value)}
              className="w-full pr-10"
              required={setting.validation?.required}
              pattern={setting.validation?.pattern}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-500" />
              ) : (
                <Eye className="h-4 w-4 text-gray-500" />
              )}
            </Button>
          </div>
        );
        
      case 'text':
      default:
        return (
          <Input
            type="text"
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            className="w-full"
            required={setting.validation?.required}
            pattern={setting.validation?.pattern}
          />
        );
    }
  };
  
  return (
    <div className="mt-2">
      {renderField()}
    </div>
  );
};

export default SettingField; 