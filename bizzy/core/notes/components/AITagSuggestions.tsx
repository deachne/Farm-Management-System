import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, RefreshCw } from 'lucide-react';
import { useNotes } from '../hooks/useNotes';

interface AITagSuggestionsProps {
  content: string;
  existingTags: string[];
  onAddTag: (tag: string) => void;
  noteId?: string;
  isEnabled?: boolean;
  maxSuggestions?: number;
}

export const AITagSuggestions: React.FC<AITagSuggestionsProps> = ({
  content,
  existingTags,
  onAddTag,
  noteId,
  isEnabled = true,
  maxSuggestions = 5
}) => {
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAnalyzedContent, setLastAnalyzedContent] = useState('');
  
  const { getTagRecommendations, recordTagFeedback } = useNotes();
  
  // Analyze text for tag suggestions
  const analyzeTags = async () => {
    if (!content || content.trim().length < 10 || !noteId) {
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Use the service to get tag recommendations
      const recommendations = await getTagRecommendations(noteId, maxSuggestions);
      
      // Filter out tags that already exist
      const newTags = recommendations.filter(tag => !existingTags.includes(tag));
      
      setSuggestedTags(newTags);
      setLastAnalyzedContent(content);
    } catch (err) {
      setError('Failed to analyze text for tags');
      console.error('Tag analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Handle adding a tag and record feedback
  const handleAddTag = (tag: string) => {
    onAddTag(tag);
    
    // Record that the tag was accepted
    if (noteId) {
      recordTagFeedback(noteId, tag, true);
    }
    
    // Remove the tag from suggestions
    setSuggestedTags(prev => prev.filter(t => t !== tag));
  };
  
  // Auto-analyze text when content changes, with debounce
  useEffect(() => {
    if (!isEnabled || !content || content.trim().length < 10 || !noteId) {
      return;
    }
    
    // Skip if content hasn't changed enough
    if (lastAnalyzedContent && 
        Math.abs(content.length - lastAnalyzedContent.length) < 20) {
      return;
    }
    
    const debounceTimeout = setTimeout(() => {
      analyzeTags();
    }, 1000); // 1 second debounce
    
    return () => clearTimeout(debounceTimeout);
  }, [content, existingTags, isEnabled, noteId]);
  
  // If disabled, no content, or no noteId, don't render anything
  if (!isEnabled || !content || content.trim().length < 10 || !noteId) {
    return null;
  }
  
  return (
    <div className="ai-tag-suggestions mt-4">
      <div className="flex items-center mb-2">
        <Sparkles size={16} className="text-purple-500 mr-1" />
        <h3 className="text-sm font-medium text-gray-700">
          AI Tag Suggestions
        </h3>
        <button 
          onClick={analyzeTags}
          className="ml-auto p-1 text-xs text-gray-500 hover:text-gray-700 flex items-center"
          disabled={isAnalyzing}
        >
          <RefreshCw size={14} className={`mr-1 ${isAnalyzing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>
      
      {error && (
        <div className="text-xs text-red-500 mb-2">
          {error}
        </div>
      )}
      
      <div className="flex flex-wrap gap-1">
        {isAnalyzing ? (
          <div className="text-xs text-gray-500 py-1">
            Analyzing text...
          </div>
        ) : suggestedTags.length > 0 ? (
          suggestedTags.map(tag => (
            <button
              key={tag}
              onClick={() => handleAddTag(tag)}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full hover:bg-purple-200"
            >
              <Plus size={12} />
              {tag}
            </button>
          ))
        ) : (
          <div className="text-xs text-gray-500 py-1">
            No suggestions available
          </div>
        )}
      </div>
    </div>
  );
};

export default AITagSuggestions; 