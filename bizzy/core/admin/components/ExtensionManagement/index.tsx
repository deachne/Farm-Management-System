import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/core/shared/ui/components/Card';
import { Button } from '@/core/shared/ui/components/Button';
import { Input } from '@/core/shared/ui/components/Input';
import { Badge } from '@/core/shared/ui/components/Badge';
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  RefreshCw, 
  Settings, 
  Package, 
  Shield, 
  AlertTriangle,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  FileText,
  Network,
  UsersIcon,
  Database
} from 'lucide-react';
import ExtensionCard from '../ExtensionCard';
import ExtensionConfigPanel from './ExtensionConfigPanel';
import AddExtensionModal from './AddExtensionModal';
import ExtensionPermissionsModal from './ExtensionPermissionsModal';
import { ExtensionManagementProps, Extension } from './types';

/**
 * Extension Management Component
 * 
 * Provides a comprehensive interface for managing extensions in the BizzyPerson platform.
 * Follows the same design patterns as Dashboard and User Management for consistency.
 */
const ExtensionManagement: React.FC<ExtensionManagementProps> = ({
  extensions = [],
  onAddExtension,
  onActivateExtension,
  onDeactivateExtension,
  onUninstallExtension,
  onUpdateExtension,
  onConfigureExtension,
  onManagePermissions,
}) => {
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredExtensions, setFilteredExtensions] = useState<Extension[]>(extensions);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  
  // State for modals and panels
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [selectedExtension, setSelectedExtension] = useState<Extension | null>(null);
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  
  // Advanced filters state
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterExtensions();
  };
  
  // Filter extensions based on search and filters
  const filterExtensions = () => {
    let filtered = [...extensions];
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(ext => 
        ext.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ext.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by status
    if (activeFilter !== 'all') {
      filtered = filtered.filter(ext => ext.status === activeFilter);
    }
    
    // Filter by category
    if (categoryFilter.length > 0) {
      filtered = filtered.filter(ext => 
        ext.categories?.some(category => categoryFilter.includes(category))
      );
    }
    
    setFilteredExtensions(filtered);
  };
  
  // Apply filters when dependencies change
  useEffect(() => {
    filterExtensions();
  }, [extensions, searchQuery, activeFilter, categoryFilter]);
  
  // Handle extension configuration
  const handleConfigure = (extension: Extension) => {
    setSelectedExtension(extension);
    setShowConfigPanel(true);
    if (onConfigureExtension) {
      onConfigureExtension(extension);
    }
  };
  
  // Handle permissions management
  const handleManagePermissions = (extension: Extension) => {
    setSelectedExtension(extension);
    setIsPermissionsModalOpen(true);
    if (onManagePermissions) {
      onManagePermissions(extension);
    }
  };
  
  // Get all unique categories from extensions
  const allCategories = Array.from(
    new Set(
      extensions
        .flatMap(ext => ext.categories || [])
        .filter(Boolean)
    )
  );
  
  // Toggle category in filter
  const toggleCategoryFilter = (category: string) => {
    if (categoryFilter.includes(category)) {
      setCategoryFilter(categoryFilter.filter(c => c !== category));
    } else {
      setCategoryFilter([...categoryFilter, category]);
    }
  };
  
  return (
    <div className="py-6 px-6 sm:px-8 lg:px-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Extension Management</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl">
            Manage your extensions, control permissions, and configure settings for all installed extensions.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-3">
          <Button 
            variant="primary" 
            onClick={() => setIsAddModalOpen(true)}
            className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm hover:shadow flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Extension
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.location.reload()}
            className="py-2 px-4 border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="mb-6">
        <Card className="border border-gray-200 dark:border-gray-700 rounded-lg">
          <CardContent className="p-5">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="Search extensions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
                />
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <div className="flex gap-2">
                <Button 
                  type="button"
                  variant={activeFilter === 'all' ? 'primary' : 'outline'}
                  onClick={() => setActiveFilter('all')}
                  className={`py-2 px-4 ${activeFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'}`}
                >
                  All
                </Button>
                <Button 
                  type="button"
                  variant={activeFilter === 'active' ? 'primary' : 'outline'}
                  onClick={() => setActiveFilter('active')}
                  className={`py-2 px-4 ${activeFilter === 'active' ? 'bg-green-600 text-white' : 'bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'}`}
                >
                  Active
                </Button>
                <Button 
                  type="button"
                  variant={activeFilter === 'inactive' ? 'primary' : 'outline'}
                  onClick={() => setActiveFilter('inactive')}
                  className={`py-2 px-4 ${activeFilter === 'inactive' ? 'bg-gray-600 text-white' : 'bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'}`}
                >
                  Inactive
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="py-2 px-4 border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {showAdvancedFilters ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
                </Button>
              </div>
            </form>
            
            {/* Advanced filters */}
            {showAdvancedFilters && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-3">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {allCategories.map((category) => (
                    <Badge
                      key={category}
                      variant={categoryFilter.includes(category) ? 'default' : 'outline'}
                      className={`cursor-pointer px-3 py-1.5 ${
                        categoryFilter.includes(category) 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                      }`}
                      onClick={() => toggleCategoryFilter(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Extensions List */}
      <div className="space-y-5">
        {filteredExtensions.length === 0 ? (
          <div className="text-center py-10 px-5 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
            <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No extensions found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
              {searchQuery || activeFilter !== 'all' || categoryFilter.length > 0
                ? "No extensions match your search criteria. Try adjusting your filters."
                : "You don't have any extensions installed yet."}
            </p>
            <Button 
              variant="primary" 
              onClick={() => setIsAddModalOpen(true)}
              className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Extension
            </Button>
          </div>
        ) : (
          filteredExtensions.map((extension) => (
            <div key={extension.id} className="relative bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-5 flex items-start justify-between">
                <div className="flex items-center">
                  <div className={`mr-4 p-3 rounded-lg ${extension.status === 'active' ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
                    <div className={`text-2xl ${extension.status === 'active' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
                      {extension.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{extension.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">v{extension.version}</p>
                    {extension.description && (
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 max-w-2xl">{extension.description}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {extension.status === 'active' ? (
                    <>
                      <Button 
                        variant="outline" 
                        onClick={() => onDeactivateExtension?.(extension)}
                        className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors text-sm"
                      >
                        Deactivate
                      </Button>
                      <Button 
                        variant="primary" 
                        onClick={() => handleConfigure(extension)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm hover:shadow text-white"
                      >
                        Configure
                      </Button>
                    </>
                  ) : (
                    <Button 
                      variant="outline" 
                      onClick={() => onActivateExtension?.(extension)}
                      className="px-3 py-1.5 border border-blue-500 dark:border-blue-600 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 transition-colors text-sm"
                    >
                      Activate
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => handleManagePermissions(extension)}
                    className="px-3 py-1.5 border border-blue-300 dark:border-blue-700 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-700 dark:text-blue-400 transition-colors text-sm"
                  >
                    <Shield className="h-3.5 w-3.5 mr-1.5" />
                    Permissions
                  </Button>
                  {extension.hasUpdate && (
                    <Button
                      variant="outline"
                      onClick={() => onUpdateExtension?.(extension)}
                      className="px-3 py-1.5 border border-orange-300 dark:border-orange-700 bg-transparent hover:bg-orange-50 dark:hover:bg-orange-900/20 text-orange-700 dark:text-orange-400 transition-colors text-sm"
                    >
                      <Download className="h-3.5 w-3.5 mr-1.5" />
                      Update
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => onUninstallExtension?.(extension)}
                    className="px-3 py-1.5 border border-red-300 dark:border-red-700 bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20 text-red-700 dark:text-red-400 transition-colors text-sm"
                  >
                    <X className="h-3.5 w-3.5 mr-1.5" />
                    Uninstall
                  </Button>
                </div>
              </div>
              
              <div className={`${extension.status === 'active' ? 'bg-gray-50 dark:bg-gray-800/70' : 'bg-gray-100 dark:bg-gray-800'} p-4 flex flex-wrap items-center gap-3 border-t border-gray-200 dark:border-gray-700`}>
                <div className="flex items-center gap-2">
                  {extension.permissions?.documentAccess ? (
                    <div className="flex items-center bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-md text-sm text-blue-700 dark:text-blue-300">
                      <FileText className="h-4 w-4 mr-1.5" />
                      Document Access
                    </div>
                  ) : (
                    <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-md text-sm text-gray-500 dark:text-gray-400 opacity-70">
                      <FileText className="h-4 w-4 mr-1.5" />
                      No Document Access
                    </div>
                  )}
                  
                  {extension.permissions?.searchAccess ? (
                    <div className="flex items-center bg-purple-50 dark:bg-purple-900/20 px-3 py-1.5 rounded-md text-sm text-purple-700 dark:text-purple-300">
                      <Search className="h-4 w-4 mr-1.5" />
                      Search Access
                    </div>
                  ) : (
                    <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-md text-sm text-gray-500 dark:text-gray-400 opacity-70">
                      <Search className="h-4 w-4 mr-1.5" />
                      No Search Access
                    </div>
                  )}
                  
                  {extension.permissions?.networkAccess ? (
                    <div className="flex items-center bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-md text-sm text-green-700 dark:text-green-300">
                      <Network className="h-4 w-4 mr-1.5" />
                      Network Access
                    </div>
                  ) : (
                    <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-md text-sm text-gray-500 dark:text-gray-400 opacity-70">
                      <Network className="h-4 w-4 mr-1.5" />
                      No Network Access
                    </div>
                  )}
                </div>
                
                <div className="ml-auto flex items-center space-x-4">
                  {extension.resources?.users && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50 px-3 py-1.5 rounded-md">
                      <UsersIcon className="h-4 w-4 mr-1.5 text-blue-500 dark:text-blue-400" />
                      <span className="font-medium">{extension.resources.users}</span> Users
                    </div>
                  )}
                  {extension.resources?.storage && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700/50 px-3 py-1.5 rounded-md">
                      <Database className="h-4 w-4 mr-1.5 text-blue-500 dark:text-blue-400" />
                      <span className="font-medium">{extension.resources.storage}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Configuration Panel */}
      {showConfigPanel && selectedExtension && (
        <ExtensionConfigPanel
          extension={selectedExtension}
          onClose={() => {
            setShowConfigPanel(false);
            setSelectedExtension(null);
          }}
        />
      )}
      
      {/* Add Extension Modal */}
      {isAddModalOpen && (
        <AddExtensionModal
          onClose={() => setIsAddModalOpen(false)}
          onAdd={(extension) => {
            onAddExtension?.(extension);
            setIsAddModalOpen(false);
          }}
        />
      )}
      
      {/* Permissions Modal */}
      {isPermissionsModalOpen && selectedExtension && (
        <ExtensionPermissionsModal
          extension={selectedExtension}
          onClose={() => {
            setIsPermissionsModalOpen(false);
            setSelectedExtension(null);
          }}
          onSave={(permissions) => {
            // Handle saving permissions
            setIsPermissionsModalOpen(false);
            setSelectedExtension(null);
          }}
        />
      )}
    </div>
  );
};

export default ExtensionManagement; 