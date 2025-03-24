import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, RefreshCw } from 'lucide-react';

// Mock AI tag analysis service - in a real implementation, this would be a call to an AI service
const analyzeTextForTags = async (text: string): Promise<string[]> => {
  // Simulating API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Very basic tag extraction - this would be replaced by actual AI analysis
  const keywords = [
    { word: 'field', tag: 'field' },
    { word: 'corn', tag: 'corn' },
    { word: 'soybean', tag: 'soybeans' },
    { word: 'fertilizer', tag: 'fertilizer' },
    { word: 'irrigation', tag: 'irrigation' },
    { word: 'weather', tag: 'weather' },
    { word: 'rain', tag: 'weather' },
    { word: 'storm', tag: 'weather' },
    { word: 'dry', tag: 'drought' },
    { word: 'wet', tag: 'moisture' },
    { word: 'tractor', tag: 'equipment' },
    { word: 'machinery', tag: 'equipment' },
    { word: 'harvest', tag: 'harvest' },
    { word: 'plant', tag: 'planting' },
    { word: 'disease', tag: 'crop-health' },
    { word: 'pest', tag: 'pest-management' },
    { word: 'insect', tag: 'pest-management' },
    { word: 'weed', tag: 'weed-control' },
    { word: 'spray', tag: 'application' },
    { word: 'price', tag: 'market' },
    { word: 'cost', tag: 'financial' },
    { word: 'budget', tag: 'financial' },
    { word: 'soil', tag: 'soil' },
    { word: 'nutrient', tag: 'nutrients' },
    { word: 'nitrogen', tag: 'nutrients' },
    { word: 'phosphorus', tag: 'nutrients' },
    { word: 'potassium', tag: 'nutrients' },
    { word: 'water', tag: 'water-management' },
    { word: 'temperature', tag: 'climate' },
    { word: 'crop', tag: 'crops' }
  ];
  
  // Convert text to lowercase for case-insensitive matching
  const lowercaseText = text.toLowerCase();
  
  // Extract tags based on keyword presence
  const tags = new Set<string>();
  
  keywords.forEach(({ word, tag }) => {
    if (lowercaseText.includes(word)) {
      tags.add(tag);
    }
  });
  
  return Array.from(tags);
};

interface AITagSuggestionsProps {
  content: string;
  existingTags: string[];
  onAddTag: (tag: string) => void;
  isEnabled?: boolean;
  maxSuggestions?: number;
}

export const AITagSuggestions: React.FC<AITagSuggestionsProps> = ({
  content,
  existingTags,
  onAddTag,
  isEnabled = true,
  maxSuggestions = 5
}) => {
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAnalyzedText, setLastAnalyzedText] = useState('');
  
  // Analyze text for tag suggestions
  const analyzeTags = async () => {
    if (!content || content.trim().length < 10 || content === lastAnalyzedText) {
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const tags = await analyzeTextForTags(content);
      
      // Filter out tags that already exist
      const newTags = tags.filter(tag => !existingTags.includes(tag));
      
      // Limit to maximum number of suggestions
      const limitedTags = newTags.slice(0, maxSuggestions);
      
      setSuggestedTags(limitedTags);
      setLastAnalyzedText(content);
    } catch (err) {
      setError('Failed to analyze text for tags');
      console.error('Tag analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Auto-analyze text when content changes, with debounce
  useEffect(() => {
    if (!isEnabled || !content || content.trim().length < 10) {
      return;
    }
    
    const debounceTimeout = setTimeout(() => {
      analyzeTags();
    }, 1000); // 1 second debounce
    
    return () => clearTimeout(debounceTimeout);
  }, [content, existingTags, isEnabled]);
  
  // If disabled or no content, don't render anything
  if (!isEnabled || !content || content.trim().length < 10) {
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
              onClick={() => onAddTag(tag)}
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