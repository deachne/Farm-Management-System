import React, { useState } from 'react';
import { Card, CardContent } from '@/core/shared/ui/components/Card';
import { Button } from '@/core/shared/ui/components/Button';
import { Input } from '@/core/shared/ui/components/Input';
import { Extension } from './types';
import { X, Upload, Search, Package, ExternalLink } from 'lucide-react';

interface AddExtensionModalProps {
  onClose: () => void;
  onAdd: (extension: Extension) => void;
}

/**
 * Add Extension Modal
 * 
 * Provides a modal interface for browsing and installing new extensions.
 */
const AddExtensionModal: React.FC<AddExtensionModalProps> = ({
  onClose,
  onAdd
}) => {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'marketplace' | 'upload'>('marketplace');
  const [selectedExtension, setSelectedExtension] = useState<Extension | null>(null);
  
  // Sample marketplace extensions
  const sampleExtensions: Extension[] = [
    {
      id: 'extension-marketplace-1',
      name: 'Crop Analysis',
      version: '1.0.2',
      description: 'Analyze crop data and provide recommendations',
      status: 'inactive',
      categories: ['agriculture', 'analytics'],
      icon: <span className="text-green-500">🌱</span>
    },
    {
      id: 'extension-marketplace-2',
      name: 'Weather Integration',
      version: '2.1.0',
      description: 'Integrate weather data for location-based forecasting',
      status: 'inactive',
      categories: ['weather', 'forecasting'],
      icon: <span className="text-blue-500">☁️</span>
    },
    {
      id: 'extension-marketplace-3',
      name: 'Equipment Tracker',
      version: '1.3.5',
      description: 'Track farm equipment maintenance and usage',
      status: 'inactive',
      categories: ['equipment', 'maintenance'],
      icon: <span className="text-yellow-500">🚜</span>
    }
  ];
  
  // Filter extensions based on search
  const filteredExtensions = searchQuery 
    ? sampleExtensions.filter(ext => 
        ext.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ext.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ext.categories?.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : sampleExtensions;
  
  // Handle extension selection
  const handleSelectExtension = (extension: Extension) => {
    setSelectedExtension(extension);
  };
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };
  
  // Handle install
  const handleInstall = () => {
    if (selectedExtension) {
      onAdd(selectedExtension);
    }
  };
  
  // Handle URL install
  const handleUrlInstall = () => {
    if (uploadUrl) {
      // In a real implementation, this would validate and fetch the extension data
      const mockExtension: Extension = {
        id: `extension-url-${Date.now()}`,
        name: 'Custom Extension',
        version: '1.0.0',
        description: `Installed from URL: ${uploadUrl}`,
        status: 'inactive'
      };
      onAdd(mockExtension);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-blue-50 dark:bg-blue-900/20">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <Package className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            Add Extension
          </h2>
          <button 
            onClick={onClose}
            className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex">
            <button
              className={`px-4 py-3 font-medium text-sm flex items-center ${
                activeTab === 'marketplace' 
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('marketplace')}
            >
              <Package className="h-4 w-4 mr-2" />
              Extension Marketplace
            </button>
            <button
              className={`px-4 py-3 font-medium text-sm flex items-center ${
                activeTab === 'upload' 
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('upload')}
            >
              <Upload className="h-4 w-4 mr-2" />
              Install from URL
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {activeTab === 'marketplace' ? (
            <>
              {/* Marketplace tab */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search extensions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                  />
                  <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </form>
              
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {filteredExtensions.length === 0 ? (
                  <div className="text-center py-8 px-4">
                    <Package className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">No extensions found matching your search.</p>
                  </div>
                ) : (
                  filteredExtensions.map((extension) => (
                    <Card 
                      key={extension.id}
                      className={`border ${
                        selectedExtension?.id === extension.id 
                          ? 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-gray-200 dark:border-gray-700'
                      } rounded-lg hover:shadow-md transition-shadow cursor-pointer`}
                      onClick={() => handleSelectExtension(extension)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start">
                          <div className="mr-3 p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                            {extension.icon || <Package className="h-5 w-5 text-gray-500 dark:text-gray-400" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-sm font-medium text-gray-900 dark:text-white">{extension.name}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">v{extension.version}</p>
                              </div>
                              {extension.categories && extension.categories.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {extension.categories.map((category) => (
                                    <span 
                                      key={category}
                                      className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
                                    >
                                      {category}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            {extension.description && (
                              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{extension.description}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </>
          ) : (
            <>
              {/* Install from URL tab */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Enter the URL of an extension package to install it. The URL should point to a valid extension package file.
                </p>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="extension-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Extension URL
                    </label>
                    <div className="relative">
                      <Input
                        id="extension-url"
                        type="url"
                        placeholder="https://example.com/extensions/my-extension.zip"
                        value={uploadUrl}
                        onChange={(e) => setUploadUrl(e.target.value)}
                        className="w-full pl-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                      />
                      <ExternalLink className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-4 bg-gray-50 dark:bg-gray-800">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </Button>
          {activeTab === 'marketplace' ? (
            <Button 
              variant="primary" 
              onClick={handleInstall}
              disabled={!selectedExtension}
              className={`px-4 py-2 ${
                selectedExtension 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-blue-400 cursor-not-allowed'
              } text-white transition-colors`}
            >
              Install Extension
            </Button>
          ) : (
            <Button 
              variant="primary" 
              onClick={handleUrlInstall}
              disabled={!uploadUrl}
              className={`px-4 py-2 ${
                uploadUrl 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-blue-400 cursor-not-allowed'
              } text-white transition-colors`}
            >
              Install from URL
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddExtensionModal; 