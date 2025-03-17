/**
 * MediaInput Component
 * 
 * A comprehensive component for handling input of various media types
 * including text, images, videos, audio, and documents. This component
 * is designed to work well on both desktop and mobile devices, with
 * special optimizations for agricultural field use.
 */

import React, { useState, useCallback } from 'react';
import { MediaType } from './utils/mediaTypeDetection';
import { ProcessedMediaFile } from './utils/mediaProcessing';
import { FileUpload } from './inputs/FileUpload';

/**
 * Props for the MediaInput component
 */
interface MediaInputProps {
  onSubmit: (text: string, mediaFiles: ProcessedMediaFile[]) => void;
  onError?: (error: string) => void;
  className?: string;
  placeholder?: string;
  acceptedTypes?: MediaType[];
  disabled?: boolean;
  farmContext?: {
    fieldId?: string;
    fieldName?: string;
    cropType?: string;
    season?: string;
  };
}

/**
 * Input modes for the MediaInput component
 */
type InputMode = 'text' | 'media' | 'camera' | 'audio';

/**
 * MediaInput component
 */
export const MediaInput: React.FC<MediaInputProps> = ({
  onSubmit,
  onError,
  className = '',
  placeholder = 'Type a message or add media...',
  acceptedTypes = [MediaType.IMAGE, MediaType.VIDEO, MediaType.AUDIO, MediaType.DOCUMENT],
  disabled = false,
  farmContext,
}) => {
  const [text, setText] = useState('');
  const [mediaFiles, setMediaFiles] = useState<ProcessedMediaFile[]>([]);
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  /**
   * Handles text input changes
   */
  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  }, []);
  
  /**
   * Handles file selection from the FileUpload component
   */
  const handleFilesSelected = useCallback((files: ProcessedMediaFile[]) => {
    setMediaFiles(prev => [...prev, ...files]);
    setInputMode('text'); // Return to text mode after upload
  }, []);
  
  /**
   * Handles file errors
   */
  const handleFileError = useCallback((error: string) => {
    onError?.(error);
  }, [onError]);
  
  /**
   * Handles form submission
   */
  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (disabled || isSubmitting) {
      return;
    }
    
    // Don't submit if there's no text and no media files
    if (!text.trim() && mediaFiles.length === 0) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(text, mediaFiles);
      setText('');
      setMediaFiles([]);
    } catch (error) {
      console.error('Failed to submit:', error);
      onError?.(error instanceof Error ? error.message : 'Failed to submit');
    } finally {
      setIsSubmitting(false);
    }
  }, [text, mediaFiles, disabled, isSubmitting, onSubmit, onError]);
  
  /**
   * Handles key press events
   */
  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter without Shift
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);
  
  /**
   * Removes a media file
   */
  const removeMediaFile = useCallback((index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  }, []);
  
  return (
    <div className={`border rounded-lg shadow-sm overflow-hidden ${className}`}>
      {/* Media files preview */}
      {mediaFiles.length > 0 && (
        <div className="p-2 border-b flex flex-wrap gap-2">
          {mediaFiles.map((file, index) => (
            <div 
              key={index} 
              className="relative h-16 w-16 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden"
            >
              {/* Preview based on file type */}
              {file.mediaType === MediaType.IMAGE && file.previewUrl && (
                <img 
                  src={file.previewUrl} 
                  alt={file.originalFile.name}
                  className="h-full w-full object-cover"
                />
              )}
              
              {file.mediaType !== MediaType.IMAGE && (
                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <span className="text-xs">{file.mediaType}</span>
                </div>
              )}
              
              {/* Remove button */}
              <button
                type="button"
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 m-1"
                onClick={() => removeMediaFile(index)}
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Input area */}
      <div className="p-2">
        {inputMode === 'text' && (
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <textarea
                value={text}
                onChange={handleTextChange}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                disabled={disabled}
                className="w-full resize-none border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
              
              <div className="flex justify-between items-center mt-2">
                {/* Input mode buttons */}
                <div className="flex space-x-2">
                  {/* Image/video/document upload button */}
                  <button
                    type="button"
                    onClick={() => setInputMode('media')}
                    disabled={disabled}
                    className="text-gray-500 hover:text-blue-500 p-1"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </button>
                  
                  {/* Camera button - shown only on mobile */}
                  <button
                    type="button"
                    onClick={() => setInputMode('camera')}
                    disabled={disabled}
                    className="text-gray-500 hover:text-blue-500 p-1 md:hidden"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                  </button>
                  
                  {/* Audio button */}
                  <button
                    type="button"
                    onClick={() => setInputMode('audio')}
                    disabled={disabled}
                    className="text-gray-500 hover:text-blue-500 p-1"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                      ></path>
                    </svg>
                  </button>
                </div>
                
                {/* Submit button */}
                <button
                  type="submit"
                  disabled={disabled || isSubmitting || (!text.trim() && mediaFiles.length === 0)}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded px-4 py-2"
                >
                  {isSubmitting ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></div>
                  ) : (
                    'Send'
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
        
        {inputMode === 'media' && (
          <div>
            <FileUpload
              onFilesSelected={handleFilesSelected}
              onError={handleFileError}
              acceptedTypes={acceptedTypes}
              multiple={true}
              disabled={disabled}
            />
            
            <button
              type="button"
              onClick={() => setInputMode('text')}
              className="mt-2 text-blue-500 hover:underline"
            >
              Cancel
            </button>
          </div>
        )}
        
        {inputMode === 'camera' && (
          <div className="flex flex-col items-center p-4">
            <p>Camera functionality not yet implemented</p>
            <button
              type="button"
              onClick={() => setInputMode('text')}
              className="mt-2 text-blue-500 hover:underline"
            >
              Cancel
            </button>
          </div>
        )}
        
        {inputMode === 'audio' && (
          <div className="flex flex-col items-center p-4">
            <p>Audio recording functionality not yet implemented</p>
            <button
              type="button"
              onClick={() => setInputMode('text')}
              className="mt-2 text-blue-500 hover:underline"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}; 