/**
 * MediaRenderer Component
 * 
 * A unified component for rendering different types of media including
 * images, videos, audio, and documents. This component automatically
 * detects the media type and renders the appropriate display component.
 */

import React, { useState, useCallback } from 'react';
import { MediaType } from './utils/mediaTypeDetection';
import { ImageDisplay } from './displays/ImageDisplay';
import { saveMediaAsArtifact } from './integration/artifactIntegration';

/**
 * Props for the MediaRenderer component
 */
interface MediaRendererProps {
  src: string;
  mediaType: MediaType;
  alt?: string;
  title?: string;
  className?: string;
  farmContext?: {
    fieldId?: string;
    fieldName?: string;
    cropType?: string;
    season?: string;
  };
  enableSave?: boolean;
  enableZoom?: boolean;
  onSave?: (id: string) => void;
  onError?: () => void;
}

/**
 * MediaRenderer component
 */
export const MediaRenderer: React.FC<MediaRendererProps> = ({
  src,
  mediaType,
  alt = 'Media content',
  title,
  className = '',
  farmContext,
  enableSave = true,
  enableZoom = true,
  onSave,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  /**
   * Handles media load
   */
  const handleLoad = useCallback(() => {
    // Additional logic can be added here if needed
  }, []);
  
  /**
   * Handles media error
   */
  const handleError = useCallback(() => {
    onError?.();
  }, [onError]);
  
  /**
   * Handles saving the media as an artifact
   */
  const handleSave = useCallback(async () => {
    if (!enableSave) return;
    
    setIsLoading(true);
    setSaveSuccess(null);
    setSaveError(null);
    
    try {
      // Create a blob from the src URL if it's a data URL
      let fileBlob: Blob | null = null;
      
      if (src.startsWith('data:')) {
        const response = await fetch(src);
        fileBlob = await response.blob();
      }
      
      if (!fileBlob) {
        // For non-data URLs, we'd need to fetch the file
        // This is a simplified version - in a real implementation,
        // we'd need to handle different types of URLs
        const response = await fetch(src);
        fileBlob = await response.blob();
      }
      
      if (!fileBlob) {
        throw new Error('Failed to create blob from source');
      }
      
      // Create a File object from the Blob
      const filename = title || `${mediaType}-${Date.now()}`;
      const file = new File([fileBlob], filename, { type: fileBlob.type });
      
      // Create a ProcessedMediaFile object
      const processedFile = {
        originalFile: file,
        mediaType,
        previewUrl: src
      };
      
      // Save the media as an artifact
      const artifact = await saveMediaAsArtifact(processedFile, {
        title,
        farmContext,
      });
      
      // Handle success
      setSaveSuccess('Media saved successfully');
      onSave?.(artifact.id);
    } catch (error) {
      console.error('Failed to save media:', error);
      setSaveError('Failed to save media');
    } finally {
      setIsLoading(false);
    }
  }, [src, mediaType, title, farmContext, enableSave, onSave]);
  
  /**
   * Renders the appropriate media component based on type
   */
  const renderMedia = () => {
    switch (mediaType) {
      case MediaType.IMAGE:
        return (
          <ImageDisplay
            src={src}
            alt={alt}
            enableZoom={enableZoom}
            onLoad={handleLoad}
            onError={handleError}
          />
        );
      
      case MediaType.VIDEO:
        // Placeholder for video component
        return (
          <div className="flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg">
            <p>Video rendering not yet implemented</p>
            <p className="text-xs">{src}</p>
          </div>
        );
      
      case MediaType.AUDIO:
        // Placeholder for audio component
        return (
          <div className="flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg">
            <p>Audio rendering not yet implemented</p>
            <p className="text-xs">{src}</p>
          </div>
        );
      
      case MediaType.DOCUMENT:
        // Placeholder for document component
        return (
          <div className="flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg">
            <p>Document rendering not yet implemented</p>
            <p className="text-xs">{src}</p>
          </div>
        );
      
      default:
        return (
          <div className="flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg">
            <p>Unsupported media type</p>
            <p className="text-xs">{src}</p>
          </div>
        );
    }
  };
  
  return (
    <div className={`relative ${className}`}>
      {/* Media content */}
      {renderMedia()}
      
      {/* Save button */}
      {enableSave && (
        <div className="absolute top-2 right-2 flex flex-col items-end">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-md transition-colors"
          >
            {isLoading ? (
              <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></div>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                ></path>
              </svg>
            )}
          </button>
          
          {/* Save success message */}
          {saveSuccess && (
            <div className="mt-2 bg-green-500 text-white text-xs p-1 px-2 rounded shadow-md">
              {saveSuccess}
            </div>
          )}
          
          {/* Save error message */}
          {saveError && (
            <div className="mt-2 bg-red-500 text-white text-xs p-1 px-2 rounded shadow-md">
              {saveError}
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 