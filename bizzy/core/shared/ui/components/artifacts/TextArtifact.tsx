import React, { useState } from 'react';

interface TextArtifactProps {
  textContent: string;
  isExpanded?: boolean;
  onSave?: (artifactData: any) => void;
}

/**
 * Component for rendering text artifacts from LibreChat
 * Provides formatted text display with copy and save functionality
 */
const TextArtifact: React.FC<TextArtifactProps> = ({
  textContent,
  isExpanded = true,
  onSave
}) => {
  const [expanded, setExpanded] = useState(isExpanded);
  const [copied, setCopied] = useState(false);

  // Handle copying text to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  // Handle saving text
  const handleSave = () => {
    if (onSave) {
      onSave({
        type: 'text',
        content: textContent,
        timestamp: new Date().toISOString()
      });
    }
  };

  // Detect if there might be farm-specific information in the text
  const hasFarmContent = () => {
    const farmTerms = [
      'crop', 'field', 'harvest', 'yield', 'soil', 'moisture', 'fertilizer',
      'pesticide', 'irrigation', 'planting', 'tractor', 'acre', 'hectare'
    ];
    
    const lowercaseText = textContent.toLowerCase();
    return farmTerms.some(term => lowercaseText.includes(term));
  };

  // Render the component
  return (
    <div className="mb-4 border border-theme-sidebar-border rounded-md overflow-hidden bg-theme-bg-secondary">
      {/* Header with controls */}
      <div className="flex items-center justify-between px-4 py-2 bg-theme-bg-primary border-b border-theme-sidebar-border">
        <div className="flex items-center">
          <span className="font-medium text-theme-text-primary mr-2">
            Text {hasFarmContent() ? '(Farm Related)' : ''}
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs px-2 py-1 rounded bg-theme-overlay-hover text-theme-text-secondary hover:bg-theme-overlay-active"
          >
            {expanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handleCopy}
            className="text-xs px-2 py-1 rounded bg-theme-overlay-hover text-theme-text-secondary hover:bg-theme-overlay-active"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          {onSave && (
            <button
              onClick={handleSave}
              className="text-xs px-2 py-1 rounded bg-theme-overlay-hover text-theme-text-secondary hover:bg-theme-overlay-active"
            >
              Save
            </button>
          )}
        </div>
      </div>

      {/* Text content */}
      {expanded && (
        <div className="p-4">
          <div className="whitespace-pre-wrap text-theme-text-primary overflow-auto max-h-[500px]">
            {textContent || (
              <span className="italic text-theme-text-secondary">No text content</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TextArtifact; 