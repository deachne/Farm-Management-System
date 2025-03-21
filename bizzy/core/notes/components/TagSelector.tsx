import React from 'react';
import { X } from 'lucide-react';

interface TagSelectorProps {
  tag: string;
  onRemove: (tag: string) => void;
  className?: string;
}

/**
 * Component for displaying a single tag with remove functionality
 */
export const TagSelector: React.FC<TagSelectorProps> = ({
  tag,
  onRemove,
  className = '',
}) => {
  return (
    <div
      className={`
        inline-flex items-center gap-1 px-2 py-0.5
        bg-blue-50 text-blue-700 border border-blue-200
        rounded-full text-xs font-medium ${className}
      `}
    >
      {tag}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(tag);
        }}
        className="text-blue-400 hover:text-blue-700 focus:outline-none ml-1"
        aria-label={`Remove ${tag} tag`}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}; 