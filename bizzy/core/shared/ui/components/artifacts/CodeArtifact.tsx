import React, { useState } from 'react';

interface CodeArtifactProps {
  language: string;
  code: string;
  output?: string;
  isExpanded?: boolean;
  onSave?: (artifactData: any) => void;
}

/**
 * Component for rendering code artifacts
 * Includes syntax highlighting, copy functionality, and collapsible sections
 */
const CodeArtifact: React.FC<CodeArtifactProps> = ({
  language,
  code,
  output = '',
  isExpanded = true,
  onSave
}) => {
  const [expanded, setExpanded] = useState(isExpanded);
  const [copied, setCopied] = useState(false);

  // Handle copying code to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  // Handle saving code as a file or to farm management system
  const handleSave = () => {
    if (onSave) {
      onSave({
        type: 'code',
        language,
        content: code,
        output,
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <div className="mb-4 border border-theme-sidebar-border rounded-md overflow-hidden bg-theme-bg-secondary">
      {/* Header with language and controls */}
      <div className="flex items-center justify-between px-4 py-2 bg-theme-bg-primary border-b border-theme-sidebar-border">
        <div className="flex items-center">
          <span className="font-medium text-theme-text-primary mr-2">
            {language.charAt(0).toUpperCase() + language.slice(1)}
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

      {/* Code display */}
      {expanded && (
        <div className="overflow-auto">
          <pre className="p-4 text-sm overflow-auto max-h-[500px] whitespace-pre-wrap text-theme-text-primary">
            <code className={`language-${language}`}>
              {code}
            </code>
          </pre>
          
          {/* Output display (if available) */}
          {output && (
            <div className="border-t border-theme-sidebar-border bg-theme-bg-tertiary">
              <div className="px-4 py-2 text-sm font-medium text-theme-text-secondary">Output</div>
              <pre className="p-4 text-sm overflow-auto max-h-[200px] whitespace-pre-wrap text-theme-text-primary bg-theme-bg-tertiary">
                {output}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CodeArtifact; 