import React, { useState, useEffect } from 'react';
import { artifactStorageService, SavedArtifact } from '../../services/ArtifactStorageService';
import ArtifactPanel from './ArtifactPanel';
import ArtifactRenderer from './ArtifactRenderer';
import { ContentTypes } from '../../types/librechat-types';

interface ArtifactBrowserProps {
  farmContext?: any;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Component for browsing and searching saved artifacts
 * Allows filtering by type, tags, and content
 */
const ArtifactBrowser: React.FC<ArtifactBrowserProps> = ({
  farmContext,
  isOpen,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [artifacts, setArtifacts] = useState<SavedArtifact[]>([]);
  const [selectedArtifact, setSelectedArtifact] = useState<SavedArtifact | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isDetailView, setIsDetailView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // Load artifacts on initial render
  useEffect(() => {
    if (isOpen) {
      loadArtifacts();
    }
  }, [isOpen]);

  // Load artifacts based on filters
  const loadArtifacts = async () => {
    setIsLoading(true);
    try {
      const results = await artifactStorageService.searchArtifacts(
        searchQuery,
        {
          types: typeFilter.length > 0 ? typeFilter : undefined,
          tags: tagFilter.length > 0 ? tagFilter : undefined,
          fieldId: farmContext?.currentField?.id,
          cropType: farmContext?.currentField?.cropType
        }
      );
      
      setArtifacts(results);
      
      // Extract all unique tags from the results
      const allTags = new Set<string>();
      results.forEach(artifact => {
        artifact.tags.forEach(tag => allTags.add(tag));
      });
      setAvailableTags(Array.from(allTags));
    } catch (error) {
      console.error('Failed to load artifacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadArtifacts();
  };

  // Toggle type filter
  const toggleTypeFilter = (type: string) => {
    setTypeFilter(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };

  // Toggle tag filter
  const toggleTagFilter = (tag: string) => {
    setTagFilter(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  // View artifact details
  const viewArtifactDetails = (artifact: SavedArtifact) => {
    setSelectedArtifact(artifact);
    setIsDetailView(true);
  };

  // Close detail view
  const closeDetailView = () => {
    setIsDetailView(false);
    setSelectedArtifact(null);
  };

  // Render a preview for different artifact types
  const renderArtifactPreview = (artifact: SavedArtifact) => {
    switch (artifact.type) {
      case 'image':
        return (
          <div className="h-32 flex items-center justify-center overflow-hidden bg-theme-bg-tertiary">
            <img 
              src={artifact.content?.dataUrl} 
              alt={artifact.content?.alt || 'Image'} 
              className="max-h-full max-w-full object-contain"
            />
          </div>
        );
      case 'code':
        return (
          <div className="h-32 overflow-hidden bg-theme-bg-tertiary">
            <div className="p-2 text-xs font-mono overflow-hidden text-theme-text-primary whitespace-pre">
              {artifact.content?.code?.substring(0, 200) || ''}
              {(artifact.content?.code?.length || 0) > 200 && '...'}
            </div>
          </div>
        );
      case 'chart':
        return (
          <div className="h-32 flex items-center justify-center overflow-hidden bg-theme-bg-tertiary">
            <div className="text-sm text-theme-text-secondary text-center">
              Chart: {artifact.title || 'Untitled Chart'}
            </div>
          </div>
        );
      case 'table':
        return (
          <div className="h-32 overflow-hidden bg-theme-bg-tertiary">
            <div className="p-2 text-xs overflow-hidden">
              <div className="font-medium mb-1">Table data:</div>
              <div className="text-theme-text-secondary">
                {artifact.content?.headers?.length || 0} columns, 
                {artifact.content?.rows?.length || 0} rows
              </div>
            </div>
          </div>
        );
      case 'text':
        return (
          <div className="h-32 overflow-hidden bg-theme-bg-tertiary">
            <div className="p-2 text-xs overflow-hidden text-theme-text-primary">
              {artifact.content?.text?.substring(0, 200) || ''}
              {(artifact.content?.text?.length || 0) > 200 && '...'}
            </div>
          </div>
        );
      default:
        return (
          <div className="h-32 flex items-center justify-center overflow-hidden bg-theme-bg-tertiary">
            <div className="text-sm text-theme-text-secondary text-center">
              {artifact.title || 'Unknown artifact type'}
            </div>
          </div>
        );
    }
  };

  // Convert SavedArtifact to TMessageContentParts for renderer
  const convertToMessageContent = (artifact: SavedArtifact) => {
    if (artifact.rawData) return artifact.rawData;
    
    // Create a basic message content part from the saved data
    switch (artifact.type) {
      case 'image':
        return {
          type: ContentTypes.IMAGE_FILE,
          [ContentTypes.IMAGE_FILE]: {
            filepath: artifact.content?.dataUrl,
            filename: artifact.title,
            width: artifact.dimensions?.width,
            height: artifact.dimensions?.height
          }
        };
      case 'text':
        return {
          type: ContentTypes.TEXT,
          text: artifact.content?.text
        };
      case 'code':
        return {
          type: ContentTypes.TOOL_CALL,
          [ContentTypes.TOOL_CALL]: {
            name: 'execute_code',
            language: artifact.content?.language,
            args: artifact.content?.code,
            output: artifact.content?.output
          }
        };
      case 'chart':
        return {
          type: ContentTypes.TOOL_CALL,
          [ContentTypes.TOOL_CALL]: {
            name: 'create_chart',
            args: artifact.content?.data,
            output: artifact.content?.result
          }
        };
      case 'table':
        return {
          type: ContentTypes.TOOL_CALL,
          [ContentTypes.TOOL_CALL]: {
            name: 'create_table',
            args: {
              headers: artifact.content?.headers,
              rows: artifact.content?.rows
            }
          }
        };
      default:
        return {
          type: ContentTypes.TEXT,
          text: JSON.stringify(artifact.content)
        };
    }
  };

  return (
    <>
      <div className={`fixed inset-0 z-40 bg-black bg-opacity-50 ${isOpen ? 'block' : 'hidden'}`}></div>
      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isOpen ? 'block' : 'hidden'}`}
      >
        <div className="bg-theme-bg-primary rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-theme-sidebar-border flex items-center justify-between">
            <h2 className="text-xl font-semibold text-theme-text-primary">Artifact Library</h2>
            <button
              onClick={onClose}
              className="p-1 text-theme-text-secondary hover:text-theme-text-primary"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Search and filters */}
          <div className="p-4 border-b border-theme-sidebar-border">
            <form onSubmit={handleSearch} className="flex items-center gap-2 mb-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search artifacts..."
                  className="w-full p-2 pr-10 border border-theme-sidebar-border rounded bg-theme-bg-secondary text-theme-text-primary"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-2 text-theme-text-secondary"
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
              
              <button
                type="button"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 border border-theme-sidebar-border rounded bg-theme-bg-secondary text-theme-text-primary"
                title={viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
              >
                {viewMode === 'grid' ? (
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                )}
              </button>
            </form>
            
            <div className="flex flex-wrap gap-2">
              <div className="mr-4">
                <span className="text-sm font-medium text-theme-text-secondary mr-2">Type:</span>
                {['image', 'code', 'table', 'chart', 'text'].map(type => (
                  <button
                    key={type}
                    onClick={() => toggleTypeFilter(type)}
                    className={`px-2 py-1 text-xs rounded mr-1 ${
                      typeFilter.includes(type)
                        ? 'bg-theme-primary text-white'
                        : 'bg-theme-bg-secondary text-theme-text-secondary border border-theme-sidebar-border'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              
              {availableTags.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-theme-text-secondary mr-2">Tags:</span>
                  <div className="inline-flex flex-wrap gap-1">
                    {availableTags.slice(0, 8).map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTagFilter(tag)}
                        className={`px-2 py-1 text-xs rounded ${
                          tagFilter.includes(tag)
                            ? 'bg-theme-primary text-white'
                            : 'bg-theme-bg-secondary text-theme-text-secondary border border-theme-sidebar-border'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                    {availableTags.length > 8 && (
                      <span className="text-xs text-theme-text-secondary">+{availableTags.length - 8} more</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Artifact list */}
          <div className="flex-1 overflow-auto p-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-theme-text-secondary">Loading artifacts...</div>
              </div>
            ) : artifacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64">
                <svg className="h-16 w-16 text-theme-text-secondary opacity-50 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div className="text-theme-text-secondary">No artifacts found</div>
                <p className="text-sm text-theme-text-tertiary mt-2">
                  Save artifacts from your AI chats to see them here
                </p>
              </div>
            ) : (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {artifacts.map(artifact => (
                    <div 
                      key={artifact.id}
                      className="border border-theme-sidebar-border rounded-md overflow-hidden bg-theme-bg-secondary cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => viewArtifactDetails(artifact)}
                    >
                      {renderArtifactPreview(artifact)}
                      <div className="p-3">
                        <h3 className="font-medium text-theme-text-primary truncate" title={artifact.title}>
                          {artifact.title}
                        </h3>
                        <div className="mt-1 flex justify-between items-center">
                          <span className="text-xs text-theme-text-secondary">
                            {new Date(artifact.timestamp).toLocaleDateString()}
                          </span>
                          <span className="text-xs bg-theme-bg-tertiary rounded px-2 py-0.5 text-theme-text-secondary">
                            {artifact.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <table className="w-full border-collapse">
                  <thead className="bg-theme-bg-secondary">
                    <tr>
                      <th className="text-left p-2 border-b border-theme-sidebar-border text-theme-text-primary">Title</th>
                      <th className="text-left p-2 border-b border-theme-sidebar-border text-theme-text-primary">Type</th>
                      <th className="text-left p-2 border-b border-theme-sidebar-border text-theme-text-primary">Tags</th>
                      <th className="text-left p-2 border-b border-theme-sidebar-border text-theme-text-primary">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {artifacts.map(artifact => (
                      <tr 
                        key={artifact.id}
                        className="hover:bg-theme-bg-tertiary cursor-pointer"
                        onClick={() => viewArtifactDetails(artifact)}
                      >
                        <td className="p-2 border-b border-theme-sidebar-border text-theme-text-primary">{artifact.title}</td>
                        <td className="p-2 border-b border-theme-sidebar-border text-theme-text-secondary">{artifact.type}</td>
                        <td className="p-2 border-b border-theme-sidebar-border">
                          <div className="flex flex-wrap gap-1">
                            {artifact.tags.slice(0, 3).map(tag => (
                              <span 
                                key={tag} 
                                className="text-xs bg-theme-bg-tertiary rounded px-1.5 py-0.5 text-theme-text-secondary"
                              >
                                {tag}
                              </span>
                            ))}
                            {artifact.tags.length > 3 && (
                              <span className="text-xs text-theme-text-tertiary">+{artifact.tags.length - 3}</span>
                            )}
                          </div>
                        </td>
                        <td className="p-2 border-b border-theme-sidebar-border text-theme-text-secondary">
                          {new Date(artifact.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}
          </div>
        </div>
      </div>
      
      {/* Detail view */}
      {selectedArtifact && (
        <ArtifactPanel
          isOpen={isDetailView}
          onClose={closeDetailView}
          title={selectedArtifact.title}
        >
          <div className="mb-4">
            <div className="flex flex-wrap gap-1 mb-2">
              {selectedArtifact.tags.map(tag => (
                <span 
                  key={tag} 
                  className="text-xs bg-theme-bg-tertiary rounded px-2 py-0.5 text-theme-text-secondary"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="text-sm text-theme-text-secondary mb-4">
              Created: {new Date(selectedArtifact.timestamp).toLocaleString()}
            </div>
            
            {selectedArtifact.description && (
              <div className="text-sm text-theme-text-primary mb-4">
                {selectedArtifact.description}
              </div>
            )}
          </div>
          
          <div className="border-t border-theme-sidebar-border pt-4">
            <ArtifactRenderer
              artifact={convertToMessageContent(selectedArtifact)}
              farmContext={farmContext}
            />
          </div>
        </ArtifactPanel>
      )}
    </>
  );
};

export default ArtifactBrowser; 