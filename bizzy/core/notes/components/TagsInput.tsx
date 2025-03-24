import React, { useState, KeyboardEvent } from 'react';
import { TagSelector } from './TagSelector';
import { Plus } from 'lucide-react';

interface TagsInputProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  availableTags: string[];
}

/**
 * Component for managing a collection of tags with add/remove capabilities
 */
export const TagsInput: React.FC<TagsInputProps> = ({
  tags,
  onAddTag,
  onRemoveTag,
  availableTags,
}) => {
  const [newTagValue, setNewTagValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Filter available tags based on input
  const filteredSuggestions = availableTags.filter(tag => 
    tag.toLowerCase().includes(newTagValue.toLowerCase()) && 
    !tags.includes(tag)
  ).slice(0, 5); // Limit to 5 suggestions
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTagValue(e.target.value);
    setShowSuggestions(true);
  };
  
  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTagValue.trim()) {
      e.preventDefault();
      onAddTag(newTagValue.trim());
      setNewTagValue('');
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };
  
  const handleAddTag = (tag: string) => {
    onAddTag(tag);
    setNewTagValue('');
    setShowSuggestions(false);
  };
  
  return (
    <div className="tags-input">
      {/* Display existing tags */}
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map(tag => (
          <TagSelector
            key={tag}
            tag={tag}
            onRemove={onRemoveTag}
          />
        ))}
      </div>
      
      {/* Input for new tag */}
      <div className="relative">
        <div className="flex">
          <input
            type="text"
            value={newTagValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Add a tag..."
            className="w-full px-3 py-1 text-sm border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="button"
            onClick={() => newTagValue.trim() && handleAddTag(newTagValue.trim())}
            className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center"
          >
            <Plus size={16} />
          </button>
        </div>
        
        {/* Tag suggestions */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded shadow-lg">
            {filteredSuggestions.map(tag => (
              <button
                key={tag}
                onClick={() => handleAddTag(tag)}
                className="block w-full text-left px-3 py-1 text-sm hover:bg-blue-50"
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TagsInput; 