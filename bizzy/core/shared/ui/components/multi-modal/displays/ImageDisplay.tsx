/**
 * ImageDisplay Component
 * 
 * A component for displaying images with loading states and error handling.
 * Optimized for both desktop and mobile viewing.
 */

import React, { useState, useCallback, CSSProperties } from 'react';

/**
 * Props for the ImageDisplay component
 */
interface ImageDisplayProps {
  src: string;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  maxWidth?: number | string;
  maxHeight?: number | string;
  onClick?: () => void;
  onLoad?: () => void;
  onError?: () => void;
  enableZoom?: boolean;
}

/**
 * ImageDisplay component
 */
export const ImageDisplay: React.FC<ImageDisplayProps> = ({
  src,
  alt = 'Image',
  className = '',
  style = {},
  maxWidth = '100%',
  maxHeight = 'auto',
  onClick,
  onLoad,
  onError,
  enableZoom = false,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  
  /**
   * Handles the image load event
   */
  const handleLoad = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);
  
  /**
   * Handles the image error event
   */
  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  }, [onError]);
  
  /**
   * Toggles the zoom state
   */
  const toggleZoom = useCallback(() => {
    if (enableZoom) {
      setIsZoomed(!isZoomed);
    }
    
    onClick?.();
  }, [enableZoom, isZoomed, onClick]);
  
  return (
    <div 
      className={`relative overflow-hidden rounded-lg ${className}`} 
      style={{
        maxWidth,
        ...style,
      }}
    >
      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
        </div>
      )}
      
      {/* Error state */}
      {hasError && (
        <div className="flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
          <svg
            className="w-10 h-10 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            ></path>
          </svg>
          <p>Failed to load image</p>
        </div>
      )}
      
      {/* Image */}
      {!hasError && (
        <img
          src={src}
          alt={alt}
          className={`max-w-full h-auto transition-opacity duration-200 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          } ${enableZoom ? 'cursor-zoom-in' : ''} ${isZoomed ? 'scale-150' : 'scale-100'}`}
          style={{
            maxHeight,
            transition: 'transform 0.3s ease',
            transformOrigin: 'center',
            ...isZoomed && {
              cursor: 'zoom-out',
            },
          }}
          onLoad={handleLoad}
          onError={handleError}
          onClick={toggleZoom}
        />
      )}
      
      {/* Mobile-friendly indicators */}
      {enableZoom && !isLoading && !hasError && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full md:hidden">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
            ></path>
          </svg>
        </div>
      )}
    </div>
  );
}; 