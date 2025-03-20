import React, { useState } from 'react';
import { ConfigurationManagementProps, ConfigSetting } from './types';
import { Card, CardContent } from '../../../shared/ui/components/Card';
import { Button } from '../../../shared/ui/components/Button';
import { Input } from '../../../shared/ui/components/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../shared/ui/components/Tabs';
import { Badge } from '../../../shared/ui/components/Badge';
import {
  Settings,
  Save,
  RotateCcw,
  Upload,
  Download,
  Search,
  AlertCircle,
  CheckCircle,
  Edit,
  Eye,
  EyeOff
} from 'lucide-react';
import ConfigCategoryPanel from './ConfigCategoryPanel';

const ConfigurationManagement: React.FC<ConfigurationManagementProps> = ({
  categories,
  onSaveSetting,
  onResetToDefault,
  onImportConfig,
  onExportConfig,
  onTestConnection,
  isLoading = false
}) => {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.id || 'system');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editValues, setEditValues] = useState<Record<string, string | number | boolean>>({});
  
  // Initialize edit values from settings
  React.useEffect(() => {
    const initialValues: Record<string, string | number | boolean> = {};
    categories.forEach(category => {
      category.settings.forEach(setting => {
        initialValues[setting.id] = setting.value;
      });
    });
    setEditValues(initialValues);
  }, [categories]);
  
  // Filter categories and settings based on search term
  const filteredCategories = React.useMemo(() => {
    if (!searchTerm) return categories;
    
    return categories.map(category => ({
      ...category,
      settings: category.settings.filter(setting => 
        setting.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        setting.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(category => category.settings.length > 0);
  }, [categories, searchTerm]);
  
  // Handle save all changes
  const handleSaveAll = () => {
    Object.entries(editValues).forEach(([settingId, value]) => {
      // Find the original setting to check if value has changed
      const originalSetting = categories
        .flatMap(c => c.settings)
        .find(s => s.id === settingId);
        
      if (originalSetting && originalSetting.value !== value) {
        onSaveSetting(settingId, value);
      }
    });
    setEditMode(false);
  };
  
  // Handle cancel edit
  const handleCancelEdit = () => {
    // Reset to original values
    const originalValues: Record<string, string | number | boolean> = {};
    categories.forEach(category => {
      category.settings.forEach(setting => {
        originalValues[setting.id] = setting.value;
      });
    });
    setEditValues(originalValues);
    setEditMode(false);
  };
  
  // Handle value change for a setting
  const handleSettingChange = (settingId: string, value: string | number | boolean) => {
    setEditValues(prev => ({
      ...prev,
      [settingId]: value
    }));
  };
  
  // Handle file upload for import
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportConfig(file);
    }
  };
  
  return (
    <div className="configuration-management">
      {/* Header with search and action buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">
          Configuration Management
        </h2>
        
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search settings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-2 w-52 text-sm"
            />
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          {editMode ? (
            <>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={handleSaveAll}
                className="flex items-center"
              >
                <Save className="h-4 w-4 mr-1.5" />
                Save Changes
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCancelEdit}
                className="flex items-center"
              >
                <RotateCcw className="h-4 w-4 mr-1.5" />
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => setEditMode(true)}
                className="flex items-center"
              >
                <Edit className="h-4 w-4 mr-1.5" />
                Edit Settings
              </Button>
              <label className="cursor-pointer">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center"
                  asChild
                >
                  <span>
                    <Upload className="h-4 w-4 mr-1.5" />
                    Import
                  </span>
                </Button>
                <input 
                  type="file" 
                  accept=".json" 
                  className="hidden" 
                  onChange={handleFileUpload}
                />
              </label>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onExportConfig}
                className="flex items-center"
              >
                <Download className="h-4 w-4 mr-1.5" />
                Export
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Configuration Tabs */}
      <Tabs
        defaultValue={activeCategory}
        value={activeCategory}
        onValueChange={setActiveCategory}
        className="space-y-4"
      >
        <TabsList className="bg-blue-50 dark:bg-gray-800 p-1 rounded-lg">
          {filteredCategories.map(category => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 flex items-center"
            >
              {category.icon}
              <span className="ml-1.5">{category.name}</span>
              {category.settings.length > 0 && (
                <Badge variant="secondary" className="ml-1.5">
                  {category.settings.length}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {filteredCategories.map(category => (
          <TabsContent key={category.id} value={category.id} className="space-y-4">
            <ConfigCategoryPanel
              category={category}
              editMode={editMode}
              editValues={editValues}
              onValueChange={handleSettingChange}
              onResetToDefault={onResetToDefault}
              onTestConnection={onTestConnection}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ConfigurationManagement; 