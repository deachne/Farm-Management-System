/**
 * FileUpload Component
 * 
 * A reusable file upload component with drag-and-drop support.
 * Designed to work well on both desktop and mobile devices.
 */

import React, { useState, useRef, useCallback } from 'react';
import { MediaType, detectMediaType, getSupportedMimeTypes } from '../utils/mediaTypeDetection';
import { optimizeMediaFile, ProcessedMediaFile } from '../utils/mediaProcessing';

/**
 * Props for the FileUpload component
 */
interface FileUploadProps {
  onFilesSelected: (files: ProcessedMediaFile[]) => void;
  onError?: (error: string) => void;
  className?: string;
  acceptedTypes?: MediaType[];
  multiple?: boolean;
  maxFileSize?: number; // in bytes
  maxFiles?: number;
  disabled?: boolean;
  children?: React.ReactNode;
}

/**
 * FileUpload component
 */
export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  onError,
  className = '',
  acceptedTypes = Object.values(MediaType),
  multiple = true,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 10,
  disabled = false,
  children,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  /**
   * Handles drag events
   */
  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, [disabled]);
  
  /**
   * Processes and validates the selected files
   */
  const processFiles = useCallback(async (fileList: FileList) => {
    const files = Array.from(fileList);
    
    // Check if too many files are selected
    if (files.length > maxFiles) {
      onError?.(`Maximum ${maxFiles} files allowed`);
      return;
    }
    
    const processedFiles: ProcessedMediaFile[] = [];
    const errors: string[] = [];
    
    // Process each file
    for (const file of files) {
      // Check file size
      if (file.size > maxFileSize) {
        errors.push(`${file.name} exceeds the maximum file size of ${maxFileSize / (1024 * 1024)}MB`);
        continue;
      }
      
      // Detect media type
      const { type: mediaType, isSupported } = detectMediaType(file);
      
      // Check if the media type is accepted
      if (!acceptedTypes.includes(mediaType)) {
        errors.push(`${file.name} is not an accepted file type`);
        continue;
      }
      
      // Check if the media type is supported
      if (!isSupported) {
        errors.push(`${file.name} is not a supported file format`);
        continue;
      }
      
      try {
        // Optimize the file for upload/display
        const processedFile = await optimizeMediaFile(file, mediaType);
        processedFiles.push(processedFile);
      } catch (error) {
        console.error('Failed to process file:', error);
        errors.push(`Failed to process ${file.name}`);
      }
    }
    
    // Report errors if any
    if (errors.length > 0) {
      onError?.(errors.join('. '));
    }
    
    // If any files were successfully processed, call the callback
    if (processedFiles.length > 0) {
      onFilesSelected(processedFiles);
    }
  }, [acceptedTypes, maxFileSize, maxFiles, onError, onFilesSelected]);
  
  /**
   * Handles the drop event
   */
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;
    
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [disabled, processFiles]);
  
  /**
   * Handles the file input change event
   */
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      
      // Reset the input value so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [disabled, processFiles]);
  
  /**
   * Handles the click event to open the file dialog
   */
  const handleClick = useCallback(() => {
    if (disabled) return;
    
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);
  
  /**
   * Get the accept attribute for the file input
   */
  const getAcceptString = useCallback(() => {
    if (acceptedTypes.length === 0 || acceptedTypes.includes(MediaType.UNKNOWN)) {
      return '*/*';
    }
    
    // Map MediaType to MIME type patterns
    const mimeTypePatterns = acceptedTypes.map(type => {
      switch (type) {
        case MediaType.IMAGE:
          return 'image/*';
        case MediaType.VIDEO:
          return 'video/*';
        case MediaType.AUDIO:
          return 'audio/*';
        case MediaType.DOCUMENT:
          return '.pdf,.doc,.docx,.txt,.csv';
        default:
          return '';
      }
    }).filter(Boolean);
    
    return mimeTypePatterns.join(',');
  }, [acceptedTypes]);
  
  return (
    <div
      className={`relative ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${
        isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
      }`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
        accept={getAcceptString()}
        multiple={multiple}
        disabled={disabled}
      />
      
      {children || (
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg">
          <svg
            className="w-10 h-10 mb-3 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {acceptedTypes.includes(MediaType.IMAGE) && 'Images'}
            {acceptedTypes.includes(MediaType.VIDEO) && 
              (acceptedTypes.includes(MediaType.IMAGE) ? ', Videos' : 'Videos')}
            {acceptedTypes.includes(MediaType.AUDIO) && 
              (acceptedTypes.includes(MediaType.IMAGE) || acceptedTypes.includes(MediaType.VIDEO) 
                ? ', Audio' : 'Audio')}
            {acceptedTypes.includes(MediaType.DOCUMENT) && 
              (acceptedTypes.includes(MediaType.IMAGE) || acceptedTypes.includes(MediaType.VIDEO) || acceptedTypes.includes(MediaType.AUDIO)
                ? ', Documents' : 'Documents')}
          </p>
        </div>
      )}
    </div>
  );
}; 