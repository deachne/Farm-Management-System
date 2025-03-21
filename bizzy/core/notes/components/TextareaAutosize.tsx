import React, { useRef, useEffect } from 'react';

interface TextareaAutosizeProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  minRows?: number;
  maxRows?: number;
}

/**
 * Basic TextareaAutosize component that manually adjusts its height based on content
 * Simple implementation that doesn't require an external library
 */
export const TextareaAutosize = React.forwardRef<HTMLTextAreaElement, TextareaAutosizeProps>(
  ({ minRows = 3, maxRows = 10, onChange, className, ...props }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    
    // Adjust the height of the textarea based on its content
    const adjustHeight = () => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      
      // Reset the height to get the correct scrollHeight
      textarea.style.height = 'auto';
      
      // Calculate the number of rows based on scrollHeight
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 20;
      const paddingTop = parseInt(getComputedStyle(textarea).paddingTop) || 0;
      const paddingBottom = parseInt(getComputedStyle(textarea).paddingBottom) || 0;
      const border = parseInt(getComputedStyle(textarea).borderTopWidth) + 
                     parseInt(getComputedStyle(textarea).borderBottomWidth) || 0;
      
      const baseHeight = lineHeight * minRows + paddingTop + paddingBottom + border;
      const maxHeight = lineHeight * maxRows + paddingTop + paddingBottom + border;
      
      const newHeight = Math.min(Math.max(baseHeight, textarea.scrollHeight), maxHeight);
      textarea.style.height = `${newHeight}px`;
    };
    
    // Adjust height on mount and when content changes
    useEffect(() => {
      adjustHeight();
    }, [props.value]);
    
    // Handle textarea reference
    useEffect(() => {
      if (textareaRef.current) {
        if (typeof ref === 'function') {
          ref(textareaRef.current);
        } else if (ref) {
          ref.current = textareaRef.current;
        }
        adjustHeight();
      }
    }, [ref]);
    
    // Handle onChange with height adjustment
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (onChange) {
        onChange(e);
      }
      adjustHeight();
    };
    
    return (
      <textarea
        ref={textareaRef}
        onChange={handleChange}
        className={`resize-none overflow-hidden ${className || ''}`}
        rows={minRows}
        {...props}
      />
    );
  }
); 