import React, { useRef, useEffect } from 'react';
import { Bold, Italic, Underline, List } from 'lucide-react';
import { TextareaAutosize } from './TextareaAutosize';
import { TagsInput } from './TagsInput';
import { AITagSuggestions } from './AITagSuggestions';

interface NoteEditorProps {
  content: string;
  onChange: (content: string) => void;
  isEditing: boolean;
  placeholder?: string;
  note: any;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  availableTags: string[];
}

/**
 * Enhanced note editor component with formatting toolbar
 * Supports both viewing and editing modes
 */
export const NoteEditor: React.FC<NoteEditorProps> = ({
  content,
  onChange,
  isEditing,
  placeholder = 'Write your note here...',
  note,
  onAddTag,
  onRemoveTag,
  availableTags,
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  // Set focus on the textarea when switching to edit mode
  useEffect(() => {
    if (isEditing && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [isEditing]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // Apply formatting to selected text
  const applyFormatting = (format: string) => {
    if (!textAreaRef.current) return;
    
    const textarea = textAreaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let prefix = '';
    let suffix = '';
    
    switch (format) {
      case 'Bold':
        prefix = '**';
        suffix = '**';
        break;
      case 'Italic':
        prefix = '_';
        suffix = '_';
        break;
      case 'Underline':
        prefix = '__';
        suffix = '__';
        break;
      case 'List':
        // If multiple lines are selected, add bullet to each line
        if (selectedText.includes('\n')) {
          const lines = selectedText.split('\n');
          const formattedLines = lines.map(line => line.trim() ? `- ${line}` : line);
          const newText = formattedLines.join('\n');
          
          const newContent = 
            content.substring(0, start) + 
            newText + 
            content.substring(end);
          
          onChange(newContent);
          
          // Set cursor position after inserted formatted text
          setTimeout(() => {
            if (textAreaRef.current) {
              const newPosition = start + newText.length;
              textAreaRef.current.focus();
              textAreaRef.current.setSelectionRange(newPosition, newPosition);
            }
          }, 0);
          return;
        } else {
          prefix = '- ';
          suffix = '';
        }
        break;
      default:
        return;
    }
    
    // If no text is selected, insert format markers and place cursor between them
    if (start === end) {
      const newContent = 
        content.substring(0, start) + 
        prefix + suffix + 
        content.substring(end);
      
      onChange(newContent);
      
      // Position cursor between the format markers
      setTimeout(() => {
        if (textAreaRef.current) {
          const newPosition = start + prefix.length;
          textAreaRef.current.focus();
          textAreaRef.current.setSelectionRange(newPosition, newPosition);
        }
      }, 0);
    } else {
      // Apply formatting to selected text
      const newContent = 
        content.substring(0, start) + 
        prefix + selectedText + suffix + 
        content.substring(end);
      
      onChange(newContent);
      
      // Maintain selection with format markers
      setTimeout(() => {
        if (textAreaRef.current) {
          const selectionStart = start + prefix.length;
          const selectionEnd = selectionStart + selectedText.length;
          textAreaRef.current.focus();
          textAreaRef.current.setSelectionRange(selectionStart, selectionEnd);
        }
      }, 0);
    }
  };

  // Render editor with formatting toolbar
  if (isEditing) {
    return (
      <div className="flex flex-col h-full">
        <div className="mb-4 border-b pb-2 flex">
          <button 
            type="button"
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-md h-8 w-8 flex items-center justify-center mr-1"
            onClick={() => applyFormatting('Bold')}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button 
            type="button"
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-md h-8 w-8 flex items-center justify-center mr-1"
            onClick={() => applyFormatting('Italic')}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button 
            type="button"
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-md h-8 w-8 flex items-center justify-center mr-1"
            onClick={() => applyFormatting('Underline')}
            title="Underline"
          >
            <Underline className="h-4 w-4" />
          </button>
          <button 
            type="button"
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-md h-8 w-8 flex items-center justify-center mr-1"
            onClick={() => applyFormatting('List')}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
        
        <TextareaAutosize
          ref={textAreaRef as any}
          value={content}
          onChange={handleContentChange}
          placeholder={placeholder}
          className="flex-1 resize-none border-none focus:outline-none text-gray-700 text-base p-1 bg-gray-50 rounded-md"
          minRows={10}
        />

        {/* Tag selection */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Tags</label>
          <div className="mt-1">
            <TagsInput
              tags={note.userTags}
              onAddTag={onAddTag}
              onRemoveTag={onRemoveTag}
              availableTags={availableTags}
            />
          </div>
          
          {/* Add AI Tag Suggestions */}
          <AITagSuggestions
            content={note.content}
            existingTags={[...note.userTags, ...note.aiTags]}
            onAddTag={onAddTag}
            isEnabled={true}
          />
        </div>
      </div>
    );
  }

  // Display content in read-only mode with paragraph and basic markdown formatting
  return (
    <div className="whitespace-pre-wrap text-gray-700 px-1 py-2">
      {content ? 
        content.split('\n').map((paragraph, index) => {
          // Apply basic markdown formatting
          const boldText = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          const italicText = boldText.replace(/_(.*?)_/g, '<em>$1</em>');
          const underlineText = italicText.replace(/__(.*?)__/g, '<u>$1</u>');
          const listText = underlineText.replace(/^- (.*)$/g, '• $1');
          
          return (
            <p 
              key={index} 
              className="mb-4" 
              dangerouslySetInnerHTML={{ __html: listText }}
            />
          );
        }) 
        : 
        <span className="text-gray-400">No content</span>
      }
    </div>
  );
}; 