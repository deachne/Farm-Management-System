import React, { useState, useEffect } from 'react';
import { useNotes } from '../hooks/useNotes';
import { Note } from '../types';
import { Tag, X, Plus, RefreshCw } from 'lucide-react';

interface TagCloudProps {
  tags: { tag: string; count: number; category?: string }[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
}

interface TagFilterProps {
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  onClearFilters: () => void;
  matchAllTags: boolean;
  onMatchAllToggle: () => void;
}

interface TagRelationshipProps {
  relatedTags: { tag: string; strength: number }[];
  onTagSelect: (tag: string) => void;
  selectedTags: string[];
}

interface TagManagementProps {
  allTags: { tag: string; count: number; category?: string }[];
  onTagRename: (oldTag: string, newTag: string) => void;
  onTagDelete: (tag: string) => void;
}

// Tag Cloud Visualization Component
export const TagCloud: React.FC<TagCloudProps> = ({ tags, selectedTags, onTagSelect }) => {
  // Calculate font size based on count
  const getTagSize = (count: number): string => {
    const minCount = Math.min(...tags.map(t => t.count));
    const maxCount = Math.max(...tags.map(t => t.count));
    const minSize = 0.75;
    const maxSize = 1.75;
    
    if (maxCount === minCount) return `${minSize}rem`;
    
    const sizeRange = maxSize - minSize;
    const countRange = maxCount - minCount;
    const size = minSize + (count - minCount) / countRange * sizeRange;
    
    return `${size}rem`;
  };
  
  return (
    <div className="tag-cloud p-4 bg-white rounded border mb-4">
      <h3 className="text-lg font-medium mb-3">Tag Cloud</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map(({ tag, count }) => (
          <button
            key={tag}
            onClick={() => onTagSelect(tag)}
            className={`px-3 py-1 rounded-full transition-all ${
              selectedTags.includes(tag) 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
            style={{ fontSize: getTagSize(count) }}
          >
            {tag} <span className="text-xs opacity-70">({count})</span>
          </button>
        ))}
        
        {tags.length === 0 && (
          <div className="text-gray-500 py-2">No tags available</div>
        )}
      </div>
    </div>
  );
};

// Tag Filter Component
export const TagFilter: React.FC<TagFilterProps> = ({ 
  selectedTags, 
  onTagSelect, 
  onClearFilters,
  matchAllTags,
  onMatchAllToggle
}) => {
  return (
    <div className="tag-filter p-4 bg-white rounded border mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium">Active Filters</h3>
        <div className="flex gap-2">
          <button
            onClick={onMatchAllToggle}
            className={`text-xs py-1 px-2 rounded ${
              matchAllTags ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
            }`}
          >
            Match All Tags
          </button>
          <button
            onClick={onClearFilters}
            className="text-xs py-1 px-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-800"
            disabled={selectedTags.length === 0}
          >
            Clear All
          </button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {selectedTags.map(tag => (
          <div 
            key={tag} 
            className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
          >
            <span>{tag}</span>
            <button 
              onClick={() => onTagSelect(tag)} 
              className="p-0.5 hover:bg-blue-200 rounded-full"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        
        {selectedTags.length === 0 && (
          <div className="text-gray-500 py-2">No active filters</div>
        )}
      </div>
    </div>
  );
};

// Tag Relationship Component
export const TagRelationship: React.FC<TagRelationshipProps> = ({ 
  relatedTags, 
  onTagSelect, 
  selectedTags 
}) => {
  return (
    <div className="tag-relationships p-4 bg-white rounded border mb-4">
      <h3 className="text-lg font-medium mb-3">Related Tags</h3>
      
      {selectedTags.length !== 1 ? (
        <div className="text-gray-500 py-2">
          Select exactly one tag to see related tags
        </div>
      ) : relatedTags.length === 0 ? (
        <div className="text-gray-500 py-2">
          No related tags found
        </div>
      ) : (
        <div className="space-y-2">
          {relatedTags.map(({ tag, strength }) => (
            <div key={tag} className="flex items-center">
              <div 
                className="h-2 bg-blue-500 rounded"
                style={{ width: `${strength * 100}%` }}
              />
              <button
                onClick={() => onTagSelect(tag)}
                className="ml-2 hover:text-blue-600"
              >
                {tag}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Tag Management Component
export const TagManagement: React.FC<TagManagementProps> = ({ 
  allTags, 
  onTagRename, 
  onTagDelete 
}) => {
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState('');
  
  const handleEditStart = (tag: string) => {
    setEditingTag(tag);
    setNewTagName(tag);
  };
  
  const handleSave = () => {
    if (editingTag && newTagName && newTagName !== editingTag) {
      onTagRename(editingTag, newTagName);
    }
    setEditingTag(null);
    setNewTagName('');
  };
  
  const handleCancel = () => {
    setEditingTag(null);
    setNewTagName('');
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };
  
  return (
    <div className="tag-management p-4 bg-white rounded border">
      <h3 className="text-lg font-medium mb-3">Manage Tags</h3>
      
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {allTags.map(({ tag, count }) => (
          <div key={tag} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
            {editingTag === tag ? (
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={handleKeyPress}
                className="border rounded px-2 py-1 w-full mr-2"
                autoFocus
              />
            ) : (
              <div className="flex items-center">
                <Tag size={16} className="mr-2 text-gray-500" />
                <span>{tag}</span>
                <span className="ml-2 text-xs text-gray-500">({count})</span>
              </div>
            )}
            
            <div className="flex items-center">
              {editingTag === tag ? (
                <>
                  <button 
                    onClick={handleSave}
                    className="p-1 text-green-600 hover:bg-green-50 rounded mr-1"
                  >
                    Save
                  </button>
                  <button 
                    onClick={handleCancel}
                    className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => handleEditStart(tag)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded mr-1"
                  >
                    Rename
                  </button>
                  <button 
                    onClick={() => onTagDelete(tag)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        
        {allTags.length === 0 && (
          <div className="text-gray-500 py-2">No tags available</div>
        )}
      </div>
    </div>
  );
};

// Main Tag View Component
export const TagView: React.FC<{
  onSelectNote: (noteId: string) => void;
}> = ({ onSelectNote }) => {
  const { notes, updateTag, deleteTag, getUserTags } = useNotes();
  const [allTags, setAllTags] = useState<{ tag: string; count: number; category?: string }[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [matchAllTags, setMatchAllTags] = useState<boolean>(false);
  const [relatedTags, setRelatedTags] = useState<{ tag: string; strength: number }[]>([]);
  const [activeSection, setActiveSection] = useState<'cloud' | 'relationships' | 'management'>('cloud');
  
  // Calculate all tags on mount or when notes change
  useEffect(() => {
    const userTags = getUserTags();
    const tagCounts = new Map<string, number>();
    
    // Count tag occurrences
    notes.forEach(note => {
      note.userTags.forEach(tag => {
        const currentCount = tagCounts.get(tag) || 0;
        tagCounts.set(tag, currentCount + 1);
      });
      
      // Include AI tags in counts
      note.aiTags.forEach(tag => {
        const currentCount = tagCounts.get(tag) || 0;
        tagCounts.set(tag, currentCount + 1);
      });
    });
    
    // Convert to array
    const tagsArray = Array.from(tagCounts.entries()).map(([tag, count]) => ({
      tag,
      count
    }));
    
    // Sort by count (descending)
    tagsArray.sort((a, b) => b.count - a.count);
    
    setAllTags(tagsArray);
  }, [notes, getUserTags]);
  
  // Filter notes when selected tags change
  useEffect(() => {
    if (selectedTags.length === 0) {
      setFilteredNotes(notes);
      setRelatedTags([]);
      return;
    }
    
    const filtered = notes.filter(note => {
      const noteTags = [...note.userTags, ...note.aiTags];
      
      if (matchAllTags) {
        // All selected tags must be present
        return selectedTags.every(tag => noteTags.includes(tag));
      } else {
        // At least one selected tag must be present
        return selectedTags.some(tag => noteTags.includes(tag));
      }
    });
    
    setFilteredNotes(filtered);
    
    // Calculate related tags if exactly one tag is selected
    if (selectedTags.length === 1) {
      calculateRelatedTags(selectedTags[0]);
    } else {
      setRelatedTags([]);
    }
  }, [notes, selectedTags, matchAllTags]);
  
  // Calculate related tags (tags that commonly appear together)
  const calculateRelatedTags = (tag: string) => {
    const relatedTagsMap = new Map<string, number>();
    
    // Find notes with the selected tag
    const notesWithTag = notes.filter(note => 
      [...note.userTags, ...note.aiTags].includes(tag)
    );
    
    const totalNotesWithTag = notesWithTag.length;
    if (totalNotesWithTag === 0) {
      setRelatedTags([]);
      return;
    }
    
    // Count co-occurrences of other tags
    notesWithTag.forEach(note => {
      const allTags = [...note.userTags, ...note.aiTags];
      
      allTags.forEach(noteTag => {
        if (noteTag !== tag) {
          const currentCount = relatedTagsMap.get(noteTag) || 0;
          relatedTagsMap.set(noteTag, currentCount + 1);
        }
      });
    });
    
    // Convert to array and calculate relationship strength
    const related = Array.from(relatedTagsMap.entries())
      .map(([relatedTag, count]) => ({
        tag: relatedTag,
        strength: count / totalNotesWithTag // 0-1 relationship strength
      }))
      .sort((a, b) => b.strength - a.strength)
      .slice(0, 10); // Limit to top 10 related tags
    
    setRelatedTags(related);
  };
  
  // Handle tag selection (toggle selection)
  const handleTagSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      // Remove tag
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      // Add tag
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  // Clear all tag filters
  const handleClearFilters = () => {
    setSelectedTags([]);
  };
  
  // Toggle match all tags mode
  const handleMatchAllToggle = () => {
    setMatchAllTags(!matchAllTags);
  };
  
  // Handle tag rename
  const handleTagRename = (oldTag: string, newTag: string) => {
    // Update in service
    updateTag(oldTag, newTag);
    
    // Update selected tags if the renamed tag was selected
    if (selectedTags.includes(oldTag)) {
      setSelectedTags(selectedTags.map(tag => tag === oldTag ? newTag : tag));
    }
  };
  
  // Handle tag delete
  const handleTagDelete = (tag: string) => {
    // Delete from service
    deleteTag(tag);
    
    // Remove from selected tags if present
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    }
  };
  
  return (
    <div className="tag-view p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          {/* Left sidebar with tag organization tools */}
          <div className="mb-4">
            <div className="flex border-b mb-4">
              <button
                className={`py-2 px-4 ${activeSection === 'cloud' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                onClick={() => setActiveSection('cloud')}
              >
                Tag Cloud
              </button>
              <button
                className={`py-2 px-4 ${activeSection === 'relationships' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                onClick={() => setActiveSection('relationships')}
              >
                Related
              </button>
              <button
                className={`py-2 px-4 ${activeSection === 'management' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
                onClick={() => setActiveSection('management')}
              >
                Manage
              </button>
            </div>
            
            {/* Tag Filter always visible */}
            <TagFilter
              selectedTags={selectedTags}
              onTagSelect={handleTagSelect}
              onClearFilters={handleClearFilters}
              matchAllTags={matchAllTags}
              onMatchAllToggle={handleMatchAllToggle}
            />
            
            {/* Conditional view based on active section */}
            {activeSection === 'cloud' && (
              <TagCloud
                tags={allTags}
                selectedTags={selectedTags}
                onTagSelect={handleTagSelect}
              />
            )}
            
            {activeSection === 'relationships' && (
              <TagRelationship
                relatedTags={relatedTags}
                onTagSelect={handleTagSelect}
                selectedTags={selectedTags}
              />
            )}
            
            {activeSection === 'management' && (
              <TagManagement
                allTags={allTags}
                onTagRename={handleTagRename}
                onTagDelete={handleTagDelete}
              />
            )}
          </div>
        </div>
        
        <div className="lg:col-span-2">
          {/* Right side with filtered notes */}
          <div className="bg-white rounded border p-4 mb-4">
            <h2 className="text-xl font-medium mb-2">
              {selectedTags.length > 0 
                ? `Notes with ${matchAllTags ? 'all' : 'any'} selected tags` 
                : 'All Notes'}
            </h2>
            <div className="text-sm text-gray-500 mb-4">
              {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'} found
            </div>
            
            {/* Notes list */}
            <div className="space-y-4">
              {filteredNotes.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  No notes found matching the selected tags
                </div>
              ) : (
                filteredNotes.map(note => (
                  <div 
                    key={note.id} 
                    className="p-4 border rounded cursor-pointer hover:bg-gray-50"
                    onClick={() => onSelectNote(note.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-medium text-gray-900">{note.noteType || 'Note'}</div>
                      <div className="text-sm text-gray-500">
                        {note.dateStamp ? new Date(note.dateStamp).toLocaleDateString() : 
                          new Date(note.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="mt-2 text-gray-700">
                      {note.content.length > 120 ? `${note.content.substring(0, 120)}...` : note.content}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {note.userTags.map(tag => (
                        <span 
                          key={`user-${tag}`} 
                          className={`px-2 py-1 text-xs rounded-full cursor-pointer ${
                            selectedTags.includes(tag) 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTagSelect(tag);
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                      {note.aiTags.map(tag => (
                        <span 
                          key={`ai-${tag}`} 
                          className={`px-2 py-1 text-xs rounded-full cursor-pointer ${
                            selectedTags.includes(tag) 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTagSelect(tag);
                          }}
                        >
                          {tag} <span className="text-xs opacity-70">AI</span>
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagView; 